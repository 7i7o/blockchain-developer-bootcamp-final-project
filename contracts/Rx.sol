// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
// import { Base64 } from "base64-sol/base64.sol";
import { RxStructs } from "./libraries/RxStructs.sol";
import { TokenURIDescriptor } from "./libraries/TokenURIDescriptor.sol";

/// @title A NFT Prescription creator
/// @author Matias Parij (@7i7o)
/// @notice You can use this contract only as a MVP for minting Prescriptions
/// @dev Features such as workplaces for doctors or pharmacists are for future iterations
contract Rx is ERC721, ERC721URIStorage, ERC721Burnable, AccessControl {

    /// @notice Using OpenZeppelin's Counters for TokenId enumeration
    using Counters for Counters.Counter;

    /// @notice Role definition for Minter
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    /// @notice Role definition for Minter
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    /// @notice Role definition for Burner
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    /// @notice Using OpenZeppelin's Counters for TokenId enumeration
    /// @dev We increment the counter in the constructor to start Ids in 1, keeping Id 0 (default for
    ///      uints in solidity) to signal that someone doesn't have any NFTs
    Counters.Counter private _tokenIdCounter;

    /** Begin of State Variables & Modifiers for final project */

    bool private pausableRolePaused = false;

    uint256 constant MAX_KEY_LENGTH = 20;
    uint256 constant MAX_VALUE_LENGTH = 62;
    uint256 constant RX_LINES = 12; // Has to be same value as in RxStructs !!!

    /// @notice this mapping holds all the subjects registered in the contract
    mapping ( address => RxStructs.Subject ) private subjects;

    /// @notice this mapping holds all the doctors registered in the contract
    mapping ( address => RxStructs.Doctor ) private doctors;

    /// @notice this mapping holds all the pharmacists registered in the contract
    mapping ( address => RxStructs.Pharmacist ) private pharmacists;

    /// @notice this mapping holds all the prescriptions minted in the contract
    mapping (uint256 => RxStructs.RxData) private rxs;

    /// @dev Modifier that checks that an account is actually a registered subject
    modifier isSubject(address _subjectId) {
        require( (_subjectId != address(0) && subjects[_subjectId].subjectId == _subjectId) ,
                    'not a subject'
                );
        _;
    }

    /// @dev Modifier that checks that an account is a registered doctor
    modifier isDoctor(address _subjectId) {
        require( (_subjectId != address(0) && doctors[_subjectId].subjectId == _subjectId) ,
                    'not a doc'
                );
        _;
    }

    /// @dev Modifier that checks that an account is NOT a registered doctor
    modifier isNotDoctor(address _subjectId) {
        require( (doctors[_subjectId].subjectId == address(0)) ,
                    'is a Doctor'
                );
        _;
    }

    /// @dev Modifier that checks that an account is a registered pharmacist
    modifier isPharmacist(address _subjectId) {
        require( (_subjectId != address(0) && pharmacists[_subjectId].subjectId == _subjectId) ,
                    'not a pharm'
                );
        _;
    }

    /// @dev Modifier that checks that an account is NOT a registered pharmacist
    modifier isNotPharmacist(address _subjectId) {
        require( (pharmacists[_subjectId].subjectId == address(0)) ,
                    'is a pharm'
                );
        _;
    }

    /// @dev Function to allow accounts not registered as patient to have a pausable role
    function onlyPausableRole(bytes32 role) private view {
        if (!pausableRolePaused) {
            _checkRole(role, _msgSender());
        } else {
            // Not registered accounts act as pausable role
            require( subjects[_msgSender()].subjectId == address(0) || hasRole(role, _msgSender()), 'is a patient');
        }
        // _;
    }

    /// @notice Event to signal when a new Rx has been minted
    /// @param sender address of the Doctor that minted the Rx
    /// @param receiver address of the Subject that received the Rx minted
    /// @param tokenId Id of the Token (Rx) that has been minted
    event minted(address indexed sender, address indexed receiver, uint256 indexed tokenId);

    /// @notice Event to signal when adding/replacing a Subject allowed to receive/hold NFT Prescriptions
    /// @param sender is the address of the admin that set the Subject's data
    /// @param _subjectId is the registered address of the subject (approved for holding NFT Prescriptions)
    /// @param _birthDate is the subjects' date of birth, in seconds, from UNIX Epoch (1970-01-01)
    /// @param _name is the subject's full name
    /// @param _homeAddress is the subject's legal home address
    event subjectDataSet(address indexed sender, address indexed _subjectId, uint256 _birthDate, string _name, string _homeAddress);

    /// @notice Event to signal when adding/replacing a Doctor allowed to mint NFT Prescriptions
    /// @param sender is the address of the admin that set the Doctor's data
    /// @param _subjectId is the ethereum address for the doctor (same Id as the subject that holds this doctor's personal details)
    /// @param _degree contains a string with the degree of the doctor
    /// @param _license contains a string with the legal license of the doctor
    event doctorDataSet(address indexed sender, address indexed _subjectId, string _degree, string _license);
    
    /// @notice Event to signal when adding/replacing a Pharmacist allowed to burn NFT Prescriptions
    /// @param sender is the address of the admin that set the Pharmacist's data
    /// @param _subjectId is the ethereum address for the pahrmacist (same Id as the subject that holds this pharmacist's personal details)
    /// @param _degree contains a string with the degree of the pharmacist
    /// @param _license contains a string with the legal license of the pharmacist
    event pharmacistDataSet(address indexed sender, address indexed _subjectId, string _degree, string _license);

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

    /** End of State Variables & Modifiers for final project */

    /// @notice constructor for NFT Prescriptions contract
    /// @dev Using ERC721 default constructor with "Prescription" and "Rx" as Name and Symbol for the tokens
    /// @dev We set up the contract creator (msg.sender) with the ADMIN_ROLE to manage all the other Roles
    /// @dev We increment the counter in the constructor to start Ids in 1, keeping Id 0 (default for uints
    ///      in solidity) to signal that someone doesn't have any NFTs
    constructor() ERC721("Rx", "Rx") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);

        // _setRoleAdmin(ADMIN_ROLE, ADMIN_ROLE);  // ADMIN role to manage all 3 roles
        _setRoleAdmin(MINTER_ROLE, ADMIN_ROLE);
        _setRoleAdmin(BURNER_ROLE, ADMIN_ROLE);

        grantRole(ADMIN_ROLE, msg.sender);

        // _setupRole(MINTER_ROLE, msg.sender); // MINTER_ROLE reserved for Doctors only
        // _setupRole(BURNER_ROLE, msg.sender); // BURNER_ROLE reserved for Pharmacists only

        _tokenIdCounter.increment();
    }

    /// @dev function override required by solidity
    /// @notice function override to store burner data in the rx before burning
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) onlyRole(BURNER_ROLE) {
        // delete rxs[tokenId]; // Keep Rx Data to be able to view past Rxs
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
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        require(_exists(tokenId), "nonexistent token");
        return TokenURIDescriptor.constructTokenURI(tokenId, name(), symbol(), rxs[tokenId]);
    }

    /// @dev function override required by solidity
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    /** Begin of implementation of functions for final project */

    /// @notice Function to verify string length and validate data input
    /// @param maxLength Maximum string length
    function _validateStrings(uint256 maxLength, string[RX_LINES] calldata stringArray) internal pure returns (bool) {
        for (uint256 i = 0; i < RX_LINES; i++) {
            if ( bytes(stringArray[i]).length >= maxLength) {
                return false;
            }
        }
        return true;
    }

    /// @notice Funtion to mint a Prescription. Should be called only by a Doctor (has MINTER_ROLE)
    /// @param to The id of the subject (patient) recipient of the prescription
    /// @param _keys Text lines with the 'title' of each content of the prescription (max 19 characters each)
    /// @param _values Text lines with the 'content' of the prescription (max 61 characters each)
    /// @dev Does NOT store a tokenURI. It stores Prescription data on contract (tokenURI is generated upon request)
    function mint(address to, string[RX_LINES] calldata _keys, string[RX_LINES] calldata _values)
        public
        onlyRole(MINTER_ROLE)
        isSubject(to) 
        {
            require( (msg.sender != to) , 'mint to yourself');
            require( _validateStrings( MAX_KEY_LENGTH, _keys ) , 'key 2 long' );
            require( _validateStrings( MAX_VALUE_LENGTH, _values ) , 'value 2 long' );

            uint256 tokenId = _tokenIdCounter.current();
            _tokenIdCounter.increment();
            super._safeMint(to, tokenId);

            // Store prescription data in contract, leaving tokenURI empty, for it is generated on request (Uniswap V3 style!)
            rxs[tokenId] = RxStructs.RxData(
                                block.timestamp,
                                getSubject(to),
                                getSubject(msg.sender),
                                RxStructs.Subject(address(0), 0, '', ''),
                                getDoctor(msg.sender),
                                RxStructs.Pharmacist(address(0), '', ''),
                                _keys,
                                _values);

            emit minted(msg.sender, to, tokenId);
    }

    /// @notice Function to get data for a specific tokenId. Only for Doctor, Patient or Pharmacist of the tokenId.
    /// @param tokenId uint256 representing an existing tokenId
    /// @return a RxData struct containing all the Rx Data
    function getRx(uint256 tokenId) public view returns (RxStructs.RxData memory) {
        return rxs[tokenId];
    }

    /// @notice Function to set pausableRolePaused (only deployer of contract is allowed)
    /// @param _paused bool to set state variable
    function setPausableRolePaused(bool _paused) public onlyRole(DEFAULT_ADMIN_ROLE) {
        pausableRolePaused = _paused;
    }

    /// @notice Function to set pausableRolePaused (only deployer of contract is allowed)
    /// @return bool with state variable
    function getPausableRolePaused() public view returns (bool) {
        return pausableRolePaused;
    }

    /// @notice function override to prohibit token transfers
    function _transfer(address from, address to, uint256 tokenId ) internal view override(ERC721) {
        require(msg.sender == address(0), "rxs are untransferable");
    }

    /// @notice Function to add an admin account
    /// @param to Address of the account to grant admin role
    function addAdmin(address to) public   {
        // onlyPausableRole(ADMIN_ROLE);
        if (!pausableRolePaused) {
            grantRole(ADMIN_ROLE, to);
        } else {
            // if ( subjects[_msgSender()].subjectId == address(0) || hasRole(role, _msgSender())) {
            // We skip role manager checks for the final project presentation
            _grantRole(ADMIN_ROLE, to);
            // }
        }
    }

    /// @notice Function to remove an admin account
    /// @param to Address of the account to remove admin role
    function removeAdmin(address to) public onlyRole(ADMIN_ROLE) {
        // onlyPausableRole(ADMIN_ROLE);
        revokeRole(ADMIN_ROLE, to);
    }

    /// @notice Function to check if someone has admin role
    /// @param to address to check for admin role privilege
    /// @return true if @param to is an admin or false otherwise
    function isAdmin(address to) public view returns (bool) {
        return hasRole(ADMIN_ROLE, to); // || (pausableRolePaused && subjects[_msgSender()].subjectId == address(0));
    }

    /// @notice Function to retrieve a Subject
    /// @param _subjectId the registered address of the subject to retrieve
    /// @return an object with the Subject
    function getSubject(address _subjectId)
        public
        view
        returns (RxStructs.Subject memory) {
            return subjects[_subjectId];
    }

    /// @notice Function to retrieve a Doctor
    /// @param _subjectId the registered address of the doctor to retrieve
    /// @return an object with the Doctor
    function getDoctor(address _subjectId)
        public
        view
        returns (RxStructs.Doctor memory) {
            return doctors[_subjectId];
    }

    /// @notice Function to retrieve a Pharmacist
    /// @param _subjectId the registered address of the pharmacist to retrieve
    /// @return an object with the Pharmacist
    function getPharmacist(address _subjectId)
        public
        view
        returns (RxStructs.Pharmacist memory) {
            return pharmacists[_subjectId];
    }

    /// @notice Function to add/replace a Subject allowed to receive/hold NFT Prescriptions
    /// @param _subjectId is the registered address of the subject (approved for holding NFT Prescriptions)
    /// @param _birthDate is the subjects' date of birth, in seconds, from UNIX Epoch (1970-01-01)
    /// @param _name is the subject's full name
    /// @param _homeAddress is the subject's legal home address
    /// @return the ethereum address of the subject that was registered in the contract
    /// @dev Only ADMIN_ROLE users are allowed to modify subjects
    function setSubjectData(address _subjectId, uint256 _birthDate, string calldata _name, string calldata _homeAddress)
        public
        onlyRole(ADMIN_ROLE)
        returns (address) {
            // onlyPausableRole(ADMIN_ROLE);
            require (_subjectId != address(0), "0 address");
            // Subject memory newSubject = Subject(_subjectId, _name, _birthDate, _homeAddress);
            // subjects[_subjectId] = newSubject;
            subjects[_subjectId] = RxStructs.Subject(_subjectId, _birthDate, _name, _homeAddress);
            emit subjectDataSet(msg.sender, _subjectId, _birthDate, _name, _homeAddress);
            return subjects[_subjectId].subjectId;
    }

    /// @notice Function to add/replace a Doctor allowed to mint NFT Prescriptions
    /// @param _subjectId should be a valid ethereum address (same Id as the subject that holds this doctor's personal details)
    /// @param _degree should contain string with the degree of the doctor
    /// @param _license should contain string with the legal license of the doctor
    /// @dev @param _workplaces is a feature for future implementations
    /// @return the ethereum address of the doctor that was registered in the contract
    function setDoctorData(address _subjectId, string calldata _degree, string calldata _license) //, address[] calldata _workplaces)
        public
        onlyRole(ADMIN_ROLE)
        isSubject(_subjectId)
        returns (address) {
            // onlyPausableRole(ADMIN_ROLE);
            // require (_subjectId != address(0), "Wallet Address cannot be 0x0"); // Should be covered by isSubject()
            // Doctor memory newDoctor = Doctor(_subjectId, _degree, _license);
            // doctors[_subjectId] = newDoctor;
            // if (doctors[_subjectId].subjectId == address(0)) { // Doctor didn't exist, should be granted the MINTER_ROLE
            grantRole(MINTER_ROLE, _subjectId);
            // }
            doctors[_subjectId] = RxStructs.Doctor(_subjectId, _degree, _license);
            emit doctorDataSet(msg.sender, _subjectId, _degree, _license);
            return doctors[_subjectId].subjectId;
    }

    /// @notice Function to add/replace a Pharmacist allowed to burn NFT Prescriptions
    /// @param _subjectId should be a valid ethereum address (same Id as the subject that holds this pharmacist's personal details)
    /// @param _degree should contain string with the degree of the pharmacist
    /// @param _license should contain string with the legal license of the pharmacist
    /// @dev @param _workplaces is a feature for future implementations
    /// @return the ethereum address of the pharmacist that was registered in the contract
    function setPharmacistData(address _subjectId, string calldata _degree, string calldata _license) //, address[] calldata _workplaces)
        public
        onlyRole(ADMIN_ROLE)
        isSubject(_subjectId)
        returns (address) {
            // onlyPausableRole(ADMIN_ROLE);
            // require (_subjectId != address(0), "Wallet Address cannot be 0x0"); // Should be covered by isSubject()
            // Pharmacist memory newPharmacist = Pharmacist(_subjectId, _degree, _license);
            // pharmacists[_subjectId] = newPharmacist;
            // if (pharmacists[_subjectId].subjectId == address(0)) { // Pharmacist didn't exist, should be granted BURNER_ROLE
            grantRole(BURNER_ROLE, _subjectId);
            // }
            pharmacists[_subjectId] = RxStructs.Pharmacist(_subjectId, _degree, _license);
            emit pharmacistDataSet(msg.sender, _subjectId, _degree, _license);
            return pharmacists[_subjectId].subjectId;
    }

    /// @notice Function to remove a registered Subject 
    /// @param _subjectId is the registered address of the subject to remove
    /// @dev Only ADMIN_ROLE users are allowed to remove subjects
    function removeSubject(address _subjectId)
        public
        onlyRole(ADMIN_ROLE)
        isSubject(_subjectId)
        isNotDoctor(_subjectId)
        isNotPharmacist(_subjectId) {
            // onlyPausableRole(ADMIN_ROLE);// require (_subjectId != address(0), "Wallet Address cannot be 0x0"); // Should be covered by isSubject()
            delete subjects[_subjectId];
            emit subjectRemoved(msg.sender, _subjectId);
    }

    /// @notice Function to remove a registered Doctor
    /// @param _subjectId is the registered address of the doctor to remove
    /// @dev Only ADMIN_ROLE users are allowed to remove doctors
    function removeDoctor(address _subjectId)
        public
        onlyRole(ADMIN_ROLE)
        isDoctor(_subjectId) {
            // onlyPausableRole(ADMIN_ROLE);
            // require (_subjectId != address(0), "Wallet Address cannot be 0x0"); // Should be covered by isDoctor()
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
        isPharmacist(_subjectId) {
            
            // require (_subjectId != address(0), "Wallet Address cannot be 0x0"); // Should be covered by isPharmacist()
            revokeRole(BURNER_ROLE, _subjectId);
            delete pharmacists[_subjectId];
            emit pharmacistRemoved(msg.sender, _subjectId);
    }

}