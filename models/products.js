const mongoose = require('mongoose');
const Review = require('./reviews').schema;

const productsSchema = mongoose.Schema(
    {
        _id:{
            type: mongoose.Schema.Types.ObjectId,
            auto: true
        },
        designerID : {
            type : String,
            required : true
        },
        productName: {
            type: String,
            required: true
        },
        image: {
            type: [String],
            required: true
        },
        category: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        description:{
            type: String,
            required: true
        },
        quantity: {
            type: [Number],
            required: true
        },
        size: {
            type: [String],
            required: true,
            enum: ['S', 'M', 'L'],
        },
        avgRating: {
            type: Number,
            default: 0,
        },    
        noOfReviews: {
            type: Number,
            default: 0
        },
        noOfSales: {
            type: Number,
            default: 0
        },
        featured: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const Product = mongoose.model('Product', productsSchema);
module.exports = Product;