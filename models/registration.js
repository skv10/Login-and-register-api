const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Book Schema
const registrationSchema = mongoose.Schema({
	username:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        unique:true
    }
});


registrationSchema.pre('save',async function(next){

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password,salt);
        this.password=hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

registrationSchema.methods.isValidPassword = async function(password){
    try {
       return  await bcrypt.compare(password,this.password);
    } catch (error) {
        throw error
    }
}

const registerUser =  mongoose.model('register-user', registrationSchema);




module.exports = registerUser;

