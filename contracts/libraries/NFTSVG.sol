// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import '@openzeppelin/contracts/utils/Strings.sol';
import { DateTime } from "./DateTime.sol";
import { RxStructs } from "./RxStructs.sol";

/// @title Library to generate SVG for the NFT
/// @author Matias Parij (@7i7o)
/// @notice Used by main Rx contract to generate tokenURI image
library NFTSVG {

    /// @notice Function that generates a SVG to be included in the tokenURI
    /// @param tokenId The tokenId of the NFT
    /// @param name The name() of the ERC721
    /// @param rx A Prescription Object containing all that we need to create the SVG
    function generateSVG(uint256 tokenId, string memory name, RxStructs.RxData memory rx)
        internal
        pure
        returns (string memory svg) {

            string memory stringDate = DateTime.timestampToString(rx.date);
            string memory stringBirthdate = DateTime.timestampToString(rx.patient.birthDate);
            
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

            // uint256 l = 0; // text length
            uint256 y = 280; // Y Position
            string memory text = ''; // text

            // Generate all the 'keys' text lines in the SVG
            for (uint256 i = 0; i < RxStructs.RX_LINES; i++) {
                text = rx.keys[i];
                if ( bytes(text).length > 0 ){
                    parts[i+1] = string(abi.encodePacked('<text x="118" y="',Strings.toString(y),'">',text,'</text>'));
                }
                y += RxStructs.LINE_PADDING;
            }

            // SVG 'change font' separator
            parts[13] = '</g><g font-family="Courier" font-weight="bold">';

            // Generate all the patient SVG lines
            parts[14] = string(abi.encodePacked(
                '<text x="128" y="30">',rx.patient.name,'</text>',
                '<text x="128" y="60">',stringBirthdate,'</text>',
                '<text x="128" y="90">',rx.patient.homeAddress,'</text>',
                '<text x="128" y="120">',Strings.toHexString(uint256(uint160(rx.patient.subjectId)), 20),'</text>'
            ));

            // Generate the date and Rx# SVG line
            parts[15] = string(abi.encodePacked(
                '<text x="128" y="660">',
                    stringDate,
                '</text>'
                '<text x="585" y="660" text-anchor="end" font-style="italic">'
                    ,name,'# ',Strings.toString(tokenId),
                '</text>'
            ));

            // Generate all the doctor SVG lines
            parts[16] = string(abi.encodePacked(
                '<text x="128" y="690">',rx.doctorSubject.name,'</text>',
                '<text x="128" y="720">',rx.doctor.degree,'</text>',
                '<text x="128" y="750">',rx.doctor.license,'</text>',
                '<text x="128" y="780">',Strings.toHexString(uint256(uint160(rx.doctor.subjectId)), 20),'</text>'
            ));

            y = 280;
            // Generate all the 'values' text lines in the SVG
            for (uint256 i = 0; i < RxStructs.RX_LINES; i++) {
                text = rx.values[i];
                if ( bytes(text).length > 0 ){
                    parts[i+17] = string(abi.encodePacked('<text x="128" y="',Strings.toString(y),'">',text,'</text>'));
                }
                y += RxStructs.LINE_PADDING;
            }
    
            parts[29] = '</g>'
                        // Small logo at the bottom that can be commented out
                        '<g opacity="0.6"><circle fill="darkblue" cx="566" cy="754.4" r="7.5"/><path fill="red" d="m580.4 761h4l-15,24h-4z"/><path fill="darkred" d="m565.4 761h4l15,24h-4z"/><path fill="blue" d="m558 749v24h15z"/></g>'
                        '</svg>';

            string memory output = string(abi.encodePacked(parts[0], parts[1], parts[2], parts[3], parts[4], parts[5], parts[6], parts[7]));
            output = string(abi.encodePacked(output, parts[8], parts[9], parts[10], parts[11], parts[12], parts[13], parts[14], parts[15]));
            output = string(abi.encodePacked(output, parts[16], parts[17], parts[18], parts[19], parts[20], parts[21], parts[22], parts[23]));
            output = string(abi.encodePacked(output, parts[24], parts[25], parts[26], parts[27], parts[28], parts[29]));

            return output;
    }

}