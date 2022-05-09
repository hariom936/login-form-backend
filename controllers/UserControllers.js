import UserModel from '../models/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

class UserController{
    static userRegistration = async (req, res) =>{
        const {name, email, password, confirmpassword, tc} = req.body
        //find email 
        const user = await UserModel.findOne({email:email})
        if(user){
           res.send({"status":"failed", "message":"Email already use"})
        }else{
            if(name && email && password && confirmpassword && tc){
                if(password === confirmpassword){
                    try {
                        const salt = await bcrypt.genSalt(10)
                        const hashPassword = await bcrypt.hash(password, salt)
                        const  doc = new UserModel({
                        name: name,
                        email: email,
                        password: hashPassword,
                        tc: tc
                    })
                    await doc.save()
                    const saved_user = await UserModel.findOne({email:email})
                    //Generate JWT Token
                    const token = jwt.sign({userId:saved_user._id},process.env.JWT_SCCRET_KEY, {expiresIn: '5d'})

                    res.status(201).send({"status":"success", "message":"Registration Successfully", "token":token})
                    } catch (error) {
                        //console.log(error)
                        res.send({"status":"failed", "message":"Unable to Register"})
                    }
                }else{
                    res.send({"status":"failed", "message":"password not matched"})
                }
            }else{
                res.send({"status":"failed", "message":"All fields are required"})
            }
        }
    }
    static userLogin = async(req, res) => {
        try {
            const {email, password} = req.body
            if(email && password){
                const user = await UserModel.findOne({email:email})
                if(user != null ){
                    const  isMatch = await bcrypt.compare(password, user.password)
                    if((user.email === email) && isMatch){
                        //Generate JWT Token
                    const token = jwt.sign({userId:saved_user._id},process.env.JWT_SCCRET_KEY, {expiresIn: '5d'})
                        res.send({"status":"success", "message":"Login Success", "token": token}) 
                    }else{
                        res.send({"status":"failed", "message":"Email or Password not valid"})

                    }
                }else{
                    res.send({"status":"failed", "message":"you are not a register user"})   
                }
            }else{
                res.send({"status":"failed", "message":"All fields are required"}) 
            }
        } catch (error) {
            console.log(error)
            res.send({"status":"failed", "message":"Unable to login"}) 
        }
    }
    static changeUserPassword = async(req, res)=>{
        const {password, confirmpassword} = req.body
        if(password && confirmpassword){
            if(password !== confirmpassword){
                res.send({"status":"failed", "message":"New Password and confirm New Password not matched"}) 
            }else{
                const salt = await bcrypt.genSalt(10)
                const newhashPassword = await bcrypt.hash(password, salt)
                console.log(req.user)
            }
        }else{
            res.send({"status":"failed", "message":"All fields are Required"}) 
        }
    }
}

export default UserController;