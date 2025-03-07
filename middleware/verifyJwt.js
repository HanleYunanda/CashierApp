const jwt = require('jsonwebtoken')

const verifyJwt = async (req, res, next) => {
    let token = req.headers.authorization || req.headers.Authorization

    if (!token?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    token = token.slice(7, token.length)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) {
            return res.status(403).json({ message: "Invalid token" })
        }

        req.user = {
            id: user.id,
            email: user.email
        }

        next()
    })
}

module.exports = verifyJwt