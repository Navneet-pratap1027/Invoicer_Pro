import React, { useState, useEffect } from 'react'
import { useSnackbar } from 'react-simple-snackbar'
import { useLocation, useParams, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { initialState } from '../../initialState'
import { getInvoice } from '../../actions/invoiceActions'
import { toCommas } from '../../utils/utils'
import styles from './InvoiceDetails.module.css'
import moment from 'moment'

import BorderColorIcon from '@material-ui/icons/BorderColor'
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn'
import { Grid, Divider } from '@material-ui/core'
import Spinner from '../Spinner/Spinner'
import axios from 'axios'
import { saveAs } from 'file-saver'
import Modal from '../Payments/Modal'
import PaymentHistory from './PaymentHistory'

const InvoiceDetails = () => {
    const location = useLocation()
    const history = useHistory()
    const dispatch = useDispatch()
    const { id } = useParams()
    const { invoice } = useSelector((state) => state.invoices)
    const user = JSON.parse(localStorage.getItem('profile'))
    const [openSnackbar] = useSnackbar()

    const [invoiceData, setInvoiceData] = useState(initialState)
    const [rates, setRates] = useState(0)
    const [vat, setVat] = useState(0)
    const [currency, setCurrency] = useState('')
    const [subTotal, setSubTotal] = useState(0)
    const [total, setTotal] = useState(0)
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [client, setClient] = useState([])
    const [type, setType] = useState('')
    const [status, setStatus] = useState('')
    const [company, setCompany] = useState({})
    const [sendStatus, setSendStatus] = useState('idle')       // idle | loading | success | error
    const [downloadStatus, setDownloadStatus] = useState('idle') // idle | loading | success | error
    const [open, setOpen] = useState(false)

    useEffect(() => {
        dispatch(getInvoice(id))
    }, [id, dispatch, location])

    useEffect(() => {
        if (invoice) {
            setInvoiceData(invoice)
            setRates(invoice.rates)
            setClient(invoice.client)
            setType(invoice.type)
            setStatus(invoice.status)
            setSelectedDate(invoice.dueDate)
            setVat(invoice.vat)
            setCurrency(invoice.currency)
            setSubTotal(invoice.subTotal)
            setTotal(invoice.total)
            setCompany(invoice?.businessDetails?.data?.data)
        }
    }, [invoice])

    let totalAmountReceived = 0
    for (var i = 0; i < invoice?.paymentRecords?.length; i++) {
        totalAmountReceived += Number(invoice?.paymentRecords[i]?.amountPaid)
    }

    const editInvoice = (id) => history.push(`/edit/invoice/${id}`)

    const createAndDownloadPdf = () => {
        if (downloadStatus === 'loading') return
        setDownloadStatus('loading')
        axios.post(`${process.env.REACT_APP_API}/create-pdf`, {
            ...invoice,
            totalAmountReceived: toCommas(totalAmountReceived),
            balanceDue: toCommas(total - totalAmountReceived),
            company: company
        })
        .then(() => axios.get(`${process.env.REACT_APP_API}/fetch-pdf`, { responseType: 'blob' }))
        .then((res) => {
            saveAs(new Blob([res.data], { type: 'application/pdf' }), 'invoice.pdf')
            setDownloadStatus('success')
            setTimeout(() => setDownloadStatus('idle'), 3000)
        })
        .catch(() => {
            setDownloadStatus('error')
            setTimeout(() => setDownloadStatus('idle'), 3000)
        })
    }

    const sendPdf = (e) => {
        e.preventDefault()
        if (sendStatus === 'loading') return
        setSendStatus('loading')
        axios.post(`${process.env.REACT_APP_API}/send-pdf`, {
            ...invoice,
            link: `${process.env.REACT_APP_URL}/invoice/${invoice._id}`,
            company: company,
            totalAmountReceived: toCommas(totalAmountReceived),
            balanceDue: toCommas(total - totalAmountReceived)
        })
        .then(() => {
            setSendStatus('success')
            openSnackbar('Invoice sent successfully')
            setTimeout(() => setSendStatus('idle'), 3000)
        })
        .catch(() => {
            setSendStatus('error')
            setTimeout(() => setSendStatus('idle'), 3000)
        })
    }

    if (!invoice) return <Spinner />

    // Button label helpers
    const downloadLabel = {
        idle: 'Download PDF',
        loading: 'Generating...',
        success: '✓ Downloaded',
        error: '✗ Failed'
    }[downloadStatus]

    const sendLabel = {
        idle: 'Send to Customer',
        loading: 'Sending...',
        success: '✓ Sent!',
        error: '✗ Failed'
    }[sendStatus]

    return (
        <div className={styles.pageContainer}>

            {invoice?.creator?.includes(user?.result?._id || user?.result?.googleId) && (
                <div className={styles.actionBar}>

                    {/* Edit — pushed left via marginRight: auto */}
                    <button
                        className={styles.editBtn}
                        onClick={() => editInvoice(invoiceData._id)}
                    >
                        <BorderColorIcon style={{ fontSize: '15px', marginRight: '6px' }} />
                        Edit
                    </button>

                    {/* Record Payment */}
                    <button
                        className={styles.paymentBtn}
                        onClick={() => setOpen((prev) => !prev)}
                    >
                        <MonetizationOnIcon style={{ fontSize: '15px', marginRight: '6px' }} />
                        Record Payment
                    </button>

                    {/* Download PDF */}
                    <button
                        className={`${styles.secondaryBtn} ${downloadStatus === 'success' ? styles.btnSuccess : ''} ${downloadStatus === 'error' ? styles.btnError : ''}`}
                        onClick={createAndDownloadPdf}
                        disabled={downloadStatus === 'loading'}
                    >
                        {downloadStatus === 'loading' && <span className={styles.spinner} />}
                        {downloadLabel}
                    </button>

                    {/* Send to Customer */}
                    <button
                        className={`${styles.primaryBtn} ${sendStatus === 'success' ? styles.btnSuccess : ''} ${sendStatus === 'error' ? styles.btnError : ''}`}
                        onClick={sendPdf}
                        disabled={sendStatus === 'loading'}
                    >
                        {sendStatus === 'loading' && <span className={styles.spinner} />}
                        {sendLabel}
                    </button>

                </div>
            )}

            {/* Main Invoice Card */}
            <div className={styles.invoiceCard}>

                <div className={styles.invoiceHeader}>
                    <div>
                        <div onClick={() => history.push('/settings')} style={{ cursor: 'pointer', marginBottom: '10px' }}>
                            {company?.logo
                                ? <img src={company?.logo} alt="Logo" style={{ maxHeight: '60px' }} />
                                : <h2 className={styles.invoiceTitle}>{company?.businessName || 'Set Business Name'}</h2>
                            }
                        </div>
                        <p className={styles.invoiceNumber}>Invoice NO: {invoiceData?.invoiceNumber}</p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                        <div className={`${styles.statusBadge} ${totalAmountReceived >= total ? styles.statusPaid : styles.statusUnpaid}`}>
                            {totalAmountReceived >= total ? 'PAID' : status.toUpperCase()}
                        </div>
                        <h1 style={{ color: '#e8e8f0', margin: '15px 0 5px 0' }}>{type.toUpperCase()}</h1>
                        <p className={styles.sectionLabel}>Balance Due: {currency} {toCommas(total - totalAmountReceived)}</p>
                    </div>
                </div>

                <Divider style={{ backgroundColor: 'rgba(255,255,255,0.06)', margin: '30px 0' }} />

                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <div style={{ marginBottom: '25px' }}>
                            <p className={styles.sectionLabel}>From</p>
                            <p className={styles.sectionValue}>{company?.businessName || 'Update Profile in Settings'}</p>
                            <p style={{ color: '#9898b0', fontSize: '0.9rem' }}>{company?.email}</p>
                            <p style={{ color: '#9898b0', fontSize: '0.9rem' }}>{company?.phoneNumber}</p>
                        </div>
                        <div>
                            <p className={styles.sectionLabel}>Bill To</p>
                            <p className={styles.sectionValue}>{client?.name}</p>
                            <p style={{ color: '#9898b0', fontSize: '0.9rem' }}>{client?.email}</p>
                            <p style={{ color: '#9898b0', fontSize: '0.9rem' }}>{client?.address}</p>
                        </div>
                    </Grid>

                    <Grid item xs={12} md={6} style={{ textAlign: 'right' }}>
                        <p className={styles.sectionLabel}>Date Issued</p>
                        <p className={styles.sectionValue}>{moment(invoice?.createdAt).format('DD MMM YYYY')}</p>
                        <br />
                        <p className={styles.sectionLabel}>Due Date</p>
                        <p className={styles.sectionValue}>{moment(selectedDate).format('DD MMM YYYY')}</p>
                    </Grid>
                </Grid>

                <table className={styles.itemsTable}>
                    <thead>
                        <tr>
                            <th>Item Description</th>
                            <th style={{ textAlign: 'right' }}>Qty</th>
                            <th style={{ textAlign: 'right' }}>Price</th>
                            <th style={{ textAlign: 'right' }}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoiceData?.items?.map((item, index) => (
                            <tr key={index}>
                                <td>{item.itemName}</td>
                                <td style={{ textAlign: 'right' }}>{item.quantity}</td>
                                <td style={{ textAlign: 'right' }}>{toCommas(item.unitPrice)}</td>
                                <td style={{ textAlign: 'right' }}>{toCommas((item.quantity * item.unitPrice) - (item.quantity * item.unitPrice * item.discount / 100))}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className={styles.totalsSection}>
                    <div className={styles.totalRow}>
                        <span>Subtotal:</span>
                        <span style={{ color: '#e8e8f0' }}>{toCommas(subTotal)}</span>
                    </div>
                    <div className={styles.totalRow}>
                        <span>VAT ({rates}%):</span>
                        <span style={{ color: '#e8e8f0' }}>{toCommas(vat)}</span>
                    </div>
                    <div className={styles.grandTotal}>
                        <span>Total ({currency}):</span>
                        <span style={{ color: '#22c55e' }}>{currency} {toCommas(total)}</span>
                    </div>
                </div>
            </div>

            {invoice?.paymentRecords.length !== 0 && (
                <div style={{ marginTop: '30px' }}>
                    <PaymentHistory paymentRecords={invoiceData?.paymentRecords} />
                </div>
            )}

            <Modal open={open} setOpen={setOpen} invoice={invoice} />
        </div>
    )
}

export default InvoiceDetails