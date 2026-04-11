import mongoose from 'mongoose'

const InvoiceSchema = mongoose.Schema({
    dueDate: Date,
    currency: String,
    items: [{ itemName: String, unitPrice: String, quantity: String, discount: String }],
    rates: String,
    vat: Number,
    total: Number,
    subTotal: Number,
    notes: String,
    status: { type: String, enum: ['Paid', 'Unpaid', 'Partial', 'Overdue'], default: 'Unpaid' },
    invoiceNumber: String,
    type: String,
    creator: [String],
    totalAmountReceived: { type: Number, default: 0 },
    client: { name: String, email: String, phone: String, address: String },
    paymentRecords: [{ amountPaid: Number, datePaid: Date, paymentMethod: String, note: String, paidBy: String }],
    createdAt: { type: Date, default: () => new Date() },   // Fixed: arrow fn runs per-document
})

const InvoiceModel = mongoose.model('InvoiceModel', InvoiceSchema)
export default InvoiceModel
