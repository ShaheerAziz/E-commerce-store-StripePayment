const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({
        _id:{
            type: mongoose.Schema.Types.ObjectId,
            auto: true
        },
        myName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true, unique: 'That email is already taken'
        },
        password: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);


const User = mongoose.model('User', usersSchema);
module.exports = User;