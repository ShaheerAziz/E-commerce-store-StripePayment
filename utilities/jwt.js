const jwt = require ('jsonwebtoken');



const generateToken = ( (id) => {
    
    token = jwt.sign({id}, process.env.SECRETKEY , {expiresIn: '30d'});
    return token;

})

module.exports = { generateToken }  


