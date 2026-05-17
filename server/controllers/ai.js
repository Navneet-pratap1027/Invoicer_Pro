// import { GoogleGenAI } from '@google/genai';
// import dotenv from 'dotenv';

// // Ensure env variables are loaded
// dotenv.config();

// // Initialize Gemini Client
// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// // ── Helper: Call Gemini ──────────────────────────────────────────────
// const callGemini = async (prompt, isJson = false) => {
//     const config = {
//         temperature: 0.7,
//         maxOutputTokens: 1024,
//     };

//     if (isJson) {
//         config.responseMimeType = "application/json";
//     }

//     // Naye SDK ke liye bilkul sahi model identifier string use kar rahe hain
//     const response = await ai.models.generateContent({
//         model: 'gemini-2.5-flash', // Naye SDK par yeh free tier par super stable chalta hai
//         contents: prompt,
//         config: config
//     });

//     return response.text || 'No response generated.';
// }

// // ── 1. AI Chat Assistant ─────────────────────────────────────────────
// export const chatWithAssistant = async (req, res) => {
//     const { message, invoiceContext } = req.body;

//     if (!message) return res.status(400).json({ message: 'Message is required' });

//     try {
//         const prompt = `
// You are InvoicerPro AI Assistant — a helpful assistant for a professional invoicing application.
// Be concise, professional, and friendly.

// ${invoiceContext ? `Here is context about the user's invoices:
// - Total invoices: ${invoiceContext.totalInvoices || 0}
// - Total revenue: ${invoiceContext.currency || '₹'}${invoiceContext.totalRevenue || 0}
// - Unpaid invoices: ${invoiceContext.unpaidCount || 0}
// - Overdue invoices: ${invoiceContext.overdueCount || 0}
// ` : ''}

// User question: ${message}`;

//         const reply = await callGemini(prompt, false);
//         res.status(200).json({ reply });
//     } catch (err) {
//         console.error('Chat AI error:', err);
//         res.status(500).json({ message: 'AI assistant unavailable. Please try again.' });
//     }
// }

// // ── 2. Payment Reminder Generator ────────────────────────────────────
// export const generatePaymentReminder = async (req, res) => {
//     const { clientName, clientEmail, invoiceNumber, amount, currency, dueDate, daysOverdue, businessName } = req.body;

//     if (!clientName || !amount) return res.status(400).json({ message: 'Client name and amount are required' });

//     try {
//         const tone = daysOverdue > 30 ? 'firm but professional' : daysOverdue > 14 ? 'politely urgent' : 'friendly reminder';

//         const prompt = `
// Generate a payment reminder email based on these details:
// - Business sending reminder: ${businessName || 'Our Business'}
// - Client name: ${clientName}
// - Client email: ${clientEmail || ''}
// - Invoice number: ${invoiceNumber || 'N/A'}
// - Amount due: ${currency || '₹'}${amount}
// - Due date: ${dueDate || 'N/A'}
// - Days overdue: ${daysOverdue || 0}
// - Tone: ${tone}

// Return a JSON object with exactly two keys: "subject" and "emailBody".`;

//         const rawResponse = await callGemini(prompt, true);
//         const result = JSON.parse(rawResponse.trim());

//         res.status(200).json({ 
//             emailBody: result.emailBody, 
//             subject: result.subject 
//         });
//     } catch (err) {
//         console.error('Payment reminder AI error:', err);
//         res.status(500).json({ message: 'Could not generate reminder. Please try again.' });
//     }
// }

// // ── 3. Expense Categorizer ───────────────────────────────────────────
// export const categorizeExpenses = async (req, res) => {
//     const { items } = req.body;

//     if (!items || !items.length) return res.status(400).json({ message: 'Items are required' });

//     try {
//         const itemList = items.map((item, i) => `${i + 1}. ${item.itemName} - Amount: ${item.unitPrice * item.quantity}`).join('\n');

//         const prompt = `
// Categorize each of these invoice items into standard business expense categories:
// ${itemList}

// Available categories: Software & Tools, Professional Services, Marketing & Advertising, Office Supplies, Travel & Transport, Food & Entertainment, Utilities, Hardware & Equipment, Consulting, Design & Creative, Development, Other

// Return a valid JSON array of objects, where each object has keys: "itemName", "category", "confidence", "reason".`;

//         const raw = await callGemini(prompt, true);
//         const categories = JSON.parse(raw.trim());

//         res.status(200).json({ categories });
//     } catch (err) {
//         console.error('Categorizer AI error:', err);
//         res.status(500).json({ message: 'Could not categorize items. Please try again.' });
//     }
// }


