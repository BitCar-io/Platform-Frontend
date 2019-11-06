import Country from "../classes/Country";
import MembershipPersonalData from "../classes/MembershipPersonalData";
import MemberAddress from "../classes/MemberAddress";
import IdentityDocument from "../classes/IdentityDocument";
import Axios from "axios";
import moment from "moment";

export const generateMembershipDataFromProps = (customerDetails:any, customerAmlDetails:any) : MembershipPersonalData => {
    const dateOfBirth = customerAmlDetails.dateOfBirth.value.toDate();
    const countryOfResidence = new Country(customerDetails.country.value);
    const user = new MembershipPersonalData(customerDetails.firstName.value, customerDetails.lastName.value, customerDetails.email.value, dateOfBirth, countryOfResidence);
    const nationalities = customerAmlDetails.nationalities.value.map((nationality:string) => new Country(nationality));
    const placeOfBirth = new Country(customerAmlDetails.placeOfBirth.value);
    const homeAddress = new MemberAddress(customerDetails.line1.value, customerDetails.postcode.value, customerDetails.city.value, customerDetails.state.value, customerDetails.line2.value, countryOfResidence);
    const taxAddress = customerAmlDetails.isTaxAddressSameAsHome.value ? homeAddress : new MemberAddress(customerAmlDetails.line1.value, customerAmlDetails.postcode.value, customerAmlDetails.city.value, customerAmlDetails.state.value, customerAmlDetails.line2.value, new Country(customerAmlDetails.country.value));
    const identityDocument = new IdentityDocument(customerAmlDetails.idNumber.value, customerAmlDetails.idType.value);

    user.setAmlData(nationalities, placeOfBirth, customerAmlDetails.occupation.value, customerAmlDetails.employer.value, homeAddress, taxAddress, identityDocument);

    return user;
}

const convertUserDataToJson = (user:MembershipPersonalData) => {

	if(!user.placeOfBirth || !user.homeAddress || !user.taxAddress || !user.identityDocument) {
		throw new Error("User data is invalid, missing place of birth, identity document, home address or tax address.");
	}

	return JSON.stringify({
		"name": `${user.firstName} ${user.lastName}`,
		"dob": moment(user.dateOfBirth).format("YYYY-MM-DD"),
		"nationalities": user.nationalities.map(nationality => nationality.demonym).toString(),
        "countryOfResidence": user.countryOfResidence.name,
		"pob": user.placeOfBirth.name,
		"occupation": `Employer: ${user.employer}, ${user.occupation}`,
		"address": user.homeAddress.toDetailedString(),
		"taxAddress": user.taxAddress.toDetailedString(),
		"email": user.email,
		"id": user.identityDocument.number,
		"idType": user.identityDocument.type
    });
}

export const createCreditCardUser = (user:MembershipPersonalData) => {
    return Axios.post(`${process.env.SIDS_API_URL}user`, {
            kycData: convertUserDataToJson(user)
    });
}