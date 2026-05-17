import React, { useState } from 'react'
import axios from 'axios'
import styles from './AI.module.css'

const CATEGORY_COLORS = {
    'Software & Tools': '#6366f1',
    'Professional Services': '#3b82f6',
    'Marketing & Advertising': '#f59e0b',
    'Office Supplies': '#8b5cf6',
    'Travel & Transport': '#14b8a6',
    'Food & Entertainment': '#f97316',
    'Utilities': '#64748b',
    'Hardware & Equipment': '#06b6d4',
    'Consulting': '#3b82f6',
    'Design & Creative': '#ec4899',
    'Development': '#22c55e',
    'Other': '#9ca3af',
}

const ExpenseCategorizer = ({ invoices }) => {
    const [selected, setSelected] = useState('')
    const [results, setResults] = useState(null)
    const [loading, setLoading] = useState(false)

    const selectedInvoice = (invoices || []).find(inv => inv._id === selected)

    const categorize = async () => {
        if (!selectedInvoice?.items?.length) return
        setLoading(true)
        setResults(null)
        try {
            const { data } = await axios.post(
                `${process.env.REACT_APP_API}/ai/categorize`,
                { items: selectedInvoice.items },
                { headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('profile'))?.token}` } }
            )
            setResults(data.categories)
        } catch {
            setResults({ error: 'Failed to categorize. Please try again.' })
        } finally {
            setLoading(false)
        }
    }

    // Group results by category for summary
    const grouped = Array.isArray(results)
        ? results.reduce((acc, item) => {
            acc[item.category] = (acc[item.category] || 0) + 1
            return acc
        }, {})
        : {}

    return (
        <div className={styles.sectionWrap}>
            <div className={styles.sectionCard}>
                <h3 className={styles.sectionTitle}>🏷️ Auto Expense Categorizer</h3>
                <p className={styles.sectionSub}>Select an invoice and AI will automatically categorize all line items</p>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Select Invoice</label>
                    <select
                        className={styles.select}
                        value={selected}
                        onChange={e => { setSelected(e.target.value); setResults(null) }}
                    >
                        <option value="">-- Choose invoice --</option>
                        {(invoices || []).map(inv => (
                            <option key={inv._id} value={inv._id}>
                                #{inv.invoiceNumber} — {inv.client?.name} — {inv.items?.length || 0} items
                            </option>
                        ))}
                    </select>
                </div>

                {/* Items preview */}
                {selectedInvoice?.items?.length > 0 && (
                    <div className={styles.itemsPreview}>
                        <p className={styles.label}>Items to categorize ({selectedInvoice.items.length})</p>
                        {selectedInvoice.items.map((item, i) => (
                            <div key={i} className={styles.previewRow}>
                                <span>{item.itemName}</span>
                                <strong>{selectedInvoice.currency}{(item.quantity * item.unitPrice).toLocaleString()}</strong>
                            </div>
                        ))}
                    </div>
                )}

                <button
                    className={styles.generateBtn}
                    onClick={categorize}
                    disabled={!selected || loading}
                >
                    {loading ? (
                        <><span className={styles.btnSpinner} /> Categorizing with AI...</>
                    ) : '✨ Auto-Categorize Items'}
                </button>
            </div>

            {/* Results */}
            {Array.isArray(results) && (
                <>
                    {/* Summary */}
                    <div className={styles.resultCard}>
                        <h4 className={styles.resultHeader}>📊 Category Summary</h4>
                        <div className={styles.categoryChips}>
                            {Object.entries(grouped).map(([cat, count]) => (
                                <span
                                    key={cat}
                                    className={styles.categoryChip}
                                    style={{ background: CATEGORY_COLORS[cat] || '#6366f1' }}
                                >
                                    {cat} ({count})
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Detailed results */}
                    <div className={styles.resultCard}>
                        <h4 className={styles.resultHeader}>📋 Detailed Results</h4>
                        <div className={styles.categorizedList}>
                            {results.map((item, i) => (
                                <div key={i} className={styles.categorizedItem}>
                                    <div className={styles.catItemLeft}>
                                        <span className={styles.catDot} style={{ background: CATEGORY_COLORS[item.category] || '#6366f1' }} />
                                        <div>
                                            <p className={styles.catItemName}>{item.itemName}</p>
                                            <p className={styles.catItemReason}>{item.reason}</p>
                                        </div>
                                    </div>
                                    <div className={styles.catItemRight}>
                                        <span className={styles.catBadge} style={{ background: `${CATEGORY_COLORS[item.category]}22`, color: CATEGORY_COLORS[item.category] || '#6366f1' }}>
                                            {item.category}
                                        </span>
                                        <span className={`${styles.confidence} ${styles[`conf${item.confidence}`]}`}>
                                            {item.confidence}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {results?.error && <div className={styles.errorBox}>{results.error}</div>}
        </div>
    )
}

export default ExpenseCategorizer