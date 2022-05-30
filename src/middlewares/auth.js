const jwt = require('jsonwebtoken')

exports.auth = (req, res, next) =>{
    const authHeader = req.header('Authorization')
    console.log(authHeader)

    const token = authHeader && authHeader.split(' ')[1]
    console.log('token: ',token)

    if(!token){
        return res.status(401).send({
            message: "Access denied"
        })
    }
    try {
        const verified = jwt.verify(token, process.env.TOKEN_KEY)
        req.user = verified  // ambil data user
        next() // agar setelah diverified, controller dijalankan
    } catch (error) {
        console.log(error),
        res.status(400).send({
            message: "Invalid Token"
        })
    }
}