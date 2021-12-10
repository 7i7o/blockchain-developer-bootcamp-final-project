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
