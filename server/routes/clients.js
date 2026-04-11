import express from 'express'
import { getClients, createClient, updateClient, deleteClient, getClientsByUser } from '../controllers/clients.js'
import auth from '../middleware/auth.js'
import { validateClient } from '../middleware/validate.js'

const router = express.Router()

router.get('/', auth, getClients)
router.get('/user', auth, getClientsByUser)
router.post('/', auth, validateClient, createClient)
router.patch('/:id', auth, updateClient)
router.delete('/:id', auth, deleteClient)

export default router
