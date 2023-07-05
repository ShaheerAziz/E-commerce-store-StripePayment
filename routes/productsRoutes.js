const express = require('express');
const router = express.Router();
const { createProduct, deleteProduct, getProductById, updateProduct, 
        getProductsByDesignerID, getProductByCategory, getAllProducts, 
        placeRating, searchProducts, topProducts, featureProduct,
        getAllFeatureProduct } =  require('../controllers/productsController')


router.post('/createProduct', createProduct)
router.get('/getProductByID/:id', getProductById)
router.delete('/deleteProductByID/:id', deleteProduct)
router.put('/updateProduct/:id', updateProduct)
router.get('/getProductsByDesignerID/:id', getProductsByDesignerID)
router.get('/getProductByCategory/:category', getProductByCategory)
router.get('/getAllProducts', getAllProducts)
router.put('/placeRating/:id/:rating', placeRating)
router.get('/searchProducts', searchProducts)
router.get('/topProducts', topProducts)
router.put('/featureProduct', featureProduct)
router.get('/getAllFeatureProduct', getAllFeatureProduct)

module.exports = router;