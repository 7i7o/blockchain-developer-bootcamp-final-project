# Design Pattern Decisions

## 1. Inheritance and Interfaces

From the start, deciding to use NFTs to represent Medical Prescriptions, had me going down the route of inheritance of the ERC721 standard from [Open Zeppelin](https://openzeppelin.com/)

Later on, I decided to store an image of the prescription, on-chain, which led to me inherit ERC721URIStorage Extension from [Open Zeppelin](https://openzeppelin.com/)

I also decided it would be great if the last person in the life cycle of the Prescriptions 'burnt' it. That also led me to inherit ERC721Burnable Extension, also, from [Open Zeppelin](https://openzeppelin.com/)

## 2. Access Control

Now that we could mint and burn our NFTs, I had to restrict the roles of the people involved, that led me to inherit AccessControl from [Open Zeppelin](https://openzeppelin.com/) to manage the roles of MINTER and BURNER, which led me to use and ADMIN role in charge of adding people to the system.

This way, only BURNERs (Pharmacists) are allowed to burn tokens, only MINTERs (Doctors) are allowed to mint tokens (Prescriptions) and only ADMINs are allowed to add/modify or remove users and roles (Patients, Doctors and Pharmacists) to/from the App.

## 3. Optimizing Gas

The scope of the project led me to a contract that was too long (exceeded the 25kb mark compilers warn about), so i had to make several decisions (the compiler optimizer was not enough).

My original contract only only the URI from the token with a Base64 encoded json, with a Base64 encoded SVG image.
It turns out that the whole string was about 2 to 3 kb long. Storing it on-chain not only was gas inefficient, it also made the code longer for it had to store all the strings that formed up the SVG image.

So, several late nights later, i went trough the library road, splitting my contract in 4.

1. My main contract would store all the logic and raw data in structs
2. A second contract as a library for building the tokenURI (required by the ERC721 standard)
3. A third contract as a library for building the SVG image, needed by the former to create the tokenURI
4. Finally a fourth contract as a library to keep the structs definitions (shared and used by all the others)

This made me save gas:
At minting all the strings needed to build the SVG where not stored on-chain, only the raw data needed to create it.
Al the logic (and EVM cycles) to concatenate strings in the SVG where now in a **pure** function, instead of one storing data.

Finally, all the logic in the main contract (role checking, restricting modifiers for every function, requires) was not trivial, so everything needed a check, which had a long descriptive message for the error, that led to reaching the 25 kb limit again. That was solved by cleaning up the error messages for clear, short 3 word sentences (optimizing gas at deployment).



