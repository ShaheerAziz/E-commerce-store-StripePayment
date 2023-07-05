const express = require('express');
const router = express.Router();

const {addReview, allReviewsOfProduct} = require('../controllers/reviewsController')

router.post('/addReview', addReview)
router.get('/allReviewsOfProduct', allReviewsOfProduct)

module.exports = router;