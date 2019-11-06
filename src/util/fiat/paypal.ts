import MembershipPersonalData from "../../classes/MembershipPersonalData";
import Fees from "../../classes/Fees";
import { DISPLAY_DECIMALS_USD } from "../globalVariables";
import LoadedAsset from "../../classes/LoadedAsset";
import moment from 'moment';

const convertToISO8601DateString = (date:Date) => {
	function pad(number:number) {
		if (number < 10) {
		  return '0' + number;
		}
		return number;
	  }

	  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

export const paypalApplicationContext = () => {
	return {
		brand_name: "BitCar",
		shipping_preference: "NO_SHIPPING",
		user_action: "PAY_NOW"
	};
}

export const convertUserDataToPaypalPayee = (user:MembershipPersonalData) => {

	if(!user.placeOfBirth || !user.homeAddress || !user.taxAddress || !user.identityDocument) {
		throw new Error("User data is invalid, missing place of birth, identity document, home address or tax address.");
	}

	return {
		name: {
			given_name: user.firstName.substring(0, 139),
			surname: user.lastName.substring(0, 139)
		},
		email_address: user.email,
		birth_date: convertToISO8601DateString(user.dateOfBirth),
		address: {
			address_line_1: user.homeAddress.line1,
			address_line_2: user.homeAddress.line2,
			admin_area_1: user.homeAddress.state,
			admin_area_2: user.homeAddress.city,
			postal_code: user.homeAddress.postcode,
			country_code: user.homeAddress.country && user.homeAddress.country.alpha2Code
		}
	}
}

export const createPaypalPurchaseUnits = (purchase:Fees, asset:LoadedAsset, user_token:string) => {

	const carName = `${asset.data.make} ${asset.data.model}`;
	const description = `Fractions of ${carName}`;

	const totalAmount = purchase.totalUsd_display.replace(',','');

	return [{
		amount: {
			currency_code: 'USD',
			value: totalAmount,
			breakdown: {
				item_total: {
					currency_code: 'USD',
					value: totalAmount
				}
			}
		},
		description: `User: ${user_token}`,
		custom_id: user_token,
		items: [{
			name: carName,
			quantity: purchase.tokenQty.toString().replace(',',''),
			description: description,
			sku: asset.address,
			category: 'DIGITAL_GOODS',
			unit_amount: {
				currency_code: 'USD',
				value: purchase.totalUsd.dividedBy(purchase.tokenQty).toFormat(DISPLAY_DECIMALS_USD).replace(',','')
			}
		}]
	}];
}

export const generateReceiptData = (paypalResponse:any, customer:MembershipPersonalData) => {

	const purchaseUnit = paypalResponse && paypalResponse.purchase_units && paypalResponse.purchase_units[0];
	const purchasedItem = purchaseUnit && purchaseUnit.items && purchaseUnit.items[0];
	const amount = purchaseUnit && purchaseUnit.amount;
	const payment = purchaseUnit && purchaseUnit.payments && purchaseUnit.payments.captures && purchaseUnit.payments.captures[0];

	const email_address = paypalResponse.payer && paypalResponse.payer.email_address;
	const redemption_code = payment && payment.id;

	const address = customer.taxAddress ? customer.taxAddress : customer.homeAddress;

	let addressDetails = {};
	if(address) {
		addressDetails = {
			addressLine1: address.line1,
			addressLine2: address.line2,
			city: address.city,
			state: address.state,
			postcode: address.postcode,
			country: address.country && address.country.name
		}
	}

	return {
		paypal_order_id: paypalResponse.id,
		redemption_code: redemption_code,
		custom_id: purchaseUnit.custom_id,
		paypal_email_address: email_address,
		status: paypalResponse.status,
		purchase_date: moment(paypalResponse.create_time).format("YYYY-MM-DD"),
		payment: {
			currency_code: amount && amount.currency_code,
			value: amount && amount.value
		},
		asset: {
			name: purchasedItem && purchasedItem.name,
			quantity: purchasedItem && purchasedItem.quantity,
			sku: purchasedItem && purchasedItem.sku
		},
		customer: {
			name: `${customer.firstName} ${customer.lastName}`,
			...addressDetails
		}
	}
}

export enum paypalStatuses{
	success = "success",
	pending = "pending",
	rejected = "rejected",
	unknown = "unknown",
	error = "error",
	userCancelled = "userCancelled"
}