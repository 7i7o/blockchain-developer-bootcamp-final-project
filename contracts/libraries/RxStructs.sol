// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

library RxStructs {

    uint256 constant MAX_KEY_LENGTH = 20;
    uint256 constant MAX_VALUE_LENGTH = 62;
    uint256 constant RX_LINES = 12;
    uint256 constant LINE_PADDING = 30;
    
    /// @notice enum to reflect diferent states of the Prescription
    /// @param Draft reflects a Prescription that is not minted yet
    /// @param Minted reflects a freshly minted Prescription, not yet ready to be used by a patient in a Pharmacy
    /// @param Prescribed reflects a Prescription in the posession of the patient, not yet exhanged/used in a Pharmacy
    /// @param Used reflects a Prescription in the posession of a Pharmacist, already used by a patient (it could still need to be inspected/payed by a health insurance)
    /// @param Burned reflects a Prescription that has been Burned by the Pharmacist, because it has already been payed/accounted for
    //TODO: enum Status { Draft, Minted, Prescribed, Used, Burned }

    /// @notice struct to store a suject (person/patient) details
    /// @param ethAddress should be a valid ethereum address (used as an Id for the subject)
    /// @param name should contain string with the full name of the subject
    /// @param birthDate should contain string with the date of birth of the subject
    /// @param homeAddress should contain string with the home address of the subject
    struct Subject {
        address subjectId;
        uint256 birthDate;
        string name;
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
        // TODO: address[] workplaces;
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
        // TODO: address[] workplaces;
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
        //TODO: Status status;
        uint256 date;
        Subject patient;
        Subject doctorSubject;
        Doctor doctor;
        string[RX_LINES] keys;
        string[RX_LINES] values;
        // address pharmacistSubjectId;
    }

}