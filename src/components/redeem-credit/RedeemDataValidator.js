const Joi = require('@hapi/joi');

const RedeemDataValidator = (data) => {
    const schema = Joi.object().keys({
        kycData: Joi.object().keys({
            name: Joi.string().required(),
            dob: Joi.date().iso().min('1900-01-01').max('2010-01-01').required(),
            nationalities: Joi.string().required(),
            countryOfResidence: Joi.string().required(),
            pob: Joi.string().required(),
            occupation: Joi.string().required(),
            address: Joi.string().required(),
            taxAddress: Joi.string().required(),
            email: Joi.string().email().required(),
            id: Joi.string().required(),
            idType: Joi.string().required()
        }),
        code: Joi.string().required(),
        isRedeemed: Joi.boolean().required(),
        paymentData: Joi.object().keys({
            amount: Joi.string().required(),
            currency: Joi.string().required(),
            paymentType: Joi.string(),
            qty: Joi.string().required()
        }),
    });

    return Joi.validate(data, schema);
}

module.exports = RedeemDataValidator;