const Review = require('../models/reviews')
const Product = require('../models/products')
const Designer = require('../models/designer')
const asyncHandler = require('express-async-handler')

const addReview = asyncHandler(async (req, res) => {
    try{

        const {productID, userID, myName, rating, comment} = req.body

        const review = new Review({
            userID,
            myName,
            productID,
            rating,
            comment
        }) 
    
    
        const product = await Product.findById(productID)
        product.avgRating = ((product.avgRating * product.noOfReviews) + rating) / (product.noOfReviews + 1)
        product.noOfReviews = product.noOfReviews + 1 
        const designerID =  product.designerID
        const designer = await Designer.findById(designerID)
    
    
        const products = await Product.find({designerID: designerID})
        var count = 0
        var _rating = 0
        for (var _product of products){
            if(_product.avgRating != 0){
                count = count + 1
                _rating = _rating + _product.avgRating
            }
        }
        _rating = _rating + rating
        count = count + 1
    
        designer.avgRatingOfProducts = _rating/count
    
        try{
    
            await review.save()
            await designer.save()
            await product.save()
        }
        catch(err){
            res.status(400).json({
                message: err
            })
        }
    
        res.status(200).json({
            review
        })

    }catch(err){
        res.status(400).json({
            message: err
        })
    }

})

const allReviewsOfProduct = asyncHandler(async(req, res) => {

    try{

        const id = req.query.id
        const pageSize = 10
        const limit = Number(req.query.limit) || 10
        const page = Number(req.query.page) || 1
        const count = await Review.countDocuments({productID: id})
        const reviews = await Review.find({productID: id})
            .limit(limit)
            .skip(pageSize * (page - 1))
        res.status(200).json({ reviews, page, count, pages: Math.ceil(count / pageSize) })

    }catch(err){
        res.status(400).json({
            message: err
        })
    }


})

module.exports = {addReview, allReviewsOfProduct}