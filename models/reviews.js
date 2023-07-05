const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
    {
        _id:{
            type: mongoose.Schema.Types.ObjectId,
            auto: true
        },
        userID : {
            type : String,
            required : true
        },
        myName : {
            type : String,
            required : true
        },
        productID : {
            type : String,
            required : true
        },
        rating: {
            type: Number,
            required: true,
            enum: [0,1,2,3,4,5]

        },
        comment: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);


const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;