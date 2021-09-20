const express = require('express');
const router = express.Router()
const createError = require('http-errors');
const user = require('../models/registration')
const {authSchema ,loginSchema}= require("../validation/validation_schema");
const {signAccessToken,signRefreshToken,verifyRefreshToken} = require("../AccessToken and Refresh Tokens/jwt");

router.post('/register',async(req,res,next)=>{
  try {
      const result=await authSchema.validateAsync(req.body);
      console.log(result)
      const doesExist= await user.findOne({email:result.email})

      if(doesExist) throw createError.Conflict(`${result.email} is already being registerd`);


      const newuser = new user(result);

      const savedUser  = await newuser.save();
      const accessToken = await signAccessToken(savedUser.id)

      const refreshToken = await signRefreshToken(savedUser.id)

      res.send({accessToken,refreshToken});
  } catch (error) {
      if (error.isJoi === true) error.status =422//to see
      next(error);
  }
});

router.post('/login',async(req,res,next)=>{
    try {
        const result=await loginSchema.validateAsync(req.body);
        const loginuser = await user.findOne({email:result.email})

        if(!loginuser) throw createError.NotFound('User not registered');

        const isMatch = await loginuser.isValidPassword(result.password);

        if(!isMatch) throw createError.Unauthorized('password is not a valid');

        const accessToken = await signAccessToken(loginuser.id)
        const refreshToken = await signRefreshToken(loginuser.id)

        res.send({accessToken,refreshToken});

    } catch (error) {
        if (error.isJoi === true) return next(createError.BadRequest("Invalid username/password"));
        next(error)
    }
});
  

router.post('/refresh-token',async(req,res,next)=>{
    try {
        const {refreshToken}=req.body;
        if (!refreshToken) throw createError.BadRequest();
        const userId= await verifyRefreshToken(refreshToken)

        const accessToken = await signAccessToken(userId)
        const refToken = await signRefreshToken(userId)

        res.send({accessToken,refToken});
        
    } catch (error) {
        next(error)
        
    }
});
  
router.delete('/logout',async(req,res,next)=>{
    res.send("logout auth");
});
  

module.exports = router