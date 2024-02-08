const passport = require('passport');
const jwt = require('jsonwebtoken');
const SRECRETKEY = 'Teste2024Wi'

//strategy swt con local storage.

const generateToken = (usuarios) =>jwt.sign({usuarios}, SRECRETKEY, {expiresIn:"1h"})

//midlleware authorizate/passport
const authCall = (req, res, next)=>{    
    // if(!req.headers.authorization){
    //     res.setHeader('Content-Type', 'application/json');
    //     return res.status(401).json({error:`user not autenticate`})}
    if(!req.headers.authorization) return res.status(401).send({error:"Unauthorized!!!"})
    //if(req.user.role!=role)return res.status(403).send({error:"No permissions!!"})
    let token = req.headers.authorization.split(" ")[1]
    try {        
        let user = jwt.verify(token, SRECRETKEY)
        req.usuario = user
        next()
    } catch (error) {
        return res.status(401).json(error.message);
        
    }
} 

//strategy passport jwb con cookie
const passportCall = (strategy) => {
    return async(req, res, next)=>{
        passport.authenticate(strategy, function(err, user, info){
            if(err) return next(err);
            if(!user){
                return res.status(401).send({error:info.messages?info.messages:info.toString()})
            }

            req.user = user;
            next()
        })(req,res,next)

    }
}

module.exports = {passportCall, SRECRETKEY, generateToken, authCall}