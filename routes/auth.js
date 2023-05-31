const express = require('express')
const router = express.Router()

const bcrypt = require('bcryptjs')
const User = require('../models/User')

const {registerValidation, loginValidation} = require('../config/validation')

function result(succ, msg, details){
    if(details){
       return { 
        success: succ,
        message: msg,
        data: details
        }
    } else{
         return { 
        success: succ,
        message: msg
         }
    }
}

router.post('/register', async(req, res)=>{
    const {error} = registerValidation(req.body)
    if(error) return res.status(200).json(result(0,error.details[0].message))

    const usernameExist = await User.findOne({username:req.body.username})
    if(usernameExist) return res.status(200).json(result(0, "username already exists"))

    const salt = await bcrypt.genSalt(10)
    const hashpassword = await bcrypt.hash(req.body.password, salt)

    const user = new User({
        username : req.body.username,
        password: hashpassword
    })

    try{
        const saveUser = await user.save()
        res.status(200).json(result(1, 'Register User Success', saveUser))
    }catch(error)
    {
           res.status(200).json(result(0, 'Register failed'))
    }
})

router.post('/login', async(req, res)=>{
    const {error} = loginValidation(req.body)
    if(error) return res.status(200).json(result(0,error.details[0].message))

    const user = await User.findOne({
        username:req.body.username
    })
    if(!user) return res.status(200).json(result(0, "username not registered"))


    const validpwd = await bcrypt.compare(req.body.password, user.password)
     if(!validpwd) return res.status(200).json(result(0, "wrong password"))


    return res.status(200).json(result(1, "Login User Success", user))
})

module.exports = router