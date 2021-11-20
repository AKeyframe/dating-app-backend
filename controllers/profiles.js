const express = require('express');
const profileRouter = express.Router();
const Profile = require('../models/Profile');

//Update Users Profile
profileRouter.put('/:id', async (req, res) => {
    try {
      
        res.json(
          await Profile.findByIdAndUpdate(req.params.id, req.body, { new: true })
        );
      } catch (error) {
    
        res.status(400).json(error);
      }
});

//Find users based on your prefrences
profileRouter.get('/:id/users', async (req, res) => {
    //Users Prefrences
    const id = req.params.id;
    const prof = await Profile.findById(id);
    const min = prof.betweenAges.min;
    const max = prof.betweenAges.max;
    const gender = prof.interestedIn;
    
    let results = [];

    if(min != 'undefined' && max != 'undefined'){
        if(gender==='men'){
            results = await Profile.find(
                {_id: {$not:{$eq: id}}, age:{$gte:min,$lte:max}, gender: 'male'});
        } else if(gender==='women'){
            results = await Profile.find(
                {_id: {$not:{$eq: id}}, age:{$gte:min,$lte:max}, gender: 'female'});
        } else {
            results = await Profile.find(
                {_id: {$not:{$eq: id}}, age:{$gte:min,$lte:max}});
        }
    }
    
        
    try {
        res.json(results);  
    } catch (error){
        res.status(400).json(error);
    }
});


profileRouter.post('/', async (req, res) => {
    try {
        res.json(await Profile.create(req.body));

      } catch (error) {

        res.status(400).json(error);
      }
});

//Retrive Users Profile
profileRouter.get('/:id', async (req, res) => {
    
    try {
        res.json(await Profile.find({user: req.params.id}));
    } catch (error) {

      res.status(400).json(error);
    }
  });

  module.exports = profileRouter;