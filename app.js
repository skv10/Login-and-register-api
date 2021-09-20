const express = require('express');
const morgan = require('morgan');
const createError = require('http-errors');
require('dotenv').config();
require('./db/conn');
const {verifyAccessToken}=require('./AccessToken and Refresh Tokens/jwt')

const route = require("./routes/user")


const app = express();

const PORT =process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/',verifyAccessToken,async(req,res,next)=>{
	res.send('Hello From express');
})

app.use('/',route);

app.use(async(req,res,next)=>{
	next(createError.NotFound());
})

app.use(async(err,req,res,next)=>{
	res.status(err.status || 500)
	res.send({
		error:{
			status:err.status || 500,
			message:err.message
		}
	})
})




app.listen(PORT,()=>{
 console.log(`server is running at :${PORT}`);
})