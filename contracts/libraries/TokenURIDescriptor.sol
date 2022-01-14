// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import '@openzeppelin/contracts/utils/Strings.sol';
import { Base64 } from "base64-sol/base64.sol";
import { DateTime } from "./DateTime.sol";
import { RxStructs } from "./RxStructs.sol";
import { NFTSVG } from "./NFTSVG.sol";

library TokenURIDescriptor {

    /// @notice Function to generate a Base64 encoded JSON, that includes a SVG to be used as the token URI
    /// @param tokenId The tokenId of the NFT
    /// @param name The name() of the ERC721
    /// @param rx A Prescription Object containing all that we need to create the SVG
    /// @return A string with the Base64 encoded JSON containing the tokenURI
    function constructTokenURI(uint256 tokenId, string memory name, string memory symbol, RxStructs.RxData memory rx)
    internal
    pure
    returns (string memory) {

            string memory stringDate = DateTime.timestampToString(rx.date);
            string memory stringBirthdate = DateTime.timestampToString(rx.patient.birthDate);
            // string memory patientName = string(abi.encodePacked( rx.patient.nameA, rx.patient.nameB ));

            // json strings with a Base64 encoded image (SVG) inside
            string[24] memory jsonParts;
            jsonParts[ 0] = '{"name":"';
            jsonParts[ 1] =     name;
            jsonParts[ 2] =     ' #';
            jsonParts[ 3] =     Strings.toString(tokenId);
            jsonParts[ 4] = '","symbol":"';
            jsonParts[ 5] =     symbol;
            jsonParts[ 6] = '","description":"On-Chain NFT Prescriptions"'
                             ',"attributes":['
                                '{"trait_type":"PatientName","value":"';
            jsonParts[ 7] =         NFTSVG.bytes32ToString(rx.patient.nameA);
            jsonParts[ 8] =         NFTSVG.bytes32ToString(rx.patient.nameB);
            jsonParts[ 9] =     '"},{"trait_type":"Patient Birthdate","value":"';
            jsonParts[10] =         stringBirthdate;
            jsonParts[11] =     '"},{"trait_type":"Doctor Name","value":"';
            jsonParts[12] =         NFTSVG.bytes32ToString(rx.doctorSubject.nameA);
            jsonParts[13] =         NFTSVG.bytes32ToString(rx.doctorSubject.nameB);
            jsonParts[14] =     '"},{"trait_type":"Doctor Degree","value":"';
            jsonParts[15] =         NFTSVG.bytes32ToString(rx.doctor.degree);
            jsonParts[16] =     '"},{"trait_type":"Doctor License","value":"';
            jsonParts[17] =         NFTSVG.bytes32ToString(rx.doctor.license);
            jsonParts[18] =     '"},{"trait_type":"RX Date","value":"';
            jsonParts[19] =         stringDate;
            jsonParts[20] =     '"}]'
                            ',"image": "data:image/svg+xml;base64,';
            // jsonParts[22] =     '';
            jsonParts[22] =     Base64.encode(bytes(
                                    NFTSVG.generateSVG(tokenId, name, rx)
                                ));
            jsonParts[23] = '"}';

            string memory output = string(abi.encodePacked(jsonParts[0], jsonParts[1], jsonParts[2], jsonParts[3], jsonParts[4], jsonParts[5], jsonParts[6], jsonParts[7], jsonParts[8]));
            output = string(abi.encodePacked(output, jsonParts[9], jsonParts[10], jsonParts[11], jsonParts[12], jsonParts[13], jsonParts[14], jsonParts[15], jsonParts[16]));
            output = string(abi.encodePacked(output, jsonParts[17], jsonParts[18], jsonParts[19], jsonParts[20], jsonParts[21], jsonParts[22], jsonParts[23]));

            return string(abi.encodePacked("data:application/json;base64,", Base64.encode(bytes(output))));
    }
}