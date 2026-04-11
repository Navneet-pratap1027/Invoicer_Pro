import express from 'express'
import { signin, signup, forgotPassword, resetPassword } from '../controllers/user.js'
import { validateSignup, validateSignin } from '../middleware/validate.js'

const router = express.Router()

router.post('/signin', validateSignin, signin)
router.post('/signup', validateSignup, signup)
router.post('/forgot', forgotPassword)
router.post('/reset', resetPassword)

export default router
