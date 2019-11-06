import countries from "../util/data/countries";

export default class Country {

    name: string;
    displayToUser: boolean;
    isBlacklisted: boolean;
    alpha2Code: string;
    alpha3Code: string;
    demonym: string;
    nativeName: string;
    numericCode: number;
    whitelistCode: number;
    sortOrder: number;
    topLevelDomain: string

    constructor(alpha3Code:string) {
        const country = getCountry(alpha3Code);

        if(!country) {
            console.error(alpha3Code);
            throw new Error(`Country code '${alpha3Code}' is not valid.`);
        }

        this.name = country.name;
        this.displayToUser = country.displayToUser;
        this.isBlacklisted = country.isBlacklisted;
        this.alpha2Code = country.alpha2Code;
        this.alpha3Code = country.alpha3Code;
        this.demonym = country.demonym;
        this.nativeName = country.nativeName;
        this.numericCode = country.numericCode;
        this.whitelistCode = country.whitelistCode;
        this.sortOrder = country.sortOrder;
        this.topLevelDomain = country.topLevelDomain;
    }

    public static getCountryFromName = (countryName:string) : Country | undefined => {

        let countryFound = countries.find(country => country.name === countryName.trim());

        return countryFound ? new Country(countryFound.alpha3Code) : undefined;
    }

    public static getCountryFromNationality = (nationality:string) : Country | undefined => {

        let countryFound = countries.find(country => country.demonym === nationality.trim());

        return countryFound ? new Country(countryFound.alpha3Code) : undefined;
    }
}

const getCountry = (alpha3Code:string) => {
    return countries.find(country => country.alpha3Code === alpha3Code);
}