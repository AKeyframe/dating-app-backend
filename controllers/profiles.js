const express = require('express');
const profileRouter = express.Router();
const Profile = require('../models/Profile');


profileRouter.get('/likedBy/:id', async (req, res) => {
   
    try{
      res.json(await Profile.findById(req.params.id).populate('interactions.likedBy'))
    } catch(error){
      console.log(error)
    }

});

profileRouter.get('/matches/:id', async (req, res) => {

    try{
      res.json(await Profile.findById(req.params.id).populate('interactions.matches.match'));
    } catch(error){
      console.log(error)
    }
})


// Like another user
profileRouter.put('/like/:id', async (req, res) => {
  let bothLiked = false;
  const ownerId = req.body.id;
  const userId = req.params.id;
  let pos = 0; 

  //Find the owner and check to see if they were liked by this person
  Profile.findById(ownerId, (error, user) => {
    user.interactions.likedBy.forEach((p, i) => {
        //If they were upate matches instead
        if(p.toString() == userId){
            bothLiked=true;
            pos = i;
        }
    });
    if(bothLiked === false){
        user.interactions.met.push(req.params.id);
        user.save();

    } else if(bothLiked === true){
        user.interactions.likedBy.splice(pos, 1);
        user.interactions.met.push(userId);
        user.interactions.matches.push({match: userId, messages: []});
        user.save();

        let pos2 = 0;
        Profile.findById(userId, ((error, otherUser) => {
          otherUser.interactions.likedBy.forEach((p, i) => {
            //If they were upate matches instead
            if(p.toString() == ownerId){
                pos2 = i;
            }
          });

        otherUser.interactions.likedBy.splice(pos2, 1);
        otherUser.interactions.matches.push({match: ownerId, messages: []});
        otherUser.save();
      
      })); //otherUser
    } //else if
  }); //user
  
  if(bothLiked === true){
   
    try {
      res.json(
        await Profile.findByIdAndUpdate(req.params.id, {$push: {"interactions.matches": {match: ownerId, messages: []}}}, { new: true })
      );
    } catch (error) {

      res.status(400).json(error);

    } 
  } else if(bothLiked === false){
    console.log('if')
    try {
      res.json(
        await Profile.findByIdAndUpdate(req.params.id, {$push: {"interactions.likedBy": ownerId}}, { new: true })
      );
    } catch (error) {

      res.status(400).json(error);
    }
  } 


  
});

profileRouter.put('/dislike/:id', async (req, res) => {
  let ownerId = req.params.id;
  let userId = req.body.id;

  Profile.findById(ownerId, (error, user) => {
      user.interactions.likedBy = user.interactions.likedBy.filter((p, i) => {
          if(p == userId){
            return;
          } else {
            return p;
          }
      });
      user.save();
  });

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

    //Go through and remove anyone the user has interacted with
    prof.interactions.met.forEach((person, i) => {
      results = results.filter((result, i) => {
        if(result._id.toString() == person.toString()){
            return;
        } else {
            return result;
        }
      });
    });    
        
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