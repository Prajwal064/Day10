const express = require("express")
const userModel = require("../config/models/user.model")
const authRouter = express.Router()
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

authRouter.post("/register",  async(req, res)=>{
    const{email, password, name } = req.body


    const userAlreadyExists = await userModel.findOne({email})
    if(userAlreadyExists){
        return res.status(409).json({
            message:"user already exists with this email"
        })
    }
    
    const hash = crypto.createHash("md5").digest("hex")

    const user = await userModel.create({
        email, password:hash, name
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
// protected route
    authRouter.post("/protected", (req,res)=>{
        console.log(req.cookies)
    })          


    



    // login route 
    authRouter.post("/login", async(req,res)=>{
            const{email, password} = req.body

            const user = await userModel.findOne({email})
            if(!user){
                return res.status(404).json({
                    message:"user not found"
                })
            
            }
            const isPasswordMatched = user.password === crypto.createHash("md5").digest("hex")
            if(!isPasswordMatched){
                return res.status(401).json({
                    message:"invalid credentials"
                })
            }
            const token = jwt.sign({
                  id: user._id
            },
                
                  
                process.env.JWT_SECRET
            )
            res.cookie  ("jwt_token", token)

            res.status(200).json({
                message:"login successful",
                user,
                token
            })
    })

})


module.exports = authRouter


