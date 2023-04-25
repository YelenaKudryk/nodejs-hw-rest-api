const { Schema, model } = require('mongoose');
const Joi = require('joi')
const {handleMongooseError} = require('../decorators')

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const subscriptionType = ["starter", "pro", "business"];

const userSchema = new Schema({
  password: {
      type: String,
      minlength: 4,
      required: [true, 'Password is required'],
  },
  email: {
    type: String,
    validate: {
    validator: function(v) {
        return emailRegexp.test(v);
      },
      message: props => `${props.value} is not a valid email!`
    },
    required: [true, 'Email is required'],
    unique: true,
  },
  subscription: {
    type: String,
    enum: subscriptionType,
    default: "starter"
  },
  token: {
    type: String,
    default: null,
  },
},
    {
    versionKey: false,
    timestamps: true
    })

userSchema.post("save", handleMongooseError)

const User = model("user", userSchema)
    
const registerSchema = Joi.object({
    password: Joi.string().min(4).required(),
    email: Joi.string().pattern(emailRegexp).required(),
    subscription: Joi.string().valid(...subscriptionType)
})

const loginSchema = Joi.object({
    password: Joi.string().min(4).required(),
    email: Joi.string().pattern(emailRegexp).required()
})

const subscriptionSchema = Joi.object({
  subscription: Joi.string().valid(...subscriptionType)
})

const schemas = {
  registerSchema,
  loginSchema,
  subscriptionSchema
}

module.exports = {
    User,
    schemas
}