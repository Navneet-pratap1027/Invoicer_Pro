import React, { useState } from 'react'
import axios from 'axios'
import moment from 'moment'
import styles from './AI.module.css'

const PaymentReminder = ({ invoices }) => {
    const [selected, setSelected] = useState('')
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)

    // Only unpaid invoices
    const unpaid = (invoices || []).filter(inv => inv.status !== 'Paid')

    const selectedInvoice = unpaid.find(inv => inv._id === selected)
    const daysOverdue = selectedInvoice
        ? Math.max(0, moment().diff(moment(selectedInvoice.dueDate), 'days'))
        : 0

    const generate = async () => {
        if (!selectedInvoice) return
        setLoading(true)
        setResult(null)
        try {
            const { data } = await axios.post(
                `${process.env.REACT_APP_API}/ai/payment-reminder`,
                {
                    clientName: selectedInvoice.client?.name,
                    clientEmail: selectedInvoice.client?.email,
                    invoiceNumber: selectedInvoice.invoiceNumber,
                    amount: selectedInvoice.total,
                    currency: selectedInvoice.currency,
                    dueDate: moment(selectedInvoice.dueDate).format('DD MMM YYYY'),
                    daysOverdue,
                    businessName: selectedInvoice.businessDetails?.data?.data?.businessName || 'Our Business',
                },
                { headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('profile'))?.token}` } }
            )
            setResult(data)
        } catch {
            setResult({ error: 'Failed to generate reminder. Please try again.' })
        } finally {
            setLoading(false)
        }
    }

    const copy = (text) => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className={styles.sectionWrap}>
            <div className={styles.sectionCard}>
                <h3 className={styles.sectionTitle}>🔔 Generate Payment Reminder</h3>
                <p className={styles.sectionSub}>Select an unpaid invoice and AI will write a professional reminder email</p>

                {/* Invoice selector */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>Select Unpaid Invoice</label>
                    <select
                        className={styles.select}
                        value={selected}
                        onChange={e => { setSelected(e.target.value); setResult(null) }}
                    >
                        <option value="">-- Choose invoice --</option>
                        {unpaid.map(inv => (
                            <option key={inv._id} value={inv._id}>
                                #{inv.invoiceNumber} — {inv.client?.name} — {inv.currency}{inv.total?.toLocaleString()}
                                {moment().isAfter(inv.dueDate) ? ` (${moment().diff(moment(inv.dueDate), 'days')}d overdue)` : ''}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Selected invoice info */}
                {selectedInvoice && (
                    <div className={styles.invoicePreview}>
                        <div className={styles.previewRow}>
                            <span>Client</span>
                            <strong>{selectedInvoice.client?.name}</strong>
                        </div>
                        <div className={styles.previewRow}>
                            <span>Amount</span>
                            <strong style={{ color: '#ef4444' }}>
                                {selectedInvoice.currency}{selectedInvoice.total?.toLocaleString()}
                            </strong>
                        </div>
                        <div className={styles.previewRow}>
                            <span>Due Date</span>
                            <strong>{moment(selectedInvoice.dueDate).format('DD MMM YYYY')}</strong>
                        </div>
                        {daysOverdue > 0 && (
                            <div className={styles.overdueBadge}>
                                ⚠️ {daysOverdue} days overdue
                            </div>
                        )}
                    </div>
                )}

                <button
                    className={styles.generateBtn}
                    onClick={generate}
                    disabled={!selected || loading}
                >
                    {loading ? (
                        <><span className={styles.btnSpinner} /> Generating with AI...</>
                    ) : '✨ Generate Reminder Email'}
                </button>
            </div>

            {/* Result */}
            {result && !result.error && (
                <div className={styles.resultCard}>
                    <div className={styles.resultHeader}>
                        <h4>📧 Generated Email</h4>
                        <button className={styles.copyBtn} onClick={() => copy(`Subject: ${result.subject}\n\n${result.emailBody}`)}>
                            {copied ? '✓ Copied!' : 'Copy All'}
                        </button>
                    </div>
                    <div className={styles.emailSubject}>
                        <span className={styles.emailLabel}>Subject:</span>
                        <span>{result.subject}</span>
                    </div>
                    <div className={styles.emailBody}>
                        <pre>{result.emailBody}</pre>
                    </div>
                </div>
            )}

            {result?.error && (
                <div className={styles.errorBox}>{result.error}</div>
            )}

            {unpaid.length === 0 && (
                <div className={styles.emptyState}>
                    🎉 All invoices are paid! No reminders needed.
                </div>
            )}
        </div>
    )
}

export default PaymentReminder