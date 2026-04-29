import React, { useState, useEffect } from 'react'
import { useSnackbar } from 'react-simple-snackbar'
import { useLocation, useParams, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { initialState } from '../../initialState'
import { getInvoice } from '../../actions/invoiceActions'
import { toCommas } from '../../utils/utils'
import styles from './InvoiceDetails.module.css'
import moment from 'moment'

// MUI Icons
import BorderColorIcon from '@material-ui/icons/BorderColor';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';

import { Grid, Divider } from '@material-ui/core';
import Spinner from '../Spinner/Spinner'
import ProgressButton from 'react-progress-button'
import axios from 'axios';
import { saveAs } from 'file-saver';
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
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [client, setClient] = useState([])
    const [type, setType] = useState('')
    const [status, setStatus] = useState('')
    const [company, setCompany] = useState({})
    const [sendStatus, setSendStatus] = useState(null)
    const [downloadStatus, setDownloadStatus] = useState(null)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        dispatch(getInvoice(id));
    }, [id, dispatch, location]);

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
        })
    }

    const sendPdf = (e) => {
        e.preventDefault()
        setSendStatus('loading')
        axios.post(`${process.env.REACT_APP_API}/send-pdf`, { 
            ...invoice,
            link: `${process.env.REACT_APP_URL}/invoice/${invoice._id}`,
            company: company,
            totalAmountReceived: toCommas(totalAmountReceived),
            balanceDue: toCommas(total - totalAmountReceived)
        })
        .then(() => setSendStatus('success'))
        .catch(() => setSendStatus('error'))
    }

    if (!invoice) return <Spinner />

    return (
        <div className={styles.pageContainer}>
            
            {/* ✅ ACTION BAR: Proper Grouping & Hierarchy */}
            {invoice?.creator?.includes(user?.result?._id || user?.result?.googleId) && (
                <div className={styles.actionBar}>
                    
                    {/* LEFT SIDE: Minimal Edit Button */}
                    <button 
                        className={styles.statusBadge} 
                        style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.08)', color: '#9898b0', border: 'none', marginRight: 'auto', padding: '8px 15px' }} 
                        onClick={() => editInvoice(invoiceData._id)}
                    > 
                        <BorderColorIcon style={{ fontSize: '16px', marginRight: '5px' }} /> Edit
                    </button>

                    {/* RIGHT SIDE: Grouped Actions */}
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        
                        {/* Tertiary: Record Payment */}
                        <button 
                            className={styles.statusBadge} 
                            style={{ cursor: 'pointer', background: 'transparent', color: '#3b82f6', border: '1px solid #3b82f6', padding: '8px 15px' }} 
                            onClick={() => setOpen((prev) => !prev)}
                        > 
                            <MonetizationOnIcon style={{ fontSize: '16px', marginRight: '5px' }} /> Record Payment
                        </button>

                        {/* Secondary: Download PDF */}
                        <div className={styles.secondaryBtn}>
                            <ProgressButton onClick={createAndDownloadPdf} state={downloadStatus}>
                                Download PDF
                            </ProgressButton>
                        </div>

                        {/* Primary: Send to Customer (Solid Blue) */}
                        <div className={styles.primaryBtn}>
                            <ProgressButton onClick={sendPdf} state={sendStatus} onSuccess={() => openSnackbar("Invoice sent successfully")}>
                                Send to Customer
                            </ProgressButton>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Invoice Card */}
            <div className={styles.invoiceCard}>
                
                {/* Header Section */}
                <div className={styles.invoiceHeader}>
                    <div>
                        <div onClick={() => history.push('/settings')} style={{ cursor: 'pointer', marginBottom: '10px' }}>
                            {company?.logo ? 
                                <img src={company?.logo} alt="Logo" style={{maxHeight: '60px'}} /> 
                                : <h2 className={styles.invoiceTitle}>{company?.businessName || "Set Business Name"}</h2>
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

                {/* Billing Details */}
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <div style={{ marginBottom: '25px' }}>
                            <p className={styles.sectionLabel}>From</p>
                            <p className={styles.sectionValue}>{company?.businessName || "Update Profile in Settings"}</p>
                            <p style={{color: '#9898b0', fontSize: '0.9rem'}}>{company?.email}</p>
                            <p style={{color: '#9898b0', fontSize: '0.9rem'}}>{company?.phoneNumber}</p>
                        </div>
                        <div>
                            <p className={styles.sectionLabel}>Bill To</p>
                            <p className={styles.sectionValue}>{client?.name}</p>
                            <p style={{color: '#9898b0', fontSize: '0.9rem'}}>{client?.email}</p>
                            <p style={{color: '#9898b0', fontSize: '0.9rem'}}>{client?.address}</p>
                        </div>
                    </Grid>
                    
                    <Grid item xs={12} md={6} style={{ textAlign: 'right' }}>
                        <p className={styles.sectionLabel}>Date Issued</p>
                        <p className={styles.sectionValue}>{moment(invoice?.createdAt).format("DD MMM YYYY")}</p>
                        <br />
                        <p className={styles.sectionLabel}>Due Date</p>
                        <p className={styles.sectionValue}>{moment(selectedDate).format("DD MMM YYYY")}</p>
                    </Grid>
                </Grid>

                {/* Items Table */}
                <table className={styles.itemsTable}>
                    <thead>
                        <tr>
                            <th>Item Description</th>
                            <th style={{textAlign: 'right'}}>Qty</th>
                            <th style={{textAlign: 'right'}}>Price</th>
                            <th style={{textAlign: 'right'}}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoiceData?.items?.map((item, index) => (
                            <tr key={index}>
                                <td>{item.itemName}</td>
                                <td style={{textAlign: 'right'}}>{item.quantity}</td>
                                <td style={{textAlign: 'right'}}>{toCommas(item.unitPrice)}</td>
                                <td style={{textAlign: 'right'}}>{toCommas((item.quantity * item.unitPrice) - (item.quantity * item.unitPrice * item.discount / 100))}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Totals Section */}
                <div className={styles.totalsSection}>
                    <div className={styles.totalRow}>
                        <span>Subtotal:</span>
                        <span style={{color: '#e8e8f0'}}>{toCommas(subTotal)}</span>
                    </div>
                    <div className={styles.totalRow}>
                        <span>VAT ({rates}%):</span>
                        <span style={{color: '#e8e8f0'}}>{toCommas(vat)}</span>
                    </div>
                    <div className={styles.grandTotal}>
                        <span>Total ({currency}):</span>
                        <span style={{color: '#22c55e'}}>{currency} {toCommas(total)}</span>
                    </div>
                </div>
            </div>

            {/* Payment History */}
            {invoice?.paymentRecords.length !== 0 && (
                <div style={{marginTop: '30px'}}>
                    <PaymentHistory paymentRecords={invoiceData?.paymentRecords} />
                </div>
            )}
        
            <Modal open={open} setOpen={setOpen} invoice={invoice} />
        </div>
    )
}

export default InvoiceDetails;