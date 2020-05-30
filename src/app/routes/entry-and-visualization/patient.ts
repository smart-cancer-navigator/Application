/*
Storage for patient information
Contains two classes:
    Patient class: stores information like name, age, where they live
    Condition class: each one is a separate condition that the patient has. The patient will have a list
        of conditions within its own object.
*/

// The Patient class described at the top of the file
export class Patient {
    name: string;
    constructor(
        name: string
    )
    {
        this.name = name;
    }
}