const express = require("express")
const userModel = require("../config/models/user.model")
const authRouter = express.Router()
const jwt = require("jsonwebtoken")

authRouter.post("/register",  async(req, res)=>{
    const{email, password, name } = req.body


    const userAlreadyExists = await userModel.findOne({email})
    if(userAlreadyExists){
        return res.status(400).json({
            message:"user already exists with this email"
        })
    }


    const user = await userModel.create({
        email, password, name
    })
 
    // // creating the token for the user
    // const token = jwt.sign(
    //     {
    //     id:user_id
    // },
    //  process.env.JWT_SECRET
    // )


    const token = jwt.sign(
        {
            id:user._id,
            email:user.email,
        }, 
        process.env.JWT_SECRET
    )

    res.cookie("jwt_token", token)




    res.status(201).json({  
        message: " user created successfully",
        user,
        token
   
    })

})


module.exports = authRouter


