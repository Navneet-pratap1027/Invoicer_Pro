import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
// ✅ FIXED: Icons se hata kar Core folder mein dala
import { makeStyles } from '@material-ui/core/styles'; 
import {
  Table, TableBody, TableCell, TableHead, TableContainer,
  TableRow, Paper, IconButton, Container, Dialog,
  DialogActions, DialogContent, DialogTitle, Button
} from '@material-ui/core';

// ✅ Icons sahi jagah se
import DeleteOutlineRoundedIcon from '@material-ui/icons/DeleteOutlineRounded';
import BorderColorIcon from '@material-ui/icons/BorderColor';

import { deleteInvoice, getInvoicesByUser } from '../../actions/invoiceActions';
import NoData from '../svgIcons/NoData';
import Spinner from '../Spinner/Spinner';
import { useSnackbar } from 'react-simple-snackbar';

const useStyles = makeStyles((theme) => ({
  table: { minWidth: 500 },
  tableCell: { fontSize: '16px', textAlign: 'center' },
  editButton: {
    backgroundColor: 'darkgreen',
    color: 'white',
    margin: '2px',
    '&:hover': {
      backgroundColor: 'green',
    },
  },
  deleteButton: {
    backgroundColor: 'darkred',
    color: 'white',
    margin: '2px',
    '&:hover': {
      backgroundColor: 'red',
    },
  },
}));

const headerStyle = { textAlign: 'center', fontWeight: 'bold' };

const Invoices = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = history = useHistory();
  const user = JSON.parse(localStorage.getItem('profile'));
  const rows = useSelector(state => state.invoices.invoices);
  const isLoading = useSelector(state => state.invoices.isLoading);
  const [openSnackbar] = useSnackbar();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    if(user?.result?._id || user?.result?.googleId) {
        dispatch(getInvoicesByUser({ search: user?.result?._id || user?.result?.googleId }));
    }
  }, [dispatch]);

  const editInvoice = (id) => {
    history.push(`/edit/invoice/${id}`);
  };

  const confirmDelete = (invoiceId) => {
    setSelectedInvoice(invoiceId);
    setOpenConfirm(true);
  };

  const handleDelete = () => {
    if (selectedInvoice) {
      dispatch(deleteInvoice(selectedInvoice, openSnackbar));
    }
    setOpenConfirm(false);
  };

  if (!user) {
    history.push('/login');
    return null;
  }

  if (isLoading) {
    return <Spinner />;
  }

  if (!rows || rows.length === 0) {
    return (
      <div style={{ textAlign: 'center', paddingTop: '150px' }}>
        <NoData />
        <p style={{ color: 'gray' }}>No invoices yet. Click the plus icon to create one.</p>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '70px', paddingBottom: '50px' }}>
      <Container style={{ width: '90%' }}>
        <TableContainer component={Paper} elevation={1}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell style={headerStyle}>Number</TableCell>
                <TableCell style={headerStyle}>Client</TableCell>
                <TableCell style={headerStyle}>Amount</TableCell>
                <TableCell style={headerStyle}>Due Date</TableCell>
                <TableCell style={headerStyle}>Status</TableCell>
                <TableCell style={headerStyle}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((row) => (
                <TableRow key={row._id}>
                  <TableCell className={classes.tableCell}>{row.invoiceNumber}</TableCell>
                  <TableCell className={classes.tableCell}>{row?.client?.name}</TableCell>
                  <TableCell className={classes.tableCell}>{row.currency} {row.total?.toLocaleString()}</TableCell>
                  <TableCell className={classes.tableCell}>{moment(row.dueDate).fromNow()}</TableCell>
                  <TableCell className={classes.tableCell}>
                    <span style={{ 
                      padding: '5px 15px', 
                      borderRadius: '10px', 
                      fontSize: '12px',
                      fontWeight: 'bold',
                      backgroundColor: row.status === 'Paid' ? '#a5ffcd' : 
                                     row.status === 'Partial' ? '#baddff' : '#ffaa91'
                    }}>
                      {row.status}
                    </span>
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    <IconButton onClick={() => editInvoice(row._id)} className={classes.editButton} size="small">
                      <BorderColorIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => confirmDelete(row._id)} className={classes.deleteButton} size="small">
                      <DeleteOutlineRoundedIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <p>Are you sure you want to delete this invoice?</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenConfirm(false)} color="default">Cancel</Button>
            <Button onClick={handleDelete} color="secondary" variant="contained">Delete</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
};

export default Invoices;