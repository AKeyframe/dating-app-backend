const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User', 
            required: true,
            unique: true},
            
    like: [{type: Schema.Types.ObjectId, ref: 'Profile'}],
    dislike: [{type: Schema.Types.ObjectId, ref: 'Profile'}],
    likedBy: [{type: Schema.Types.ObjectId, ref: 'Profile'}],
    matches: [{match: {type: Schema.Types.ObjectId, ref: 'Profile'},
            messages: [{message: String,
                            sender: String, 
                        time: String }]}],

    lookingFor: String,
    interestedIn: String,
    betweenAges: {min:String, max:String},

    first: String,
    age: Number,
    gender: String,
    education: String,
    job: String,
    about: String,
    interests: [{type: String}],
    photos: [{type: String}],
    settings: Object,
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;