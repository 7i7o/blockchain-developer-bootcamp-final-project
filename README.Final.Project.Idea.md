# Final Project Idea for the Consensys Blockchain Developer Bootcamp 2021

#### TL;DR: NFT Medical Prescriptions

## Using NFTs to replace traditional prescriptions and thus eliminate prescription forging

- Doctors can use their registered wallet to mint a NFT prescription, that gets transfered to the patient's wallet
- Patients can then transfer (approve?) the prescription to a Pharmacist's wallet in exchange for the medication
- Pharmacy can receive compensation directly from patient or its Health Insurance

This way, any of the parties involved can check trustlessly if any given prescription is indeed valid or counterfeited by inspecting any of its signatures and its life cycle in the blockchain.

### Circuit of life for the NFT:

  *Doctor (Minting) -> Patient [-> H.I. Approval] -> Pharmacy -> Health Insurance*

---

Under Drug and Cosmetic Act, 1945, A Prescription should have following particulars:

“For the purposes of clause (9) a prescription shall

- (a) be in writing and be signed by the person giving it with his usual signature and be dated by him;
- (b) specify the name and address of the person for whose treatment it is given, or the name and address of the owner of the animal if the drug is meant for veterinary use;]
- (c) indicate the total amount of the medicine to be supplied and the dose to be taken.”

---

### Bare Minimum Data in the Token

**(a)** Signed (digitally) by the (registered) doctor's wallet, date of issuance, minted by doctor
- *Address* issuer
- *Date* date

**(b)** Name and Address (wallet?) of patient (or owner of animal), transferred from doctor to patient
- *Address* patient (or owner of animal)
- *String* name

**(c)** Total amount of medicine and dose
- *String* medicine
- *String* medicinUnit
- *Uint256* medicineAmount
- *Uint256* doseFrequency
- *Uint256* doseAmount
- *String* doseUnit

---

  *(Extra)* Prescription details could be encrypted using public keys (doctor, patient, health insurance) to ensure medical secrecy, allowing *only* each party involved to view its content.
