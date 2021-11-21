const express = require('express');
const profileRouter = express.Router();
const Profile = require('../models/Profile');


profileRouter.get('/likedBy/:id', async (req, res) => {
   
    //console.log(data);
    try{
      res.json(await Profile.findById(req.params.id).populate('interactions.likedBy'))
    } catch(error){
      console.log(error)
    }

});

// Like another user
profileRouter.put('/like/:id', async (req, res) => {
  let ownerId = req.body.id
  Profile.findById(ownerId, (error, user) => {
      user.interactions.met.push(req.params.id);
      user.interactions.likes.push(req.params.id);
      user.save();
  });
  

  try {
    res.json(
      await Profile.findByIdAndUpdate(req.params.id, {$push: {"interactions.likedBy": ownerId}}, { new: true })
    );
  } catch (error) {

    res.status(400).json(error);
  }
});

profileRouter.put('/dislike/:id', async (req, res) => {
  console.log(req.params.id)
  console.log(req.body) //userId
  let userId = req.body.id;

  try {
    res.json(
      await Profile.findByIdAndUpdate(req.params.id, {$push: {"interactions.met": userId}}, { new: true })
    );
  } catch (error) {

    res.status(400).json(error);
  }
})


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

    console.log('before');
    console.log(results);
    prof.interactions.met.forEach((person, i) => {
      results = results.filter((result, i) => {
        console.log(result._id)
        console.log(person)
        if(result._id.toString() == person.toString()){
            console.log("true")
            return;
        } else {
          console.log('false')
          return result;
        }
      });
    });

    console.log('after')
    console.log(results)
      
    
        
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