/*

Helper functions to sanitize string input in forms, following XML 1.0 standard

    Name	Character	Unicode code point (decimal)	Standard	Name
    quot    "	        U+0022 (34)	                    XML 1.0	    quotation mark
    amp	    &	        U+0026 (38)	                    XML 1.0	    ampersand
    apos	'	        U+0027 (39)	                    XML 1.0	    apostrophe (1.0: apostrophe-quote)
    lt	    <	        U+003C (60)	                    XML 1.0	    less-than sign
    gt	    >	        U+003E (62)	                    XML 1.0	    greater-than sign

The initial "Name" column mentions the entity's name.
The "Character" column shows the character.
To render the character, the format &name; is used; for example, &amp; renders as &.

*/
import { ethers } from "ethers";

export const zeroBytes32 = ethers.constants.HashZero;

export const shortenAddress = address => `${address.substr(0,5)}...${address.substr(39,3)}`;

export const parseBytes32String = ethers.utils.parseBytes32String;

export const parse2Bytes32String = (firstWord, secondWord) => {
    return `${ethers.utils.parseBytes32String(firstWord)}${ethers.utils.parseBytes32String(secondWord)}`;
}

export const formatBytes32String = (text) => {
    return ethers.utils.formatBytes32String(text.substr(0,31));
}

export const format2Bytes32String = (text) => {
    return [
            ethers.utils.formatBytes32String(text.substr(0,31)),
            ethers.utils.formatBytes32String(text.substr(31,31))
    ];
}

export const xml1EncodeString = text => {
    if (!text) return text;
    let newText = '';
    newText = text.replace(     /&/g, "&amp;");
    newText = newText.replace(  /"/g, "&quot;");
    newText = newText.replace(  /'/g, "&apos;");
    newText = newText.replace(  /</g, "&lt;");
    newText = newText.replace(  />/g, "&gt;");
    return newText;
}

export const xml1DecodeString = text => {
    if (!text) return text;
    let newText = '';
    newText = text.replace(     /&quot;/g,   '"');
    newText = newText.replace(  /&apos;/g,   "'");
    newText = newText.replace(  /&lt;/g,     "<");
    newText = newText.replace(  /&gt;/g,     ">");
    newText = newText.replace(  /&amp;/g,    "&");
    return newText;
}
