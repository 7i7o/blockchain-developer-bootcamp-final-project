// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

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
                            'preserveAspectRatio="xMinYMin meet" viewBox="0 0 600 800" style="background:white">'
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
            uint256 y = 250; // Y Position
            // string memory text = ''; // text

            // Generate all the 'keys' text lines in the SVG
            // for (uint256 i = 0; i < RxStructs.RX_LINES; i++) {
            //     text = string(abi.encodePacked(rx.keys[i]));
            //     if ( bytes(text).length > 0 ){
            //         parts[i+1] = string(abi.encodePacked('<text x="118" y="',Strings.toString(y),'">',text,'</text>'));
            //     }
            //     y += RxStructs.LINE_PADDING;
            // }
            parts[ 1] = string(abi.encodePacked('<text x="118" y="',Strings.toString(y+=RxStructs.LINE_PADDING),'">',bytes32ToString(rx.keys[ 0]),'</text>'));
            parts[ 2] = string(abi.encodePacked('<text x="118" y="',Strings.toString(y+=RxStructs.LINE_PADDING),'">',bytes32ToString(rx.keys[ 1]),'</text>'));
            parts[ 3] = string(abi.encodePacked('<text x="118" y="',Strings.toString(y+=RxStructs.LINE_PADDING),'">',bytes32ToString(rx.keys[ 2]),'</text>'));
            parts[ 4] = string(abi.encodePacked('<text x="118" y="',Strings.toString(y+=RxStructs.LINE_PADDING),'">',bytes32ToString(rx.keys[ 3]),'</text>'));
            parts[ 5] = string(abi.encodePacked('<text x="118" y="',Strings.toString(y+=RxStructs.LINE_PADDING),'">',bytes32ToString(rx.keys[ 4]),'</text>'));
            parts[ 6] = string(abi.encodePacked('<text x="118" y="',Strings.toString(y+=RxStructs.LINE_PADDING),'">',bytes32ToString(rx.keys[ 5]),'</text>'));
            parts[ 7] = string(abi.encodePacked('<text x="118" y="',Strings.toString(y+=RxStructs.LINE_PADDING),'">',bytes32ToString(rx.keys[ 6]),'</text>'));
            parts[ 8] = string(abi.encodePacked('<text x="118" y="',Strings.toString(y+=RxStructs.LINE_PADDING),'">',bytes32ToString(rx.keys[ 7]),'</text>'));
            parts[ 9] = string(abi.encodePacked('<text x="118" y="',Strings.toString(y+=RxStructs.LINE_PADDING),'">',bytes32ToString(rx.keys[ 8]),'</text>'));
            parts[10] = string(abi.encodePacked('<text x="118" y="',Strings.toString(y+=RxStructs.LINE_PADDING),'">',bytes32ToString(rx.keys[ 9]),'</text>'));
            parts[11] = string(abi.encodePacked('<text x="118" y="',Strings.toString(y+=RxStructs.LINE_PADDING),'">',bytes32ToString(rx.keys[10]),'</text>'));
            parts[12] = string(abi.encodePacked('<text x="118" y="',Strings.toString(y+=RxStructs.LINE_PADDING),'">',bytes32ToString(rx.keys[11]),'</text>'));

            // SVG 'change font' separator
            parts[13] = '</g><g font-family="Courier" font-weight="bold">';

            // Generate all the patient SVG lines
            parts[14] = string(abi.encodePacked(
                '<text x="128" y="30">',bytes32ToString(rx.patient.nameA),bytes32ToString(rx.patient.nameB),'</text>'
                '<text x="128" y="60">',stringBirthdate,'</text>'
                '<text x="128" y="90">',bytes32ToString(rx.patient.homeAddressA),bytes32ToString(rx.patient.homeAddressB),'</text>'
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
                '<text x="128" y="690">',bytes32ToString(rx.doctorSubject.nameA),bytes32ToString(rx.doctorSubject.nameB),'</text>'
                '<text x="128" y="720">',bytes32ToString(rx.doctor.degree),'</text>'
                '<text x="128" y="750">',bytes32ToString(rx.doctor.license),'</text>'
                '<text x="128" y="780">',Strings.toHexString(uint256(uint160(rx.doctor.subjectId)), 20),'</text>'
            ));

            y = 250;
            // string memory textB = '';
            // Generate all the 'values' text lines in the SVG
            // for (uint256 i = 0; i < 2*RxStructs.RX_LINES; i+=2) {
            //     text = string(abi.encodePacked(rx.values[i]));
            //     textB = string(abi.encodePacked(rx.values[i+1]));
            //     if ( bytes(text).length > 0 ){
            //         parts[i+17] = string(abi.encodePacked('<text x="128" y="',Strings.toString(y),'">',text,textB,'</text>'));
            //     }
            //     y += RxStructs.LINE_PADDING;
            // }
            parts[17] = string(abi.encodePacked('<text x="128" y="',Strings.toString(y+=RxStructs.LINE_PADDING),'">',bytes32ToString(rx.values[ 0]),bytes32ToString(rx.values[ 1]),'</text>'));
            parts[18] = string(abi.encodePacked('<text x="128" y="',Strings.toString(y+=RxStructs.LINE_PADDING),'">',bytes32ToString(rx.values[ 2]),bytes32ToString(rx.values[ 3]),'</text>'));
            parts[19] = string(abi.encodePacked('<text x="128" y="',Strings.toString(y+=RxStructs.LINE_PADDING),'">',bytes32ToString(rx.values[ 4]),bytes32ToString(rx.values[ 5]),'</text>'));
            parts[20] = string(abi.encodePacked('<text x="128" y="',Strings.toString(y+=RxStructs.LINE_PADDING),'">',bytes32ToString(rx.values[ 6]),bytes32ToString(rx.values[ 7]),'</text>'));
            parts[21] = string(abi.encodePacked('<text x="128" y="',Strings.toString(y+=RxStructs.LINE_PADDING),'">',bytes32ToString(rx.values[ 8]),bytes32ToString(rx.values[ 9]),'</text>'));
            parts[22] = string(abi.encodePacked('<text x="128" y="',Strings.toString(y+=RxStructs.LINE_PADDING),'">',bytes32ToString(rx.values[10]),bytes32ToString(rx.values[11]),'</text>'));
            parts[23] = string(abi.encodePacked('<text x="128" y="',Strings.toString(y+=RxStructs.LINE_PADDING),'">',bytes32ToString(rx.values[12]),bytes32ToString(rx.values[13]),'</text>'));
            parts[24] = string(abi.encodePacked('<text x="128" y="',Strings.toString(y+=RxStructs.LINE_PADDING),'">',bytes32ToString(rx.values[14]),bytes32ToString(rx.values[15]),'</text>'));
            parts[25] = string(abi.encodePacked('<text x="128" y="',Strings.toString(y+=RxStructs.LINE_PADDING),'">',bytes32ToString(rx.values[16]),bytes32ToString(rx.values[17]),'</text>'));
            parts[26] = string(abi.encodePacked('<text x="128" y="',Strings.toString(y+=RxStructs.LINE_PADDING),'">',bytes32ToString(rx.values[18]),bytes32ToString(rx.values[19]),'</text>'));
            parts[27] = string(abi.encodePacked('<text x="128" y="',Strings.toString(y+=RxStructs.LINE_PADDING),'">',bytes32ToString(rx.values[20]),bytes32ToString(rx.values[21]),'</text>'));
            parts[28] = string(abi.encodePacked('<text x="128" y="',Strings.toString(y+=RxStructs.LINE_PADDING),'">',bytes32ToString(rx.values[22]),bytes32ToString(rx.values[23]),'</text>'));
    
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

    function bytes32ToString(bytes32 word) internal pure returns (string memory) {
        if (word[0] == 0) {
            return '';
        }
        uint8 i = 1;
        while (i < 32 && word[i] != 0) {
            i++;
        }
        if (i == 32) { return string(abi.encodePacked(word)); }
        if (i == 1) { return string(abi.encodePacked(bytes1(word))); }
        if (i == 2) { return string(abi.encodePacked(bytes2(word))); }
        if (i == 3) { return string(abi.encodePacked(bytes3(word))); }
        if (i == 4) { return string(abi.encodePacked(bytes4(word))); }
        if (i == 5) { return string(abi.encodePacked(bytes5(word))); }
        if (i == 6) { return string(abi.encodePacked(bytes6(word))); }
        if (i == 7) { return string(abi.encodePacked(bytes7(word))); }
        if (i == 8) { return string(abi.encodePacked(bytes8(word))); }
        if (i == 9) { return string(abi.encodePacked(bytes9(word))); }
        if (i == 10) { return string(abi.encodePacked(bytes10(word))); }
        if (i == 11) { return string(abi.encodePacked(bytes11(word))); }
        if (i == 12) { return string(abi.encodePacked(bytes12(word))); }
        if (i == 13) { return string(abi.encodePacked(bytes13(word))); }
        if (i == 14) { return string(abi.encodePacked(bytes14(word))); }
        if (i == 15) { return string(abi.encodePacked(bytes15(word))); }
        if (i == 16) { return string(abi.encodePacked(bytes16(word))); }
        if (i == 17) { return string(abi.encodePacked(bytes17(word))); }
        if (i == 18) { return string(abi.encodePacked(bytes18(word))); }
        if (i == 19) { return string(abi.encodePacked(bytes19(word))); }
        if (i == 20) { return string(abi.encodePacked(bytes20(word))); }
        if (i == 21) { return string(abi.encodePacked(bytes21(word))); }
        if (i == 22) { return string(abi.encodePacked(bytes22(word))); }
        if (i == 23) { return string(abi.encodePacked(bytes23(word))); }
        if (i == 24) { return string(abi.encodePacked(bytes24(word))); }
        if (i == 25) { return string(abi.encodePacked(bytes25(word))); }
        if (i == 26) { return string(abi.encodePacked(bytes26(word))); }
        if (i == 27) { return string(abi.encodePacked(bytes27(word))); }
        if (i == 28) { return string(abi.encodePacked(bytes28(word))); }
        if (i == 29) { return string(abi.encodePacked(bytes29(word))); }
        if (i == 30) { return string(abi.encodePacked(bytes30(word))); }
        if (i == 31) { return string(abi.encodePacked(bytes31(word))); }
        return '';
        // bytes memory byteArray = new bytes(i);
        // uint8 j = 0;
        // for (j = 0; j < i; j++) {
        //     byteArray[j] = word[j];
        // }
        // return string(byteArray);
    }
}