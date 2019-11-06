import Country from "./Country";
import * as _ from 'lodash';
import { string } from "prop-types";

export default class MemberAddress {
    line1:string;
    line2?:string;
    city:string;
    state:string;
    postcode:string;
    country?:Country;

    constructor(line1:string,
        postcode:string,
        city:string,
        state:string,
        line2?:string,
        country?:Country) {
            this.line1 = line1;
            this.line2 = line2;
            this.postcode = postcode;
            this.city = city;
            this.state = state;
            this.country = country;
        }

    toDetailedString = () => {
        return `${MemberAddress.toStringLabels.line1}${this.line1}
        ${this.line2 ? `${MemberAddress.LineSeparator}${MemberAddress.toStringLabels.line2}${this.line2}`:""}
        ${MemberAddress.LineSeparator}${MemberAddress.toStringLabels.city}${this.city}
        ${MemberAddress.LineSeparator}${MemberAddress.toStringLabels.state}${this.state}
        ${MemberAddress.LineSeparator}${MemberAddress.toStringLabels.postcode}${this.postcode}
        ${this.country ? `${MemberAddress.LineSeparator}${MemberAddress.toStringLabels.country}${this.country.name}`: ""}
        `;
    }

    private static LineSeparator = '\r\n';

    private static toStringLabels = {
        line1: 'Line 1: ',
        line2: 'Line 2: ',
        city: 'City: ',
        state: 'State: ',
        postcode: 'Post Code: ',
        country: 'Country: '
    }
    
    public static fromDetailedString = (addressString:string) : MemberAddress => {

        const addressParts = addressString.split('\r\n');

        let basicAddress :{
            [key:string] : string;
            line1:string;
            line2:string;
            city:string;
            state:string;
            postcode:string;
            country:string;
        } = {line1: '', line2: '', city: '', state: '', postcode: '', country: ''};

        _.forEach(MemberAddress.toStringLabels, (labelValue:string, key:string) => {

            let addressDetail = addressParts.find((addressValue:string, index:number) : boolean => {
                return addressValue.startsWith(labelValue);
            });

            basicAddress[key] = addressDetail ? addressDetail.substring(0, labelValue.length -1) : '';
        });

        return new MemberAddress(basicAddress.line1, basicAddress.postcode, basicAddress.city, basicAddress.state, basicAddress.line2, Country.getCountryFromName(basicAddress.country))
    }
}