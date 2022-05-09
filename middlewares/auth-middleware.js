import jwt from "jsonwebtoken";
import UserModel from '../models/user.js'

var checkUserAuth = async(req, res, next)=>{
    let token 
    const {authorization} = req.headers
    if(authorization && authorization.startWith('Bearer')){
        try {

            //Get token from header
            token = authorization.split(' ')[1]
            console.log("Token", token)
            console.log("Authorization", authorization)

            // verify token
            const{userID} = jwt.verify(token, process.env.JWT_SECRET_KEY)

            //Get user from token
            req.user = await UserModel.findById(userID).select(-password)
            next()
        } catch (error) {
            res.status(401).send({"status": "Unauthorized User"})
            
        }
    }
    if(!token){
        res.status(401).send({"message": "Unauthorized User"})
    }
}

export default checkUserAuth