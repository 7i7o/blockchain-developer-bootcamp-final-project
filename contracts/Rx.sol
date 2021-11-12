// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import { Base64 } from "base64-sol/base64.sol";
import { DateTime } from "./DateTime.sol";

// import "./TokenURIHelper.sol";

/// @title A NFT Prescription creator
/// @author Matias Parij (@7i7o)
/// @notice You can use this contract only as a MVP for minting Prescriptions
/// @dev Features such as workplaces for doctors or pharmacists are for future versions
contract Rx is ERC721, ERC721URIStorage, ERC721Burnable, AccessControl, DateTime {

    /// @notice Using OpenZeppelin's Counters for TokenId enumeration
    using Counters for Counters.Counter;

    /// @notice Role definition for Minter
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    /// @notice Role definition for Burner
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    /// @notice Using OpenZeppelin's Counters for TokenId enumeration
    /// @dev We increment the counter in the constructor to start Ids in 1, keeping Id 0 (default for uints in solidity) to signal that someone doesn't have any NFTs
    Counters.Counter private _tokenIdCounter;

    /** Begin of State Variables & Modifiers for final project */

    /// @notice enum to reflect diferent states of the Prescription
    /// @param Draft reflects a Prescription that is not minted yet
    /// @param Minted reflects a freshly minted Prescription, not yet ready to be used by a patient in a Pharmacy
    /// @param Prescribed reflects a Prescription in the posession of the patient, not yet exhanged/used in a Pharmacy
    /// @param Used reflects a Prescription in the posession of a Pharmacist, already used by a patient (it could still need to be inspected/payed by a health insurance)
    /// @param Burned reflects a Prescription that has been Burned by the Pharmacist, because it has already been payed/accounted for
    enum Status { Draft, Minted, Prescribed, Used, Burned }

    /// @notice struct to store a suject (person/patient) details
    /// @param ethAddress should be a valid ethereum address (used as an Id for the subject)
    /// @param name should contain string with the full name of the subject
    /// @param birthDate should contain string with the date of birth of the subject
    /// @param homeAddress should contain string with the home address of the subject
    struct Subject {
        address subjectId;
        string name;
        string birthDate;
        string homeAddress;
    }

    /// @notice struct to store a doctor (minter) details
    /// @param subject should be a valid ethereum address (same Id as the subject that holds this doctor's personal details)
    /// @param degree should contain string with the degree of the doctor
    /// @param license should contain string with the legal license of the doctor
    /// @dev @param workplaces is a feature for future implementations
    struct Doctor {
        address subjectId;
        string degree;
        string license;
        // address[] workplaces;
    }

    /// @notice struct to store a pharmacist (burner) details
    /// @param subject should be a valid ethereum address (same Id as the subject that holds this pharmacist's personal details)
    /// @param degree should contain string with the degree of the pharmacist
    /// @param license should contain string with the legal license of the pharmacist
    /// @dev @param workplaces is a feature for future implementations
    struct Pharmacist {
        address subjectId;
        string degree;
        string license;
        // address[] workplaces;
    }

    /// @notice struct representing the prescription
    /// @param status Represents the status of the prescription (Minted, Prescribed, Used, Burned)
    /// @param patientSubjectId Id of the patient
    /// @param doctorSubjectId Id of the doctor
    /// @param date Date of the prescription (rounded to a timestamp of a block)
    /// @param keys String array with the title of each written line of the prescription
    /// @param values String array with values of each written line of the prescription
    /// @dev @param pharmacistSubjectId Possible future feature: Id of the pharmacist to assign a Pharmacist on the moment of Prescribing
    struct RxData {
        Status status;
        Subject patient;
        Subject doctorSubject;
        Doctor doctor;
        string date;
        string[12] keys;
        string[12] values;
        // address pharmacistSubjectId;
    }

    /// @notice this mapping holds all the subjects registered in the contract
    mapping ( address => Subject ) private subjects;

    /// @notice this mapping holds all the doctors registered in the contract
    mapping ( address => Doctor ) private doctors;

    /// @notice this mapping holds all the pharmacists registered in the contract
    mapping ( address => Pharmacist ) private pharmacists;

    /// @dev Modifier that checks that an account is actually a registered subject
    modifier isSubject(address _subjectId) {
        require( (_subjectId != address(0) && subjects[_subjectId].subjectId == _subjectId) ,
                    string(abi.encodePacked(
                        Strings.toHexString(uint160(_subjectId), 20),
                        'is not a registered Subject'
                    ))
                );
        _;
    }

    /// @dev Modifier that checks that an account is a registered doctor
    modifier isDoctor(address _subjectId) {
        require( (_subjectId != address(0) && doctors[_subjectId].subjectId == _subjectId) ,
                    string(abi.encodePacked(
                        Strings.toHexString(uint160(_subjectId), 20),
                        'is not a registered Doctor!'
                    ))
                );
        _;
    }

    /// @dev Modifier that checks that an account is NOT a registered doctor
    modifier isNotDoctor(address _subjectId) {
        require( (doctors[_subjectId].subjectId == address(0)) ,
                    string(abi.encodePacked(
                        Strings.toHexString(uint160(_subjectId), 20),
                        'is still a registered Doctor!'
                    ))
                );
        _;
    }

    /// @dev Modifier that checks that an account is a registered pharmacist
    modifier isPharmacist(address _subjectId) {
        require( (_subjectId != address(0) && pharmacists[_subjectId].subjectId == _subjectId) ,
                    string(abi.encodePacked(
                        Strings.toHexString(uint160(_subjectId), 20),
                        'is not a registered Pharmacist!'
                    ))
                );
        _;
    }

    /// @dev Modifier that checks that an account is NOT a registered pharmacist
    modifier isNotPharmacist(address _subjectId) {
        require( (pharmacists[_subjectId].subjectId == address(0)) ,
                    string(abi.encodePacked(
                        Strings.toHexString(uint160(_subjectId), 20),
                        'is still a registered Pharmacist!'
                    ))
                );
        _;
    }

    /** End of State Variables & Modifiers for final project */

    /// @notice constructor for NFT Prescriptions contract
    /// @dev Using ERC721 default constructor with "Prescription" and "Rx" as Name and Symbol for the tokens
    /// @dev We set up the contract creator (msg.sender) with the DEFAULT_ADMIN_ROLE to manage all the other Roles
    /// @dev We increment the counter in the constructor to start Ids in 1, keeping Id 0 (default for uints in solidity) to signal that someone doesn't have any NFTs
    constructor() ERC721("Rx", "Rx") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        // _setupRole(MINTER_ROLE, msg.sender); // MINTER_ROLE reserved for Doctors only
        // _setupRole(BURNER_ROLE, msg.sender); // BURNER_ROLE reserved for Pharmacists only

        _tokenIdCounter.increment();
    }

    /// @dev function override required by solidity
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) onlyRole(BURNER_ROLE) {
        super._burn(tokenId);
    }

    /// @dev function override required by solidity
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    /// @dev function override required by solidity
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    /** Begin of implementation of functions for final project */

    /// @notice Function to retrieve a Subject
    /// @param _subjectId the registered address of the subject to retrieve
    /// @return an object with the Subject
    function getSubject(address _subjectId)
        public
        view
        returns (Subject memory) {
            return subjects[_subjectId];
    }

    /// @notice Function to retrieve a Doctor
    /// @param _subjectId the registered address of the doctor to retrieve
    /// @return an object with the Doctor
    function getDoctor(address _subjectId)
        public
        view
        returns (Doctor memory) {
            return doctors[_subjectId];
    }

    /// @notice Function to retrieve a Pharmacist
    /// @param _subjectId the registered address of the pharmacist to retrieve
    /// @return an object with the Pharmacist
    function getPharmacist(address _subjectId)
        public
        view
        returns (Pharmacist memory) {
            return pharmacists[_subjectId];
    }

    /// @notice Function to add/replace a Subject allowed to receive/hold NFT Prescriptions
    /// @param _subjectId is the registered address of the subject (approved for holding NFT Prescriptions)
    /// @param _name is the subject's full name
    /// @param _birthDate is the subjects' date of birth
    /// @param _homeAddress is the subject's legal home address
    /// @return the ethereum address of the subject that was registered in the contract
    /// @dev Only DEFAULT_ADMIN_ROLE users are allowed to modify subjects
    function setSubjectData(address _subjectId, string calldata _name, string calldata _birthDate, string calldata _homeAddress)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
        returns (address) {
            require (_subjectId != address(0), "Wallet Address cannot be 0x0");
            // Subject memory newSubject = Subject(_subjectId, _name, _birthDate, _homeAddress);
            // subjects[_subjectId] = newSubject;
            subjects[_subjectId] = Subject(_subjectId, _name, _birthDate, _homeAddress);
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
        onlyRole(DEFAULT_ADMIN_ROLE)
        isSubject(_subjectId)
        returns (address) {
            // require (_subjectId != address(0), "Wallet Address cannot be 0x0"); // Should be covered by isSubject()
            // Doctor memory newDoctor = Doctor(_subjectId, _degree, _license);
            // doctors[_subjectId] = newDoctor;
            // if (doctors[_subjectId].subjectId == address(0)) { // Doctor didn't exist, should be granted the MINTER_ROLE
            grantRole(MINTER_ROLE, _subjectId);
            // }
            doctors[_subjectId] = Doctor(_subjectId, _degree, _license);
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
        onlyRole(DEFAULT_ADMIN_ROLE)
        isSubject(_subjectId)
        returns (address) {
            // require (_subjectId != address(0), "Wallet Address cannot be 0x0"); // Should be covered by isSubject()
            // Pharmacist memory newPharmacist = Pharmacist(_subjectId, _degree, _license);
            // pharmacists[_subjectId] = newPharmacist;
            // if (pharmacists[_subjectId].subjectId == address(0)) { // Pharmacist didn't exist, should be granted BURNER_ROLE
            grantRole(BURNER_ROLE, _subjectId);
            // }
            pharmacists[_subjectId] = Pharmacist(_subjectId, _degree, _license);
            return pharmacists[_subjectId].subjectId;
    }

    /// @notice Function to remove a registered Subject 
    /// @param _subjectId is the registered address of the subject to remove
    /// @dev Only DEFAULT_ADMIN_ROLE users are allowed to remove subjects
    function removeSubject(address _subjectId)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
        isSubject(_subjectId)
        isNotDoctor(_subjectId)
        isNotPharmacist(_subjectId) {
            // require (_subjectId != address(0), "Wallet Address cannot be 0x0"); // Should be covered by isSubject()
            delete subjects[_subjectId];
    }

    /// @notice Function to remove a registered Doctor
    /// @param _subjectId is the registered address of the doctor to remove
    /// @dev Only DEFAULT_ADMIN_ROLE users are allowed to remove doctors
    function removeDoctor(address _subjectId)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
        isDoctor(_subjectId) {
            // require (_subjectId != address(0), "Wallet Address cannot be 0x0"); // Should be covered by isDoctor()
            revokeRole(MINTER_ROLE, _subjectId);
            delete doctors[_subjectId];
    }

    /// @notice Function to remove a registered Pharmacist
    /// @param _subjectId is the registered address of the pharmacist to remove
    /// @dev Only DEFAULT_ADMIN_ROLE users are allowed to remove pharmacists
    function removePharmacist(address _subjectId)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
        isPharmacist(_subjectId) {
            // require (_subjectId != address(0), "Wallet Address cannot be 0x0"); // Should be covered by isPharmacist()
            revokeRole(BURNER_ROLE, _subjectId);
            delete pharmacists[_subjectId];
    }

    /// @notice Funtion to mint a Prescription. Should be called only by a Doctor (has MINTER_ROLE)
    /// @param to The id of the subject (patient) recipient of the prescription
    /// @param _keys Text lines with the 'title' of each content of the prescription (max 17 characters each recommended)
    /// @param _values Text lines with the 'content' of the prescription (max 63 characters each recommended)
    function mintPrescription(address to, string[12] memory _keys, string[12] memory _values)
        public
        onlyRole(MINTER_ROLE)
        isSubject(to) {
            require( (msg.sender != to) , 'Cannot mint NFT Prescription to yourself');
            RxData memory rx = RxData(Status.Draft, getSubject(to), getSubject(msg.sender), getDoctor(msg.sender), timestampToString(block.timestamp, '-'), _keys, _values);
            uint256 tokenId = _tokenIdCounter.current();
            _tokenIdCounter.increment();
            super._safeMint(to, tokenId);
            _setTokenURI(tokenId, _generatePrescriptionURI(tokenId, rx));
    }

    /// @notice Function to generate a Base64 encoded JSON, that includes a SVG to be used as the token URI
    /// @param rx A Prescription Object containing all that we need to create the SVG
    function _generatePrescriptionURI(uint256 tokenId, RxData memory rx)
        internal
        view
        returns (string memory uri) {

            // json strings with a Base64 encoded image (SVG) inside
            string[24] memory jsonParts;
            jsonParts[0]  = '{"name":"';
            jsonParts[1]  =     name();
            jsonParts[2]  =     ' #';
            jsonParts[3]  =     Strings.toString(tokenId);
            jsonParts[4]  = '","symbol":"';
            jsonParts[5]  =     symbol();
            jsonParts[6]  = '","description":"On-Chain NFT Prescriptions"';
            jsonParts[7]  = ',"attributes":['
                                '{"trait_type":"PatientName","value":"';
            jsonParts[8]  =          rx.patient.name;
            jsonParts[9]  =     '"},{"trait_type":"Patient Birthdate","value":"';
            jsonParts[10] =         rx.patient.birthDate;
            jsonParts[11] =     '"},{"trait_type":"Doctor Name","value":"';
            jsonParts[12] =         rx.doctorSubject.name;
            jsonParts[13] =     '"},{"trait_type":"Doctor Degree","value":"';
            jsonParts[14] =         rx.doctor.degree;
            jsonParts[16] =     '"},{"trait_type":"Doctor License","value":"';
            jsonParts[17] =         rx.doctor.license;
            jsonParts[18] =     '"},{"trait_type":"RX Date","value":"';
            jsonParts[19] =         rx.date;
            jsonParts[20] =     '"}]';
            jsonParts[21] = ',"image": "data:image/svg+xml;base64,';
            jsonParts[22] =     Base64.encode(bytes( _generateSVG(tokenId, rx) ));
            jsonParts[23] = '"}';

            string memory output = string(abi.encodePacked(jsonParts[0], jsonParts[1], jsonParts[2], jsonParts[3], jsonParts[4], jsonParts[5], jsonParts[6], jsonParts[7], jsonParts[8]));
            output = string(abi.encodePacked(output, jsonParts[9], jsonParts[10], jsonParts[11], jsonParts[12], jsonParts[13], jsonParts[14], jsonParts[15], jsonParts[16]));
            output = string(abi.encodePacked(output, jsonParts[17], jsonParts[18], jsonParts[19], jsonParts[20], jsonParts[21], jsonParts[22], jsonParts[23]));

            return string(abi.encodePacked("data:application/json;base64,", Base64.encode(bytes(output))));

    }

    /// @notice Function that generates a SVG to be included in the tokenURI
    /// @param rx A Prescription Object containing all that we need to create the SVG
    function _generateSVG(uint256 tokenId, RxData memory rx)
        internal
        view
        returns (string memory svg) {
            string[30] memory parts;  // Should have 30: 1 header + 12 keys + 1 font separator + 1 Patient values + 1 date value + 1 Doctor values + 12 values + 1 Footer

            // SVG Header
            parts[0] = '<svg xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12px" ' 
                            'preserveAspectRatio="xMinYMin meet" viewBox="0 0 600 800">'
                            '<g fill="none" stroke="#000" stroke-width="1px">'
                                '<rect x="2" y="2" width="596" height="796"/>' // Frame
                                '<path d="m15 135h570"/>' // Top line
                                '<path d="m15 630h570"/>' // Bottom line
                            '</g>'
                            '<g font-size="88px"><text x="10" y="215">P</text><text x="35" y="250">X</text></g>' // RX
                            '<g text-anchor="end">' // Titles group (keys)
                                '<text x="118" y="30">Name</text>'
                                '<text x="118" y="60">Date of Birth</text>'
                                '<text x="118" y="90">Address</text>'
                                '<text x="118" y="120">Patient Wallet</text>'
                                '<text x="118" y="660">Date</text>'
                                '<text x="118" y="690">Doctor Name</text>'
                                '<text x="118" y="720">MD</text>'
                                '<text x="118" y="750">License</text>'
                                '<text x="118" y="780">Doctor Wallet</text>';

            // Generate all the 'keys' text lines in the SVG
            parts[1]  = (bytes(rx.keys[0]).length == 0)  ? '' : string(abi.encodePacked('<text x="118" y="280">',rx.keys[0],'</text>')) ;
            parts[2]  = (bytes(rx.keys[1]).length == 0)  ? '' : string(abi.encodePacked('<text x="118" y="310">',rx.keys[1],'</text>')) ;
            parts[3]  = (bytes(rx.keys[2]).length == 0)  ? '' : string(abi.encodePacked('<text x="118" y="340">',rx.keys[2],'</text>')) ;
            parts[4]  = (bytes(rx.keys[3]).length == 0)  ? '' : string(abi.encodePacked('<text x="118" y="370">',rx.keys[3],'</text>')) ;
            parts[5]  = (bytes(rx.keys[4]).length == 0)  ? '' : string(abi.encodePacked('<text x="118" y="400">',rx.keys[4],'</text>')) ;
            parts[6]  = (bytes(rx.keys[5]).length == 0)  ? '' : string(abi.encodePacked('<text x="118" y="430">',rx.keys[5],'</text>')) ;
            parts[7]  = (bytes(rx.keys[6]).length == 0)  ? '' : string(abi.encodePacked('<text x="118" y="460">',rx.keys[6],'</text>')) ;
            parts[8]  = (bytes(rx.keys[7]).length == 0)  ? '' : string(abi.encodePacked('<text x="118" y="490">',rx.keys[7],'</text>')) ;
            parts[9]  = (bytes(rx.keys[8]).length == 0)  ? '' : string(abi.encodePacked('<text x="118" y="510">',rx.keys[8],'</text>')) ;
            parts[10] = (bytes(rx.keys[9]).length == 0)  ? '' : string(abi.encodePacked('<text x="118" y="540">',rx.keys[9],'</text>')) ;
            parts[11] = (bytes(rx.keys[10]).length == 0) ? '' : string(abi.encodePacked('<text x="118" y="570">',rx.keys[10],'</text>')) ;
            parts[12] = (bytes(rx.keys[11]).length == 0) ? '' : string(abi.encodePacked('<text x="118" y="600">',rx.keys[11],'</text>')) ;

            // SVG 'change font' separator
            parts[13] = '</g><g font-family="Courier" font-weight="bold">';

            // Generate all the patient SVG lines
            parts[14] = string(abi.encodePacked(
                '<text x="128" y="30">',rx.patient.name,'</text>',
                '<text x="128" y="60">',rx.patient.birthDate,'</text>',
                '<text x="128" y="90">',rx.patient.homeAddress,'</text>',
                '<text x="128" y="120">',Strings.toHexString(uint256(uint160(rx.patient.subjectId)), 20),'</text>'
            ));

            // Generate the date and Rx# SVG line
            parts[15] = string(abi.encodePacked(
                '<text x="128" y="660">',
                    rx.date,
                '</text>'
                '<text x="585" y="660" text-anchor="end" font-style="italic">'
                    ,name(),'# ',Strings.toString(tokenId),
                '</text>'
            ));

            // Generate all the doctor SVG lines
            parts[16] = string(abi.encodePacked(
                '<text x="128" y="690">',rx.doctorSubject.name,'</text>',
                '<text x="128" y="720">',rx.doctor.degree,'</text>',
                '<text x="128" y="750">',rx.doctor.license,'</text>',
                '<text x="128" y="780">',Strings.toHexString(uint256(uint160(rx.doctor.subjectId)), 20),'</text>'
            ));

            // Generate all the 'values' text lines in the SVG
            parts[17] = (bytes(rx.values[0]).length == 0) ?  '' : string(abi.encodePacked('<text x="128" y="280">',rx.values[0],'</text>')) ;
            parts[18] = (bytes(rx.values[1]).length == 0) ?  '' : string(abi.encodePacked('<text x="128" y="310">',rx.values[1],'</text>')) ;
            parts[19] = (bytes(rx.values[2]).length == 0) ?  '' : string(abi.encodePacked('<text x="128" y="340">',rx.values[2],'</text>')) ;
            parts[20] = (bytes(rx.values[3]).length == 0) ?  '' : string(abi.encodePacked('<text x="128" y="370">',rx.values[3],'</text>')) ;
            parts[21] = (bytes(rx.values[4]).length == 0) ?  '' : string(abi.encodePacked('<text x="128" y="400">',rx.values[4],'</text>')) ;
            parts[22] = (bytes(rx.values[5]).length == 0) ?  '' : string(abi.encodePacked('<text x="128" y="430">',rx.values[5],'</text>')) ;
            parts[23] = (bytes(rx.values[6]).length == 0) ?  '' : string(abi.encodePacked('<text x="128" y="460">',rx.values[6],'</text>')) ;
            parts[24] = (bytes(rx.values[7]).length == 0) ?  '' : string(abi.encodePacked('<text x="128" y="490">',rx.values[7],'</text>')) ;
            parts[25] = (bytes(rx.values[8]).length == 0) ?  '' : string(abi.encodePacked('<text x="128" y="510">',rx.values[8],'</text>')) ;
            parts[26] = (bytes(rx.values[9]).length == 0) ?  '' : string(abi.encodePacked('<text x="128" y="540">',rx.values[9],'</text>')) ;
            parts[27] = (bytes(rx.values[10]).length == 0) ? '' : string(abi.encodePacked('<text x="128" y="570">',rx.values[10],'</text>')) ;
            parts[28] = (bytes(rx.values[11]).length == 0) ? '' : string(abi.encodePacked('<text x="128" y="600">',rx.values[11],'</text>')) ;
    
            parts[29] = '</g><g opacity="0.6"><circle fill="darkblue" cx="566" cy="754.4" r="7.5"/><path fill="red" d="m580.4 761h4l-15,24h-4z"/><path fill="darkred" d="m565.4 761h4l15,24h-4z"/><path fill="blue" d="m558 749v24h15z"/></g></svg>';

            string memory output = string(abi.encodePacked(parts[0], parts[1], parts[2], parts[3], parts[4], parts[5], parts[6], parts[7]));
            output = string(abi.encodePacked(output, parts[8], parts[9], parts[10], parts[11], parts[12], parts[13], parts[14], parts[15]));
            output = string(abi.encodePacked(output, parts[16], parts[17], parts[18], parts[19], parts[20], parts[21], parts[22], parts[23]));
            output = string(abi.encodePacked(output, parts[24], parts[25], parts[26], parts[27], parts[28], parts[29]));

            return output;
    }

    /// @notice Function that returns a string (YYYY-MM-DD) from a timestamp
    /// @param dt uint256 timestamp (commonly block.timestamp)
    /// @param separator string with the separator
    function timestampToString(uint256 dt, string memory separator) private pure returns (string memory) {
            DateTimeStruct memory date = super.parseTimestamp(dt);
            return string(abi.encodePacked(
                Strings.toString(date.year),
                separator,
                Strings.toString(date.month),
                separator,
                Strings.toString(date.day)
            ));
    }

}