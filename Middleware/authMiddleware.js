const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler') 
const User = require('../models/users.js');
const Admin = require('../models/admin.js');
const Designer = require('../models/designer.js');


const protected = asyncHandler(async (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try{

            var token = req.headers.authorization.split(" ")[1];
            var decoded = jwt.verify(token, process.env.SECRETKEY);
            //console.log("ID : ", decoded)
            const user = await User.findOne( { _id: decoded.id } )
            const admin = await Admin.findOne({ _id: decoded.id})
            const designer = await Designer.findOne({ _id: decoded.id})

            if(user || admin || designer){
                next()
            }
            else{
                res.status(401).json({
                    message: err
                })
            }

            
        }
        catch(err) {
            res.status(401).json({
                message: err
            })
        }
    }
    else{

        res.status(401).json({
            message: "Not logged IN"
        })

    }

})


module.exports = { protected }