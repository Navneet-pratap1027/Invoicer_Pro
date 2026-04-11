/* eslint-disable */
import React, { useState, useEffect } from 'react';
// ✅ Sahi path: 'core' folder se styles aur components aayenge
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { TextField, Grid } from '@material-ui/core';

// ✅ Icons hamesha 'icons' folder se
import CloseIcon from '@material-ui/icons/Close';

import DatePicker from './DatePicker';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useDispatch } from 'react-redux';
import { updateInvoice } from '../../actions/invoiceActions';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    backgroundColor: '#1976D2',
    marginLeft: 0,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: 'white',
  },
  dialogTitle: {
    paddingLeft: '20px',
    color: 'white',
  },
  inputField: {
    '& .MuiInputBase-root': {
      padding: '0.5rem 0.75rem',
      fontSize: '0.9rem',
      lineHeight: 1.25,
      color: '#55595c',
      '&:before': {
        borderBottom: '1px solid #eee',
      },
    },
    marginBottom: '15px',
    width: '100%',
  },
  saveButton: {
    marginRight: '25px',
    backgroundColor: '#1976D2',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#1565c0',
    },
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const Modal = ({ setOpen, open, invoice, classes }) => {
  const dispatch = useDispatch();
  const [payment, setPayment] = useState({
    amountPaid: 0,
    datePaid: new Date(),
    paymentMethod: '',
    note: '',
    paidBy: ''
  });
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [paymentRecords, setPaymentRecords] = useState([]);
  const [method, setMethod] = useState(null); // Initial null for Autocomplete
  const [totalAmountReceived, setTotalAmountReceived] = useState(0);
  const [updatedInvoice, setUpdatedInvoice] = useState({});

  useEffect(() => {
    if (method) {
      setPayment({ ...payment, paymentMethod: method.title });
    }
  }, [method]);

  useEffect(() => {
    setPayment({ ...payment, datePaid: selectedDate });
  }, [selectedDate]);

  useEffect(() => {
    if (invoice) {
      setPayment({
        ...payment,
        amountPaid: Number(invoice.total) - Number(invoice.totalAmountReceived),
        paidBy: invoice?.client?.name || ''
      });
      if (invoice.paymentRecords) {
        setPaymentRecords(invoice.paymentRecords);
        let totalReceived = invoice.paymentRecords.reduce((acc, curr) => acc + Number(curr.amountPaid), 0);
        setTotalAmountReceived(totalReceived);
      }
    }
  }, [invoice]);

  useEffect(() => {
    setUpdatedInvoice({
      ...invoice,
      status: (Number(totalAmountReceived) + Number(payment.amountPaid)) >= Number(invoice?.total) ? 'Paid' : 'Partial',
      paymentRecords: [...paymentRecords, payment],
      totalAmountReceived: Number(totalAmountReceived) + Number(payment.amountPaid)
    });
  }, [payment, paymentRecords, totalAmountReceived, invoice]);

  const handleSubmitPayment = (e) => {
    e.preventDefault();
    dispatch(updateInvoice(invoice._id, updatedInvoice))
      .then(() => {
        handleClose();
        window.location.reload();
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const paymentMethods = [
    { title: 'Bank Transfer' },
    { title: 'Cash' },
    { title: 'Credit Card' },
    { title: 'PayPal' },
    { title: 'Others' },
  ];

  return (
    <div>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} fullWidth>
        <DialogTitle id="customized-dialog-title" onClose={handleClose} className={classes.dialogTitle}>
          Record Payment
        </DialogTitle>
        <DialogContent dividers>
          <DatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

          <TextField
            type="number"
            name="amountPaid"
            label="Amount Paid"
            fullWidth
            variant="standard"
            className={classes.inputField}
            onChange={(e) => setPayment({ ...payment, amountPaid: e.target.value })}
            value={payment.amountPaid}
          />

          <Grid item xs={12}>
            <Autocomplete
              id="payment-method-select"
              options={paymentMethods}
              getOptionLabel={(option) => option.title || ''}
              style={{ width: '100%', marginBottom: '15px' }}
              value={method}
              onChange={(event, newValue) => setMethod(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Payment Method"
                  variant="standard"
                />
              )}
            />
          </Grid>

          <TextField
            type="text"
            name="note"
            label="Note"
            fullWidth
            variant="standard"
            className={classes.inputField}
            onChange={(e) => setPayment({ ...payment, note: e.target.value })}
            value={payment.note}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleSubmitPayment}
            variant="contained"
            className={classes.saveButton}
          >
            Save Record
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default withStyles(styles)(Modal);