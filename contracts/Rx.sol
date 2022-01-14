// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
// import "@openzeppelin/contracts/utils/Counters.sol";
// import { Base64 } from "base64-sol/base64.sol";
import { RxStructs } from "./libraries/RxStructs.sol";
import { TokenURIDescriptor } from "./libraries/TokenURIDescriptor.sol";

/// @title A NFT Prescription creator
/// @author Matias Parij (@7i7o)
/// @notice You can use this contract only as a MVP for minting Prescriptions
/// @dev Features such as workplaces for doctors or pharmacists are for future iterations
contract Rx is ERC721, ERC721URIStorage, ERC721Burnable, AccessControl {

    /// @notice Role definition for Minter
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    /// @notice Role definition for Minter
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    /// @notice Role definition for Burner
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");


    /** Begin of State Variables & Events */
    // uint8 internal constant MAX_KEY_LENGTH = 20;
    // uint8 internal constant MAX_VALUE_LENGTH = 62;
    uint8 internal constant RX_LINES = 12; // Has to be same value as in RxStructs !!!

    bool private selfGrantAdmin = false;

    /// @notice TokenId enumeration (start at '1').
    uint256 private _tokenIdCounter;

    /// @notice this mapping holds all the subjects registered in the contract
    mapping ( address => RxStructs.Subject ) private subjects;

    /// @notice this mapping holds all the doctors registered in the contract
    mapping ( address => RxStructs.Doctor ) private doctors;

    /// @notice this mapping holds all the pharmacists registered in the contract
    mapping ( address => RxStructs.Pharmacist ) private pharmacists;

    /// @notice this mapping holds all the prescriptions minted in the contract
    mapping ( uint256 => RxStructs.RxData ) private rxs;

    /// @notice Event to signal when a new Rx has been minted
    /// @param sender address of the Doctor that minted the Rx
    /// @param receiver address of the Subject that received the Rx minted
    /// @param tokenId Id of the Token (Rx) that has been minted
    event minted(address indexed sender, address indexed receiver, uint256 indexed tokenId);

    /// @notice Event to signal when adding/replacing a Subject allowed to receive/hold NFT Prescriptions
    /// @param sender is the address of the admin that set the Subject's data
    /// @param _subjectId is the registered address of the subject (approved for holding NFT Prescriptions)
    /// @param _birthDate is the subjects' date of birth, in seconds, from UNIX Epoch (1970-01-01)
    /// @param _nameA is the subject's full name (uses 2 bytes32)
    /// @param _nameB is the subject's full name (uses 2 bytes32)
    /// @param _homeAddressA is the subject's legal home address (uses 2 bytes32)
    /// @param _homeAddressB is the subject's legal home address (uses 2 bytes32)
    event subjectDataSet(address indexed sender, address indexed _subjectId, uint256 _birthDate, bytes32 _nameA, bytes32 _nameB, bytes32 _homeAddressA, bytes32 _homeAddressB);

    /// @notice Event to signal when adding/replacing a Doctor allowed to mint NFT Prescriptions
    /// @param sender is the address of the admin that set the Doctor's data
    /// @param _subjectId is the ethereum address for the doctor (same Id as the subject that holds this doctor's personal details)
    /// @param _degree contains a string with the degree of the doctor
    /// @param _license contains a string with the legal license of the doctor
    event doctorDataSet(address indexed sender, address indexed _subjectId, bytes32 _degree, bytes32 _license);
    
    /// @notice Event to signal when adding/replacing a Pharmacist allowed to burn NFT Prescriptions
    /// @param sender is the address of the admin that set the Pharmacist's data
    /// @param _subjectId is the ethereum address for the pahrmacist (same Id as the subject that holds this pharmacist's personal details)
    /// @param _degree contains a string with the degree of the pharmacist
    /// @param _license contains a string with the legal license of the pharmacist
    event pharmacistDataSet(address indexed sender, address indexed _subjectId, bytes32 _degree, bytes32 _license);

    /// @notice Event to signal a removed Subject
    /// @param sender is the address of the admin that removed the Subject
    /// @param _subjectId is the registered address of the subject removed
    event subjectRemoved(address indexed sender, address indexed _subjectId);

    /// @notice Event to signal a removed Doctor
    /// @param sender is the address of the admin that removed the Doctor
    /// @param _subjectId is the registered address of the doctor removed
    event doctorRemoved(address indexed sender, address indexed _subjectId);

    /// @notice Event to signal a removed Pharmacist
    /// @param sender is the address of the admin that removed the Pharmacist
    /// @param _subjectId is the registered address of the pharmacist removed
    event pharmacistRemoved(address indexed sender, address indexed _subjectId);

    /** End of State Variables & Events */

    /// @notice constructor for NFT Prescriptions contract
    /// @dev Using ERC721 default constructor with "Prescription" and "Rx" as Name and Symbol for the tokens
    /// @dev We set up the contract creator (msg.sender) with the ADMIN_ROLE to manage all the other Roles
    /// @dev We increment the counter in the constructor to start Ids in 1, keeping Id 0 (default for uints
    ///      in solidity) to signal that someone doesn't have any NFTs
    constructor() ERC721("Rx", "Rx") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);

        grantRole(ADMIN_ROLE, msg.sender);

        _setRoleAdmin(MINTER_ROLE, ADMIN_ROLE);
        _setRoleAdmin(BURNER_ROLE, ADMIN_ROLE);

        _tokenIdCounter = 1;
    }

    /// @dev function override required by solidity
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
        {
            return super.supportsInterface(interfaceId);
    }

    /** Begin of implementation of functions for final project */

    /// @dev Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.
    function transferOwnership(address newOwner)
        public
        onlyRole(DEFAULT_ADMIN_ROLE) 
        {
            grantRole(DEFAULT_ADMIN_ROLE, newOwner);
            renounceRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /// @dev Checks if _addr is a Subject
    function isSubject(address _addr) private view returns (bool) {
        return (
                _addr != address(0)
            &&  subjects[_addr].subjectId == _addr
        );
    }

    /// @dev Checks if _addr is a registered doctor
    function isDoctor(address _addr) private view returns (bool) {
        return (
                _addr != address(0)
            && doctors[_addr].subjectId == _addr
        );
    }

    /// @dev Checks if _addr is a registered pharmacist
    function isPharmacist(address _addr) private view returns (bool) {
        return (
                _addr != address(0)
            &&  pharmacists[_addr].subjectId == _addr
        );
    }

    /// @notice function override to prohibit token transfers
    function _transfer(address, address, uint256)
        internal
        view
        override(ERC721)
        {
            require(msg.sender == address(0), "RX: Rxs are untransferables");
    }

    /// @notice Funtion to mint a Prescription. Should be called only by a Doctor (has MINTER_ROLE)
    /// @param to The id of the subject (patient) recipient of the prescription
    /// @param _keys Text lines with the 'title' of each content of the prescription (max 19 characters each)
    /// @param _values Text lines with the 'content' of the prescription (max 61 characters each)
    /// @dev Does NOT store a tokenURI. It stores Prescription data on contract (tokenURI is generated upon request)
    function mint(address to, bytes32[RX_LINES] memory _keys, bytes32[2*RX_LINES] memory _values)
        public
        onlyRole(MINTER_ROLE)
        {
            require( isSubject(to), 'RX: Not a Subject');
            require( (msg.sender != to) , 'RX: Cannot self-prescribe');

            uint256 tokenId = _tokenIdCounter++;
            super._safeMint(to, tokenId);

            // Store prescription data in contract, leaving tokenURI empty, for it is generated on request (Uniswap V3 style!)
            rxs[tokenId].date = block.timestamp;
            rxs[tokenId].patient = getSubject(to); // Patient Info
            rxs[tokenId].doctorSubject = getSubject(msg.sender); // Doctor (Subject) Info
            rxs[tokenId].doctor = getDoctor(msg.sender); // Doctor Info
            rxs[tokenId].keys = _keys; // Rx Keys
            rxs[tokenId].values = _values; // Rx values

            emit minted(msg.sender, to, tokenId);
    }

    /// @dev function override required by solidity
    /// @notice function override to store burner data in the rx before burning
    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
        onlyRole(BURNER_ROLE)
        {
            // delete rxs[tokenId]; // Keep Rx Data to be able to view past (dispensed) Prescriptions
            require(
                getApproved(tokenId) == msg.sender ||
                isApprovedForAll(ownerOf(tokenId), msg.sender),
                "pharm not approved");
            // We save the burner (pharmacist) data to the Rx
            rxs[tokenId].pharmacistSubject = getSubject(msg.sender);
            rxs[tokenId].pharmacist = getPharmacist(msg.sender);
            super._burn(tokenId);
            //TODO: Change prescription life cycle in 'Status' to keep prescription data without burning
    }

    /// @dev TokenURI generated on the fly from stored data (function override required by solidity)  
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
        {
            // require(_exists(tokenId), "nonexistent token");
            require(tokenId < _tokenIdCounter, "nonminted token"); // Also show TokenURI for 'dispensed' prescriptions
            return TokenURIDescriptor.constructTokenURI(tokenId, name(), symbol(), rxs[tokenId]);
            // TODO: Only show TokenURI to authorized people (patient, doctor, pharmacist)
            // TODO: Modify SVG when a prescription is 'dispensed'
    }

    /// @notice Function to get data for a specific tokenId. Only for Doctor, Patient or Pharmacist of the tokenId.
    /// @param tokenId uint256 representing an existing tokenId
    /// @return a RxData struct containing all the Rx Data
    function getRx(uint256 tokenId)
        public
        view
        returns (RxStructs.RxData memory)
        {
            return rxs[tokenId];
            // TODO: Only show TokenURI to authorized people (patient, doctor, pharmacist)
    }

    /// @notice Function to set selfGrantAdmin (only deployer of contract is allowed)
    /// @param _selfAdmin bool to set state variable
    function setSelfGrantAdmin(bool _selfAdmin)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
        {
            selfGrantAdmin = _selfAdmin;
    }

    /// @notice Function to set selfGrantAdmin (only deployer of contract is allowed)
    /// @return bool with state variable
    function getSelfGrantAdmin()
        public
        view
        returns (bool)
        {
            return selfGrantAdmin;
    }

    /// @notice Function to add an admin account
    /// @param to Address of the account to grant admin role
    function addAdmin(address to)
        public
        {
            if (!selfGrantAdmin) {
                grantRole(ADMIN_ROLE, to);
            } else {
                // We skip role manager checks for the final project presentation
                _grantRole(ADMIN_ROLE, to);
            }
    }

    /// @notice Function to remove an admin account
    /// @param to Address of the account to remove admin role
    function removeAdmin(address to)
        public
        onlyRole(ADMIN_ROLE)
        {
            revokeRole(ADMIN_ROLE, to);
    }

    /// @notice Function to check if someone has admin role
    /// @param to address to check for admin role privilege
    /// @return true if @param to is an admin or false otherwise
    function isAdmin(address to)
        public
        view
        returns (bool)
        {
            return hasRole(ADMIN_ROLE, to);
    }

    /// @notice Function to retrieve a Subject
    /// @param _subjectId the registered address of the subject to retrieve
    /// @return an object with the Subject
    function getSubject(address _subjectId)
        public
        view
        returns (RxStructs.Subject memory)
        {
            return subjects[_subjectId];
    }

    /// @notice Function to retrieve a Doctor
    /// @param _subjectId the registered address of the doctor to retrieve
    /// @return an object with the Doctor
    function getDoctor(address _subjectId)
        public
        view
        returns (RxStructs.Doctor memory) 
        {
            return doctors[_subjectId];
    }

    /// @notice Function to retrieve a Pharmacist
    /// @param _subjectId the registered address of the pharmacist to retrieve
    /// @return an object with the Pharmacist
    function getPharmacist(address _subjectId)
        public
        view
        returns (RxStructs.Pharmacist memory)
        {
            return pharmacists[_subjectId];
    }

    /// @notice Function to add/replace a Subject allowed to receive/hold NFT Prescriptions
    /// @param _subjectId is the registered address of the subject (approved for holding NFT Prescriptions)
    /// @param _birthDate is the subjects' date of birth, in seconds, from UNIX Epoch (1970-01-01)
    /// @param _nameA is the subject's full name (uses 2 bytes32)
    /// @param _nameB is the subject's full name (uses 2 bytes32)
    /// @param _homeAddressA is the subject's legal home address (uses 2 bytes32)
    /// @param _homeAddressB is the subject's legal home address (uses 2 bytes32)
    /// @dev Only ADMIN_ROLE users are allowed to modify subjects
    function setSubjectData(address _subjectId, uint256 _birthDate, bytes32 _nameA, bytes32 _nameB, bytes32 _homeAddressA, bytes32 _homeAddressB)
        public
        onlyRole(ADMIN_ROLE)
        {
            require ( _subjectId != address(0), 'RX: Cannot register 0x0 address');

            // subjects[_subjectId] = RxStructs.Subject(_subjectId, _birthDate, _nameA, _nameB, _homeAddressA, _homeAddressB);
            subjects[_subjectId].subjectId = _subjectId;
            subjects[_subjectId].birthDate = _birthDate;
            subjects[_subjectId].nameA = _nameA;
            subjects[_subjectId].nameB = _nameB;
            subjects[_subjectId].homeAddressA = _homeAddressA;
            subjects[_subjectId].homeAddressB = _homeAddressB;
            
            emit subjectDataSet(msg.sender, _subjectId, _birthDate, _nameA, _nameB, _homeAddressA, _homeAddressB);
    }

    /// @notice Function to add/replace a Doctor allowed to mint NFT Prescriptions
    /// @param _subjectId should be a valid ethereum address (same Id as the subject that holds this doctor's personal details)
    /// @param _degree should contain the degree of the doctor
    /// @param _license should contain the legal license of the doctor
    /// @dev @param _workplaces is a feature for future implementations
    function setDoctorData(address _subjectId, bytes32 _degree, bytes32 _license) //, address[] calldata _workplaces)
        public
        onlyRole(ADMIN_ROLE)
        {
            require( isSubject(_subjectId), 'RX: Not a Subject'); // Also checks address!=0x0

            grantRole(MINTER_ROLE, _subjectId);
            // doctors[_subjectId] = RxStructs.Doctor(_subjectId, _degree, _license);
            doctors[_subjectId].subjectId = _subjectId;
            doctors[_subjectId].degree = _degree;
            doctors[_subjectId].license = _license;
            emit doctorDataSet(msg.sender, _subjectId, _degree, _license);
    }

    /// @notice Function to add/replace a Pharmacist allowed to burn NFT Prescriptions
    /// @param _subjectId should be a valid ethereum address (same Id as the subject that holds this pharmacist's personal details)
    /// @param _degree should contain the degree of the pharmacist
    /// @param _license should contain the legal license of the pharmacist
    /// @dev @param _workplaces is a feature for future implementations
    function setPharmacistData(address _subjectId, bytes32 _degree, bytes32 _license) //, address[] calldata _workplaces)
        public
        onlyRole(ADMIN_ROLE)
        {
            require( isSubject(_subjectId), 'RX: Not a Subject'); // Also checks address!=0x0

            grantRole(BURNER_ROLE, _subjectId);
            // pharmacists[_subjectId] = RxStructs.Pharmacist(_subjectId, _degree, _license);
            pharmacists[_subjectId].subjectId = _subjectId;
            pharmacists[_subjectId].degree = _degree;
            pharmacists[_subjectId].license = _license;
            emit pharmacistDataSet(msg.sender, _subjectId, _degree, _license);
    }

    /// @notice Function to remove a registered Subject 
    /// @param _subjectId is the registered address of the subject to remove
    /// @dev Only ADMIN_ROLE users are allowed to remove subjects
    function removeSubject(address _subjectId)
        public
        onlyRole(ADMIN_ROLE)
        {
            require( isSubject(_subjectId), 'RX: Not a Subject'); // Also checks address!=0x0
            require( !isDoctor(_subjectId), 'RX: Still a Doctor');
            require( !isPharmacist(_subjectId), 'RX: Still a Pharmacist');

            delete subjects[_subjectId];
            emit subjectRemoved(msg.sender, _subjectId);
    }

    /// @notice Function to remove a registered Doctor
    /// @param _subjectId is the registered address of the doctor to remove
    /// @dev Only ADMIN_ROLE users are allowed to remove doctors
    function removeDoctor(address _subjectId)
        public
        onlyRole(ADMIN_ROLE)
        {
            require( isDoctor(_subjectId), 'RX: Not a Doctor'); // Also checks address!=0x0

            revokeRole(MINTER_ROLE, _subjectId);
            delete doctors[_subjectId];
            emit doctorRemoved(msg.sender, _subjectId);
    }

    /// @notice Function to remove a registered Pharmacist
    /// @param _subjectId is the registered address of the pharmacist to remove
    /// @dev Only ADMIN_ROLE users are allowed to remove pharmacists
    function removePharmacist(address _subjectId)
        public
        onlyRole(ADMIN_ROLE)
        {
            require( isPharmacist(_subjectId), 'RX: Not a Pharmacist'); // Also checks address!=0x0

            revokeRole(BURNER_ROLE, _subjectId);
            delete pharmacists[_subjectId];
            emit pharmacistRemoved(msg.sender, _subjectId);
    }

}