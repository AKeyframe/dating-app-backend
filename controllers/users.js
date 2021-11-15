const express = require('express');
const userRouter = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const secret = process.env.SECRET;

userRouter.post('/signup', async (req, res) => {
    console.log('Signup req.body');
    console.log(req.body);
    const user = new User(req.body);
    try {
        await user.save();
        //create the web token for auth
        const token = createJWT(user);
        res.json({token});
        
    } catch (err) {
        
        res.status(400).json(err);
    }
});

userRouter.post('/login', async (req, res) => {
    try{
        console.log(req.body);
        const user = await User.findOne({username: req.body.username});
        console.log(user);
        if(!user) res.status(401).json({err: 'Bad Credentials'});
        console.log('about to compare');
        console.log(req.body.pw);
        console.log(user.password);
        let isMatch = bcrypt.compareSync(req.body.pw, user.password)
            console.log('after compare');
            console.log(isMatch);
            if(isMatch) {
                const token = createJWT(user);
                res.json({token});
                
            } else {
                return res.status(401).json({err: 'Bad Credentials'});
            }
        
    } catch (err) {
        return res.status(401).json(err);
    }
})

//////////////////////////////////////////////



function createJWT(user) {
    return jwt.sign({user}, secret, {expiresIn: '24h'});
}


module.exports = userRouter;