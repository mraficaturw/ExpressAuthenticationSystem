const jwt = require("jsonwebtoken")
const {User} = require("../models/")

async function verifyToken(req, res, next) {
    try {
        const token = req.headers.authorization?.split(' ')[1]

        if(!token) return res.status(401).json({message:"Access Denied"})

        const payload = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findByPk(payload.id)
        if(!user) return res.status(401).json({message:"Access Denied"})

        req.user = user

        next()

    } catch(err) {
        console.log(err)
        res.status(401).json({message:"Access Denied"})
    }
}

module.exports = verifyToken