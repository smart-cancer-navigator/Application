/*
Storage for patient information
Contains two classes:
    Patient class: stores information like name, age, where they live
    Condition class: each one is a separate condition that the patient has. The patient will have a list
        of conditions within its own object.
*/

// The Patient class described at the top of the file
export class Patient {
    firstName: string;
    lastName: string;
    zipCode: string;
    gender: string;
    age: number;
    conditions: Condition[] = [];
    alreadyContainedCodes: string[] = [];

    constructor(
        firstName: string,
        lastName: string,
        zipCode: string,
        gender: string,
        age: number
    ) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.zipCode = zipCode;
        this.gender = gender;
        this.age = age;
    }
}


export class Condition {
    code: string;
    name: string;
    display: string;
    constructor(
        code: string,
        name: string
    ) {
        this.code = code;
        this.name = name;
        this.display = code + " " + name;
    }
}