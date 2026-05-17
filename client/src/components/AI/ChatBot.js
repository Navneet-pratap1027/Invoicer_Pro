import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import styles from './AI.module.css'

const SUGGESTIONS = [
    'How many invoices are overdue?',
    'What is my total revenue this month?',
    'How do I write a professional invoice?',
    'Tips to get clients to pay faster?',
]

const ChatBot = ({ invoiceContext }) => {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            text: `👋 Hi! I'm your InvoicerPro AI Assistant powered by Gemini.\n\nI can see you have **${invoiceContext.totalInvoices} invoices** with **${invoiceContext.overdueCount} overdue**. How can I help you today?`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const bottomRef = useRef(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const sendMessage = async (text) => {
        const userText = text || input.trim()
        if (!userText || loading) return

        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        setMessages(prev => [...prev, { role: 'user', text: userText, time }])
        setInput('')
        setLoading(true)

        try {
            const { data } = await axios.post(
                `${process.env.REACT_APP_API}/ai/chat`,
                { message: userText, invoiceContext },
                { headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('profile'))?.token}` } }
            )
            setMessages(prev => [...prev, {
                role: 'assistant',
                text: data.reply,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }])
        } catch {
            setMessages(prev => [...prev, {
                role: 'assistant',
                text: '⚠️ Sorry, I could not connect to AI. Please check your API key or try again.',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                error: true,
            }])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.chatWrap}>
            {/* Messages */}
            <div className={styles.messages}>
                {messages.map((msg, i) => (
                    <div key={i} className={`${styles.msgRow} ${msg.role === 'user' ? styles.msgUser : styles.msgBot}`}>
                        {msg.role === 'assistant' && (
                            <div className={styles.avatar}>🤖</div>
                        )}
                        <div className={`${styles.bubble} ${msg.error ? styles.bubbleError : ''}`}>
                            <p className={styles.bubbleText}>{msg.text}</p>
                            <span className={styles.bubbleTime}>{msg.time}</span>
                        </div>
                        {msg.role === 'user' && (
                            <div className={`${styles.avatar} ${styles.avatarUser}`}>👤</div>
                        )}
                    </div>
                ))}

                {loading && (
                    <div className={`${styles.msgRow} ${styles.msgBot}`}>
                        <div className={styles.avatar}>🤖</div>
                        <div className={styles.bubble}>
                            <div className={styles.typing}>
                                <span /><span /><span />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Suggestions */}
            {messages.length <= 1 && (
                <div className={styles.suggestions}>
                    {SUGGESTIONS.map((s, i) => (
                        <button key={i} className={styles.suggestion} onClick={() => sendMessage(s)}>
                            {s}
                        </button>
                    ))}
                </div>
            )}

            {/* Input */}
            <div className={styles.inputRow}>
                <input
                    className={styles.chatInput}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Ask me anything about your invoices..."
                    disabled={loading}
                />
                <button
                    className={styles.sendBtn}
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || loading}
                >
                    {loading ? '...' : '➤'}
                </button>
            </div>
        </div>
    )
}

export default ChatBot