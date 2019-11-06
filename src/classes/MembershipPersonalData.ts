import MemberAddress from "./MemberAddress";
import IdentityDocument from "./IdentityDocument";
import Country from "./Country";
import { ObjectTypeAnnotation } from "@babel/types";

export default class MembershipPersonalData {

   [key:string]: any;

    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: Date;
    countryOfResidence: Country;
    
    nationalities:Country[];
    placeOfBirth:Country|undefined;
    identityDocument:IdentityDocument|undefined;
    homeAddress:MemberAddress|undefined;
    taxAddress:MemberAddress|undefined;
    occupation:string|undefined;
    employer:string|undefined;

    constructor(firstName: string,
        lastName: string,
        email: string,
        dateOfBirth: Date,
        countryOfResidence: Country) {

        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.dateOfBirth = dateOfBirth;
        this.countryOfResidence = countryOfResidence;
        this.nationalities = [];
     }

     setAmlData(nationalities:Country[], placeOfBirth:Country, occupation:string, employer:string, homeAddress:MemberAddress, taxAddress:MemberAddress, identityDocument:IdentityDocument) {
        this.nationalities = nationalities;
        this.placeOfBirth = placeOfBirth;
        this.occupation = occupation;
        this.employer = employer;
        this.homeAddress = homeAddress;
        this.taxAddress = taxAddress;
        this.identityDocument = identityDocument;
     }
}