import express from 'express'
import { signin, signup, forgotPassword, resetPassword } from '../controllers/user.js'
// import { validateSignup, validateSignin } from '../middleware/validate.js'
const router = express.Router()
// Direct core logic connectivity
router.post('/signin', signin)
router.post('/signup', signup)
router.post('/forgot', forgotPassword)
router.post('/reset', resetPassword)

export default router