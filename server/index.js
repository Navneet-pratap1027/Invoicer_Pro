import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
import puppeteer from 'puppeteer'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

import invoiceRoutes from './routes/invoices.js'
import clientRoutes from './routes/clients.js'
import userRoutes from './routes/userRoutes.js'
import profile from './routes/profile.js'
import pdfTemplate from './documents/index.js'
import emailTemplate from './documents/email.js'

dotenv.config()

const app = express()

app.use(express.json({ limit: '30mb' }))
app.use(express.urlencoded({ limit: '30mb', extended: true }))
app.use(cors())

app.use('/invoices', invoiceRoutes)
app.use('/clients', clientRoutes)
app.use('/users', userRoutes)
app.use('/profiles', profile)

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    tls: { rejectUnauthorized: false },
})

// Puppeteer replaces abandoned html-pdf/PhantomJS
const generatePDF = async (htmlContent) => {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })
    const page = await browser.newPage()
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' })
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true })
    await browser.close()
    return pdfBuffer
}

app.post('/send-pdf', async (req, res) => {
    const { email, company } = req.body

    // ✅ NULL SAFETY: fallback if company not set in Settings
    const safeCompany = company || {}
    const companyEmail = safeCompany.email || ''
    const companyName = safeCompany.businessName || safeCompany.name || 'InvoicerPro'

    try {
        const pdfBuffer = await generatePDF(pdfTemplate(req.body))
        const pdfPath = `${__dirname}/invoice.pdf`
        fs.writeFileSync(pdfPath, pdfBuffer)
        await transporter.sendMail({
            from: `InvoicerPro <hello@invoicerpro.com>`,
            to: `${email}`,
            replyTo: companyEmail,
            subject: `Invoice from ${companyName}`,
            text: `Invoice from ${companyName}`,
            html: emailTemplate(req.body),
            attachments: [{ filename: 'invoice.pdf', path: pdfPath }],
        })
        res.status(200).json({ message: 'Invoice sent successfully' })
    } catch (err) {
        console.error('Send PDF error:', err)
        res.status(500).json({ message: 'Failed to send invoice' })
    }
})

app.post('/create-pdf', async (req, res) => {
    try {
        const pdfBuffer = await generatePDF(pdfTemplate(req.body))
        fs.writeFileSync(`${__dirname}/invoice.pdf`, pdfBuffer)
        res.status(200).json({ message: 'PDF created successfully' })
    } catch (err) {
        console.error('Create PDF error:', err)
        res.status(500).json({ message: 'Failed to create PDF' })
    }
})

app.get('/fetch-pdf', (req, res) => {
    res.sendFile(`${__dirname}/invoice.pdf`)
})

app.get('/', (req, res) => res.send('InvoicerPro Server is Running'))

const DB_URL = process.env.DB_URL
const PORT = process.env.PORT || 5000

mongoose
    .connect(DB_URL)
    .then(() => app.listen(PORT, () => console.log(`InvoicerPro server running on port: ${PORT}`)))
    .catch((error) => console.error('DB connection error:', error.message))