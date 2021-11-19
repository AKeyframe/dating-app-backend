const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const salt = 12;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    
    complete: Boolean

}, {
  timestamps: true
});

userSchema.methods.comparePassword = function(tryPass, cb){
   
    bcrypt.compareSync(tryPass, this.passsword);
}

userSchema.set('toJSON', {
  transform: function (doc, ret) {
    // remove the password property when serializing doc to JSON
    delete ret.password;
    return ret;
  }
});

//Before the user is saved
//Mongoose Middleware .pre
userSchema.pre('save', function(next) {
    const user = this;
    //Check to see if the password has been changed
    //if it hasn't return, otherwise hash and salt
    if(!user.isModified('password')) return next();
    bcrypt.hash(user.password, salt, (error, hash) => {
        if(error) return next(error);
        //replace user password with the hash
        user.password = hash;
        next();
    });
});

const User = mongoose.model('User', userSchema);

module.exports = User;