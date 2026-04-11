import express from 'express'
import { createInvoice, updateInvoice, deleteInvoice, getInvoice, getInvoicesByUser, getTotalCount } from '../controllers/invoices.js'
import auth from '../middleware/auth.js'
import { validateInvoice } from '../middleware/validate.js'

const router = express.Router()

router.get('/count', auth, getTotalCount)
router.get('/:id', auth, getInvoice)
router.get('/', auth, getInvoicesByUser)
router.post('/', auth, validateInvoice, createInvoice)
router.patch('/:id', auth, updateInvoice)
router.delete('/:id', auth, deleteInvoice)

export default router
