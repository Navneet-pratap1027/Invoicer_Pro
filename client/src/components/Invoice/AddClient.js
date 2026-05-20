/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles'; 
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';

import { useDispatch } from 'react-redux';
import { createClient } from '../../actions/clientActions';
import { useLocation } from 'react-router-dom';
import { useSnackbar } from 'react-simple-snackbar';

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
    display: 'block',
    padding: '1.2rem 0.75rem', // Slightly reduced padding for compact look
    width: '100%',
    fontSize: '0.85rem',
    lineHeight: 1.25,
    color: '#55595c',
    backgroundColor: '#fff',
    borderBottom: '1px solid #eee',
    borderRadius: '3px',
    marginBottom: '15px',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s ease-in-out',
    '&:focus': {
      outline: '0',
      borderBottomColor: '#ffab00',
    },
    '&:hover': {
      borderBottomColor: '#1976D2',
    },
  },
  saveButton: {
    marginRight: '20px',
    backgroundColor: '#1976D2',
    color: '#fff',
    textTransform: 'none',
    fontWeight: 'bold',
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
    padding: theme.spacing(3),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const AddClient = ({ setOpen, open, classes }) => {
  const location = useLocation();
  const [clientData, setClientData] = useState({ name: '', email: '', phone: '', address: '', userId: [] });
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('profile'));
  const [openSnackbar, closeSnackbar] = useSnackbar();

  useEffect(() => {
    const checkId = user?.result?._id;
    if (checkId !== undefined) {
      setClientData({ ...clientData, userId: [checkId] });
    } else {
      setClientData({ ...clientData, userId: [user?.result?.googleId] });
    }
  }, [location]);

  const handleSubmitClient = (e) => {
    e.preventDefault();
    if (!clientData.name || !clientData.email || !clientData.phone) return;
    dispatch(createClient(clientData, openSnackbar));
    clear();
    handleClose();
  };

  const clear = () => {
    setClientData({ name: '', email: '', phone: '', address: '', userId: [] });
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      {/* ✅ Max Width set to xs to keep modal card size completely normal and compact */}
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} fullWidth maxWidth="xs">
        <DialogTitle id="customized-dialog-title" onClose={handleClose} className={classes.dialogTitle}>
          New Customer
        </DialogTitle>
        <DialogContent dividers>
          <div className="customInputs">
            <input
              placeholder="Name"
              className={classes.inputField}
              name="name"
              type="text"
              onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
              value={clientData.name}
              required
            />
            <input
              placeholder="Email"
              className={classes.inputField}
              name="email"
              type="email"
              onChange={(e) => setClientData({ ...clientData, email: e.target.value.toLowerCase().trim() })}
              value={clientData.email}
              required
            />
            
            {/* ✅ FIXED STRICT NUMERIC ONLY AND EXACT 10 DIGITS VISIBLE ENFORCEMENT */}
            <input
              placeholder="Phone (10 Digits)"
              className={classes.inputField}
              name="phone"
              type="tel"            // Strictly blocks desktop character arrays and opens numpad on mobile
              maxLength={10}        // Stops input expansion over line boundaries
              inputMode="numeric"   // Strict semantic declaration
              pattern="[0-9]*"
              onChange={(e) => {
                // Instantly filters non-digits and slices exactly at 10 indices
                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                setClientData({ ...clientData, phone: val });
              }}
              value={clientData.phone}
              required
            />
            
            <input
              placeholder="Address"
              className={classes.inputField}
              name="address"
              type="text"
              onChange={(e) => setClientData({ ...clientData, address: e.target.value })}
              value={clientData.address}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={handleSubmitClient}
            variant="contained"
            className={classes.saveButton}
          >
            Save Customer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default withStyles(styles)(AddClient);