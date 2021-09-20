const joi = require('@hapi/joi');

const authSchema = joi.object({
    username:joi.string().min(2).lowercase().required(),
    name:joi.string().required(),
    email:joi.string().email().lowercase().required(),
    password:joi.string().min(2).required(),
})

const loginSchema = joi.object({
    email:joi.string().email().lowercase().required(),
    password:joi.string().min(2).required(),
})

module.exports ={
    authSchema,loginSchema
}