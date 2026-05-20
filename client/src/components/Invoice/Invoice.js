/* eslint-disable */
import React, { useState, useEffect } from 'react';
import styles from './Invoice.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import moment from 'moment';
import { toCommas } from '../../utils/utils';

// MUI Core
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DeleteOutlineRoundedIcon from '@material-ui/icons/DeleteOutlineRounded';
import SaveIcon from '@material-ui/icons/Save';

// Project Files
import { initialState } from '../../initialState';
import currencies from '../../currencies.json';
import { createInvoice, getInvoice, updateInvoice } from '../../actions/invoiceActions';
import { getClientsByUser } from '../../actions/clientActions';
import AddClient from './AddClient';
import InvoiceType from './InvoiceType';
import axios from 'axios';

const FRONT_PAGE_GUIDE = [
    { icon: '👤', title: '1. Add Customer', desc: 'Select an existing profile or create a new customer with their legal billing name, email, and address parameters.' },
    { icon: '📝', title: '2. Compile Invoice', desc: 'Populate the items matrix with precise item descriptions, accurate transaction quantities, and unit base rates.' },
    { icon: '💰', title: '3. Configure Rates', desc: 'Utilize the side options to select localized dynamic billing currencies and add global transaction tax percentages.' },
    { icon: '📧', title: '4. Save & Dispatch', desc: 'Save to compile payload structures, render automated pixel-perfect PDFs, and initiate direct automated email delivery.' },
]

const Invoice = () => {
    const location = useLocation();
    const history = useHistory();
    const dispatch = useDispatch();
    const { id } = useParams();

    const [invoiceData, setInvoiceData] = useState(initialState);
    const [rates, setRates] = useState(0);
    const [vat, setVat] = useState(0);
    const [currency, setCurrency] = useState(currencies.find(c => c.value === 'INR')?.value || 'INR');
    const [subTotal, setSubTotal] = useState(0);
    const [total, setTotal] = useState(0);
    const [selectedDate, setSelectedDate] = useState(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);
    const [client, setClient] = useState(null);
    const [type, setType] = useState('Invoice');
    const [status, setStatus] = useState('Unpaid');
    const [open, setOpen] = useState(false);

    const user = JSON.parse(localStorage.getItem('profile'));
    const clients = useSelector((state) => state.clients.clients);
    const { invoice } = useSelector((state) => state.invoices);

    // ✅ BACK TO PROFESSIONAL SERIAL DIGITS FORMAT WITH BACKEND COUNTER
    useEffect(() => {
        const fetchCount = async () => {
            try {
                const res = await axios.get(
                    `${process.env.REACT_APP_API}/invoices/count?searchQuery=${user?.result?._id}`,
                    { headers: { Authorization: `Bearer ${user?.token}` } }
                );
                const count = Number(res.data) + 1;
                // Strict 6-digit continuous serial order (e.g., 000125) — easily visible and stays in boundary
                const invoiceNumber = String(count).padStart(6, '0');
                setInvoiceData(prev => ({ ...prev, invoiceNumber }));
            } catch (e) { console.error(e); }
        };
        if (!id) fetchCount();
    }, [location, id]);

    useEffect(() => { if (id) dispatch(getInvoice(id)); }, [id]);
    useEffect(() => {
        dispatch(getClientsByUser({ search: user?.result._id || user?.result?.googleId }));
    }, [dispatch]);

    useEffect(() => {
        if (invoice) {
            setInvoiceData(invoice);
            setRates(invoice.rates);
            setClient(invoice.client);
            setType(invoice.type);
            setStatus(invoice.status);
            setSelectedDate(invoice.dueDate);
            if (invoice.currency) setCurrency(invoice.currency);
        }
    }, [invoice]);

    useEffect(() => { setStatus(type === 'Receipt' ? 'Paid' : 'Unpaid'); }, [type]);

    useEffect(() => {
        const sub = invoiceData.items.reduce((acc, item) =>
            acc + (Number(item.quantity) * Number(item.unitPrice) -
            (Number(item.quantity) * Number(item.unitPrice) * Number(item.discount) / 100)), 0
        );
        const calculatedVat = (Number(rates) / 100) * sub;
        const finalTotal = sub + calculatedVat;
        setSubTotal(sub.toFixed(2));
        setVat(calculatedVat.toFixed(2));
        setTotal(finalTotal.toFixed(2));
    }, [invoiceData, rates]);

    const handleChange = (index, e) => {
        const values = [...invoiceData.items];
        values[index][e.target.name] = e.target.value;
        setInvoiceData({ ...invoiceData, items: values });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = { ...invoiceData, subTotal, total, vat, rates, currency, dueDate: selectedDate, client, type, status };
        if (invoice) {
            dispatch(updateInvoice(invoice._id, data));
            history.push(`/invoice/${invoice._id}`);
        } else {
            dispatch(createInvoice({ ...data, creator: [user?.result?._id] }, history));
        }
    };

    if (!user) { history.push('/login'); return null; }

    return (
        // ✅ COMPACT MAIN LAYOUT CONTAINER SIZE REDUCED TO 1100PX FOR PERFECT GRIP
        <div className={styles.pageContainer} style={{ padding: '10px 24px 24px 24px', maxWidth: '1100px', margin: '0 auto' }}>

            {/* ── HEADER GUIDE CONTAINER (NORMAL SIZE CARDS) ── */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(124,106,247,0.1), rgba(25,118,210,0.05))',
                border: '1px solid rgba(124,106,247,0.2)',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '35px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <Typography style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', letterSpacing: '0.4px' }}>
                        InvoicerPro — Professional Billing SaaS Platform
                    </Typography>
                    <span style={{
                        background: 'rgba(124,106,247,0.15)', color: '#a5b4fc',
                        fontSize: '0.72rem', fontWeight: 600, padding: '3px 12px',
                        borderRadius: '20px', border: '1px solid rgba(124,106,247,0.3)',
                    }}>
                        Platform Guide
                    </span>
                </div>
                
                <Typography style={{ fontSize: '0.88rem', color: '#94a3b8', marginBottom: '22px', lineHeight: '1.5', maxWidth: '800px', textAlign: 'center' }}>
                    An automated system designed to streamline customer tracking, calculate advanced discount models/tax matrices, compile structured layout files, and handle pixel-perfect PDF invoice generation and instant email deliveries.
                </Typography>

                {/* CARDS STRUCTURAL VIEW - STAYS NORMAL SIZE */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '20px',
                    justifyContent: 'center', 
                    alignItems: 'center',
                    width: '100%',
                }}>
                    {FRONT_PAGE_GUIDE.map((step, i) => (
                        <div key={i} style={{
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: '12px',
                            padding: '18px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                            width: '220px',
                            minHeight: '160px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                            boxSizing: 'border-box'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '1.4rem', background: 'rgba(124,106,247,0.1)', padding: '6px', borderRadius: '10px' }}>
                                    {step.icon}
                                </span>
                                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>
                                    {step.title}
                                </div>
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: '1.45', textAlign: 'left' }}>
                                {step.desc}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── INVOICE CREATE FORM (COMPACT PANELS WITH CONTROLLED GAPS) ── */}
            <form onSubmit={handleSubmit} className={styles.invoiceLayout} style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                
                {/* Left Section Card (Size Optimized) */}
                <div className={styles.formCard} style={{ flex: '1.7', display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <InvoiceType type={type} setType={setType} />
                        
                        {/* ✅ EXTRA WIDTH + LEFT ALIGNED INPUT FIELD: FULL DIGIT ACCURATE VISIBILITY */}
                        <div style={{ textAlign: 'left', minWidth: '220px' }}>
                            <Typography className={styles.sectionTitle} style={{ marginBottom: '6px', textAlign: 'left' }}>
                                INVOICE NUMBER
                            </Typography>
                            <InputBase
                                className={styles.invoiceNumberInput}
                                value={invoiceData.invoiceNumber}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                    setInvoiceData({ ...invoiceData, invoiceNumber: val });
                                }}
                                style={{ 
                                    color: 'white', 
                                    width: '100%', 
                                    fontSize: '1.3rem', 
                                    fontWeight: '800',
                                    letterSpacing: '1.5px',
                                    backgroundColor: 'rgba(255,255,255,0.02)',
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    border: '1px dashed rgba(255,255,255,0.1)',
                                    textAlign: 'left'
                                }}
                                inputProps={{ 
                                    maxLength: 10, 
                                    pattern: '[0-9]*',
                                    style: { textAlign: 'left' }
                                }}
                            />
                        </div>
                    </div>

                    <Divider style={{ margin: '25px 0', backgroundColor: 'rgba(255,255,255,0.05)' }} />

                    <div className={styles.sectionTitle}>Bill To</div>
                    {client ? (
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px' }}>
                            <Typography variant="h6" style={{ color: 'white' }}>{client.name}</Typography>
                            <Typography variant="body2" style={{ color: '#9898b0' }}>{client.email}</Typography>
                            <Button size="small" style={{ color: '#7c6af7', textTransform: 'none', marginTop: '10px' }} onClick={() => setClient(null)}>Change Client</Button>
                        </div>
                    ) : (
                        <Autocomplete
                            options={clients || []}
                            getOptionLabel={(option) => option.name}
                            renderInput={(params) => <TextField {...params} label="Search Client" variant="outlined" />}
                            onChange={(e, v) => setClient(v)}
                        />
                    )}

                    <div className={styles.sectionTitle} style={{ marginTop: '35px' }}>Items</div>
                    <div className={styles.itemHeader} style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 1fr 1fr 0.5fr', gap: '15px', color: '#9898b0', fontSize: '0.75rem' }}>
                        <span>DESCRIPTION</span>
                        <span>QTY</span>
                        <span>PRICE</span>
                        <span>DISC%</span>
                        <span>AMOUNT</span>
                        <span></span>
                    </div>

                    {invoiceData.items.map((item, index) => (
                        <div key={index} className={styles.itemRow} style={{ marginBottom: '10px' }}>
                            <InputBase style={{ color: 'white' }} name="itemName" value={item.itemName} onChange={e => handleChange(index, e)} placeholder="Item name" />
                            <InputBase style={{ color: 'white' }} type="number" name="quantity" value={item.quantity} onChange={e => handleChange(index, e)} />
                            <InputBase style={{ color: 'white' }} type="number" name="unitPrice" value={item.unitPrice} onChange={e => handleChange(index, e)} />
                            <InputBase style={{ color: 'white' }} type="number" name="discount" value={item.discount} onChange={e => handleChange(index, e)} />
                            <span style={{ color: 'white', fontWeight: 'bold' }}>{toCommas(item.quantity * item.unitPrice - (item.quantity * item.unitPrice * item.discount / 100))}</span>
                            <IconButton onClick={() => {
                                const values = [...invoiceData.items];
                                values.splice(index, 1);
                                setInvoiceData({ ...invoiceData, items: values });
                            }} style={{ color: '#ff4d4d' }}>
                                <DeleteOutlineRoundedIcon fontSize="small" />
                            </IconButton>
                        </div>
                    ))}

                    <Button className={styles.addItemBtn} onClick={() => setInvoiceData({ ...invoiceData, items: [...invoiceData.items, { itemName: '', unitPrice: '', quantity: '', discount: '', amount: '' }] })}>
                        + Add Line Item
                    </Button>
                </div>

                {/* Right Side Panel Card (Size Optimized) */}
                <div className={styles.sidePanel} style={{ flex: '0.9', display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px' }}>
                    <Typography className={styles.sectionTitle}>Summary</Typography>
                    <div className={styles.totalRow}>
                        <span>Subtotal</span>
                        <span>{toCommas(subTotal)}</span>
                    </div>
                    <div className={styles.totalRow}>
                        <span>Tax ({rates}%)</span>
                        <span>{toCommas(vat)}</span>
                    </div>
                    <div className={styles.totalRowBold}>
                        <span>Total</span>
                        <span style={{ color: '#7c6af7' }}>{currency} {toCommas(total)}</span>
                    </div>

                    <div className={styles.sectionTitle} style={{ marginTop: '30px' }}>Invoice Settings</div>

                    <Autocomplete
                        options={currencies || []}
                        getOptionLabel={(option) => `${option.label} (${option.value})`}
                        value={currencies.find(c => c.value === currency) || null}
                        onChange={(event, newValue) => { if (newValue) setCurrency(newValue.value); }}
                        renderInput={(params) => <TextField {...params} label="Currency" variant="outlined" />}
                        style={{ marginBottom: '20px' }}
                    />

                    <TextField
                        fullWidth
                        label="Tax Rate (%)"
                        type="number"
                        variant="outlined"
                        value={rates}
                        onChange={(e) => setRates(e.target.value)}
                        style={{ marginBottom: '20px' }}
                    />

                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            fullWidth
                            inputVariant="outlined"
                            label="Due Date"
                            format="MM/dd/yyyy"
                            value={selectedDate}
                            onChange={setSelectedDate}
                        />
                    </MuiPickersUtilsProvider>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        style={{ backgroundColor: '#7c6af7', color: 'white', marginTop: '30px', padding: '12px', borderRadius: '12px', fontWeight: 'bold' }}
                        startIcon={<SaveIcon />}
                    >
                        Save Invoice
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Invoice;