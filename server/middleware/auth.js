import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()
const SECRET = process.env.JWT_SECRET

const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader) return res.status(401).json({ message: 'No authorization token provided' })

        const token = authHeader.split(' ')[1]
        if (!token) return res.status(401).json({ message: 'Invalid token format' })

        const isCustomAuth = token.length < 500

        if (isCustomAuth) {
            const decodeData = jwt.verify(token, SECRET)
            req.userId = decodeData?.id
        } else {
            const decodeData = jwt.decode(token)
            req.userId = decodeData?.sub
        }

        next()
    } catch (error) {
        console.error('Auth middleware error:', error.message)
        return res.status(401).json({ message: 'Invalid or expired token' })
    }
}

export default auth
