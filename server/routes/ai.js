import express from 'express'
import auth from '../middleware/auth.js' 
import {
    chatWithAssistant,
    generatePaymentReminder,
    categorizeExpenses,
} from '../controllers/ai.js'

const router = express.Router()

router.post('/chat', chatWithAssistant)
router.post('/payment-reminder', generatePaymentReminder)
router.post('/categorize', categorizeExpenses)

export default router