import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

// Ensure env variables are loaded
dotenv.config();

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// ── Helper: Call Gemini ──────────────────────────────────────────────
const callGemini = async (prompt, isJson = false) => {
    const config = {
        temperature: 0.7,
        maxOutputTokens: 1024,
    };

    if (isJson) {
        config.responseMimeType = "application/json";
    }

    // Naye SDK ke liye bilkul sahi model identifier string use kar rahe hain
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash', // Naye SDK par yeh free tier par super stable chalta hai
        contents: prompt,
        config: config
    });

    return response.text || 'No response generated.';
}

// ── 1. AI Chat Assistant ─────────────────────────────────────────────
export const chatWithAssistant = async (req, res) => {
    const { message, invoiceContext } = req.body;

    if (!message) return res.status(400).json({ message: 'Message is required' });

    try {
        const prompt = `
You are InvoicerPro AI Assistant — a helpful assistant for a professional invoicing application.
Be concise, professional, and friendly.

${invoiceContext ? `Here is context about the user's invoices:
- Total invoices: ${invoiceContext.totalInvoices || 0}
- Total revenue: ${invoiceContext.currency || '₹'}${invoiceContext.totalRevenue || 0}
- Unpaid invoices: ${invoiceContext.unpaidCount || 0}
- Overdue invoices: ${invoiceContext.overdueCount || 0}
` : ''}

User question: ${message}`;

        const reply = await callGemini(prompt, false);
        res.status(200).json({ reply });
    } catch (err) {
        console.error('Chat AI error:', err);
        res.status(500).json({ message: 'AI assistant unavailable. Please try again.' });
    }
}

// ── 2. Payment Reminder Generator ────────────────────────────────────
export const generatePaymentReminder = async (req, res) => {
    const { clientName, clientEmail, invoiceNumber, amount, currency, dueDate, daysOverdue, businessName } = req.body;

    if (!clientName || !amount) return res.status(400).json({ message: 'Client name and amount are required' });

    try {
        const tone = daysOverdue > 30 ? 'firm but professional' : daysOverdue > 14 ? 'politely urgent' : 'friendly reminder';

        const prompt = `
You are an expert financial assistant for a billing application. 
Generate a professional payment reminder email based on these exact details:
- Sender Company / Business: ${businessName || 'Our Business'}
- Client Name: ${clientName}
- Client Email: ${clientEmail || ''}
- Invoice Number: ${invoiceNumber || 'N/A'}
- Total Outstanding Amount: ${currency || '₹'}${amount}
- Original Due Date: ${dueDate || 'N/A'}
- Overdue Days: ${daysOverdue || 0}
- Communication Tone: ${tone}

Formatting rules for the "emailBody":
1. Add explicit newline characters (\\n) between sections to ensure clear paragraph breaks.
2. Start with a direct greeting (e.g., "Dear ${clientName},\\n\\n").
3. Present the invoice parameters distinctly so they don't bunch up. 
4. Ensure the currency character stays clearly next to the digit values without weird spaces.
5. Provide an elegant, clean sign-off structure separated by line breaks.

Return a valid JSON object with exactly two keys: "subject" and "emailBody".`;

        const rawResponse = await callGemini(prompt, true);
        const result = JSON.parse(rawResponse.trim());

        res.status(200).json({ 
            emailBody: result.emailBody, 
            subject: result.subject 
        });
    } catch (err) {
        console.error('Payment reminder AI error:', err);
        res.status(500).json({ message: 'Could not generate reminder. Please try again.' });
    }
}

// ── 3. Expense Categorizer ───────────────────────────────────────────
export const categorizeExpenses = async (req, res) => {
    const { items } = req.body;

    if (!items || !items.length) return res.status(400).json({ message: 'Items are required' });

    try {
        const itemList = items.map((item, i) => `${i + 1}. ${item.itemName} - Amount: ${item.unitPrice * item.quantity}`).join('\n');

        const prompt = `
Categorize each of these invoice items into standard business expense categories:
${itemList}

Available categories: Software & Tools, Professional Services, Marketing & Advertising, Office Supplies, Travel & Transport, Food & Entertainment, Utilities, Hardware & Equipment, Consulting, Design & Creative, Development, Other

Return a valid JSON array of objects, where each object has keys: "itemName", "category", "confidence", "reason".`;

        const raw = await callGemini(prompt, true);
        const categories = JSON.parse(raw.trim());

        res.status(200).json({ categories });
    } catch (err) {
        console.error('Categorizer AI error:', err);
        res.status(500).json({ message: 'Could not categorize items. Please try again.' });
    }
}