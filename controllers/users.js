const express = require('express');
const userRouter = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const secret = process.env.SECRET;

userRouter.post('/signup', async (req, res) => {
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
        const user = await User.findOne({username: req.body.username});

        if(!user) res.status(401).json({err: 'Bad Credentials'});
     
        let isMatch = bcrypt.compareSync(req.body.pw, user.password)
            if(isMatch) {
                const token = createJWT(user);
                console.log(token);
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