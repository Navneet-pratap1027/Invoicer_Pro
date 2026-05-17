import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import styles from './AI.module.css'
import ChatBot from './ChatBot'
import PaymentReminder from './PaymentReminder'
import ExpenseCategorizer from './ExpenseCategorizer'

const tabs = [
    { id: 'chat', label: '💬 AI Chat', desc: 'Ask anything about your invoices' },
    { id: 'reminder', label: '🔔 Payment Reminder', desc: 'Generate reminder emails instantly' },
    { id: 'categorize', label: '🏷️ Expense Categorizer', desc: 'Auto-categorize invoice items' },
]

const AIAssistant = () => {
    const [activeTab, setActiveTab] = useState('chat')
    
    // Safely retrieve invoices from the active Redux slice state
    const { invoices } = useSelector((state) => state.invoices)

    // Build invoice context using lowercase checks to protect against string mismatches
    const invoiceContext = {
        totalInvoices: invoices?.length || 0,
        totalRevenue: invoices?.reduce((sum, inv) => sum + (Number(inv.total) || 0), 0) || 0,
        unpaidCount: invoices?.filter(inv => inv.status?.toLowerCase() !== 'paid').length || 0,
        overdueCount: invoices?.filter(inv => {
            const isUnpaid = inv.status?.toLowerCase() !== 'paid';
            const isOverdue = inv.dueDate ? new Date(inv.dueDate) < new Date() : false;
            return isUnpaid && isOverdue;
        }).length || 0,
        currency: invoices?.[0]?.currency || '₹',
    }

    return (
        <div className={styles.pageContainer}>
            {/* Header */}
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>
                        <span className={styles.aiBadge}>AI</span>
                        AI Assistant
                    </h1>
                    <p className={styles.pageSubtitle}>
                        Powered by Google Gemini · Your smart invoicing companion
                    </p>
                </div>

                {/* Stats */}
                <div className={styles.statsRow}>
                    <div className={styles.statChip}>
                        <span className={styles.statNum}>{invoiceContext.totalInvoices}</span>
                        <span className={styles.statLabel}>Invoices</span>
                    </div>
                    <div className={styles.statChip}>
                        <span className={styles.statNum} style={{ color: '#22c55e' }}>
                            {invoiceContext.currency}{invoiceContext.totalRevenue.toLocaleString()}
                        </span>
                        <span className={styles.statLabel}>Revenue</span>
                    </div>
                    <div className={styles.statChip}>
                        <span className={styles.statNum} style={{ color: '#ef4444' }}>
                            {invoiceContext.overdueCount}
                        </span>
                        <span className={styles.statLabel}>Overdue</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className={styles.tabBar}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <span className={styles.tabLabel}>{tab.label}</span>
                        <span className={styles.tabDesc}>{tab.desc}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className={styles.tabContent}>
                {activeTab === 'chat' && <ChatBot invoiceContext={invoiceContext} />}
                {activeTab === 'reminder' && <PaymentReminder invoices={invoices} />}
                {activeTab === 'categorize' && <ExpenseCategorizer invoices={invoices} />}
            </div>
        </div>
    )
}

export default AIAssistant