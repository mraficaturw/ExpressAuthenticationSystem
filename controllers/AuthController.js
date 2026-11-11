const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const {User} = require("../models/")

class AuthController {
    static async register (req, res) {
        const body = req.body

        if(!body.username) return res.status(400).json({message: "Username is Required"})
        if(!body.email) return res.status(400).json({message: "Email is Required"})
        if(!body.password) return res.status(400).json({message: "Password is Required"})
        if(body.password.length < 8) return res.status(400).json({message: "Password Minimum 8 Characters"})

        const user = await User.findOne({
            where:{
                email : body.email
            }
        })

        if(user) return res.status(409).json({message: "Email has already been taken"})

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(body.password, salt);

        await User.create({
            username: body.username,
            email: body.email,
            password:hash
        })
        

        return res.status(201).json({
            message:"Register Berhasil, Silahkan Login",
            User: {
                username : body.username,
                email: body.email
            }
        })
    }

    static async login(req, res) {
        const body = req.body

        if(!body.email) return res.status(400).json({message: "Email is Required"})
        if(!body.password) return res.status(400).json({message: "Password is Required"})
    
        const user = await User.findOne({
            where: {
                email : body.email,
            }
        })
        if(!user) return res.status(401).json({message: "Invalid Credentials"})

        const isPasswordValid = bcrypt.compareSync(body.password, user.password)
        if (!isPasswordValid) return res.status(401).json({message: "Invalid Credentials"})

        const token = jwt.sign({id: user.id, email: user.email}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "1h"})

        return res.status(200).json({
            message:"Login Berhasil",
            token: token,
            User: {
                username : user.username,
                email: user.email
            }
        })
    }

    static async dashboard (req, res) {
        const user = req.user.username

        res.json({
            message: `Hello, ${user}!`,
        })
    }

    static async logout (req, res) {
        const user = req.user.username

        res.json({message: `${user} Berhasil Logout`})
    }
}

module.exports = AuthController