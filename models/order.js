const mongoose = require('mongoose');

const designerProductSchema = mongoose.Schema(
    {

        designerID: {
            type : String,
            required : true
        },
        products: [{

            designerID: {
                type : String,
                required : true
            },
            productID: {
                type : String,
                required : true
            },
            productName: {
                type : String,
                required : true
            },
            image: {
                type : [String],
                required : true
            },
            size: {
                type : String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            
        }]

    }
);

const OrderSchema = mongoose.Schema(
    {
        _id:{
            type: mongoose.Schema.Types.ObjectId,
            auto: true
        },
        customerID: {
            type : String,
            required: true
        },
        designerProducts: {
            type : [designerProductSchema],
            required : true
        },
        price: {
            type: Number,
            required: true,
            default: 0
        },
        fullName: {
            type: String,
            required: true
        },
        postalCode: {
            type: Number,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'processing', 'delivered'],
            default: 'pending'
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true

    }
);


const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;