const mongoose = require('mongoose');
const Shop = require('./shop').schema

const designersSchema = mongoose.Schema(
    {
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
        accountName: {
            type: String,
            required: true
        },
        bankName: {
            type: String,
            required: true
        },
        accountNo: {
            type: Number,
            required: true
        },
        totalNoOfOrders: {
            type: Number,
            default: 0
        },
        totalSales: {
            type: Number,
            default: 0
        },
        avgRatingOfProducts: {
            type: Number,
            default: 0
        }
    },    
    {
        timestamps: true
    }
);


const Designer = mongoose.model('Designer', designersSchema);
module.exports = Designer;