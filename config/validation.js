const Joi = require('joi')
const registerValidation = (data)=> {
    const schema = Joi.object({
        username:Joi.String().required(),
        password: Joi.String().min(6).required()

    })
    return schema.validate(data)
}

const loginValidation = (data)=> {
    const schema = Joi.object({
        username:Joi.String().required(),
        password: Joi.String().min(6).required()

    })
    return schema.validate(data)
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation
