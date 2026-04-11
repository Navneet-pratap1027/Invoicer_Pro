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

const Invoice = () => {
    const location = useLocation();
    const history = useHistory();
    const dispatch = useDispatch();
    const { id } = useParams();

    const [invoiceData, setInvoiceData] = useState(initialState);
    const [rates, setRates] = useState(0);
    const [vat, setVat] = useState(0);
    const [currency, setCurrency] = useState(currencies[0].value);
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

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API}/invoices/count?searchQuery=${user?.result?._id}`);
                setInvoiceData(prev => ({ ...prev, invoiceNumber: (Number(res.data) + 1).toString().padStart(3, '0') }));
            } catch (e) { console.error(e); }
        };
        fetchCount();
    }, [location]);

    useEffect(() => { if (id) dispatch(getInvoice(id)); }, [id]);
    useEffect(() => { dispatch(getClientsByUser({ search: user?.result._id || user?.result?.googleId })); }, [dispatch]);

    useEffect(() => {
        if (invoice) {
            setInvoiceData(invoice);
            setRates(invoice.rates);
            setClient(invoice.client);
            setType(invoice.type);
            setStatus(invoice.status);
            setSelectedDate(invoice.dueDate);
        }
    }, [invoice]);

    useEffect(() => { setStatus(type === 'Receipt' ? 'Paid' : 'Unpaid'); }, [type]);

    useEffect(() => {
        const sub = invoiceData.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice - (item.quantity * item.unitPrice * item.discount / 100)), 0);
        setSubTotal(sub);
        setVat((rates / 100) * sub);
        setTotal(sub + ((rates / 100) * sub));
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
        <div className={styles.pageContainer}>
            <form onSubmit={handleSubmit} className={styles.invoiceLayout}>
                <AddClient setOpen={setOpen} open={open} />

                {/* Left Section: Main Form */}
                <div className={styles.formCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <InvoiceType type={type} setType={setType} />
                        <div style={{ textAlign: 'right' }}>
                            <Typography className={styles.sectionTitle}>Invoice Number</Typography>
                            <InputBase
                                className={styles.invoiceNumberInput}
                                value={invoiceData.invoiceNumber}
                                onChange={(e) => setInvoiceData({ ...invoiceData, invoiceNumber: e.target.value })}
                            />
                        </div>
                    </div>

                    <Divider style={{ margin: '30px 0', backgroundColor: 'rgba(255,255,255,0.05)' }} />

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

                    <div className={styles.sectionTitle} style={{ marginTop: '40px' }}>Items</div>
                    <div className={styles.itemHeader} style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 1fr 1fr 0.5fr', gap: '15px', color: '#9898b0', fontSize: '0.75rem' }}>
                        <span>DESCRIPTION</span>
                        <span>QTY</span>
                        <span>PRICE</span>
                        <span>DISC%</span>
                        <span>AMOUNT</span>
                        <span></span>
                    </div>

                    {invoiceData.items.map((item, index) => (
                        <div key={index} className={styles.itemRow}>
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

                {/* Right Section: Sticky Summary */}
                <div className={styles.sidePanel}>
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