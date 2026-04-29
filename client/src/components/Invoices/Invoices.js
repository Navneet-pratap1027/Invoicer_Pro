import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles'; 
import {
  Table, TableBody, TableCell, TableHead, TableContainer,
  TableRow, Paper, IconButton, Container, Dialog,
  DialogActions, DialogContent, DialogTitle, Button
} from '@material-ui/core';

import DeleteOutlineRoundedIcon from '@material-ui/icons/DeleteOutlineRounded';
import BorderColorIcon from '@material-ui/icons/BorderColor';

import { deleteInvoice, getInvoicesByUser } from '../../actions/invoiceActions';
import NoData from '../svgIcons/NoData';
import Spinner from '../Spinner/Spinner';
import { useSnackbar } from 'react-simple-snackbar';

const useStyles = makeStyles((theme) => ({
  table: { minWidth: 500 },
  tableCell: { fontSize: '14px', textAlign: 'center', padding: '12px' },
  editButton: {
    backgroundColor: '#e8f5e9',
    color: 'darkgreen',
    margin: '2px',
    '&:hover': { backgroundColor: '#c8e6c9' },
  },
  deleteButton: {
    backgroundColor: '#ffebee',
    color: 'darkred',
    margin: '2px',
    '&:hover': { backgroundColor: '#ffcdd2' },
  },
}));

const headerStyle = { textAlign: 'center', fontWeight: 'bold', backgroundColor: '#f5f5f5' };

const Invoices = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory(); // ✅ Fixed syntax
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

  if (isLoading) return <Spinner />;

  if (!rows || rows.length === 0) {
    return (
      <div style={{ textAlign: 'center', paddingTop: '150px' }}>
        <NoData />
        <p style={{ color: 'gray' }}>No invoices yet. Click the plus icon to create one.</p>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '80px', paddingBottom: '50px' }}>
      <Container style={{ width: '95%' }}>
        <TableContainer component={Paper} elevation={2}>
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
                <TableRow key={row._id} hover>
                  <TableCell className={classes.tableCell}>{row.invoiceNumber}</TableCell>
                  <TableCell className={classes.tableCell}>{row?.client?.name || 'No Name'}</TableCell>
                  {/* ✅ Currency symbol handle kiya */}
                  <TableCell className={classes.tableCell}>₹ {row.total?.toLocaleString()}</TableCell>
                  <TableCell className={classes.tableCell}>{moment(row.dueDate).format('DD MMM YYYY')}</TableCell>
                  <TableCell className={classes.tableCell}>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '20px', 
                      fontSize: '11px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      backgroundColor: row.status === 'Paid' ? '#e8f5e9' : '#fff3e0',
                      color: row.status === 'Paid' ? '#2e7d32' : '#ef6c00'
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

        {/* Confirmation Dialog */}
        <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <p>Are you sure you want to delete this invoice? This action cannot be undone.</p>
          </DialogContent>
          <DialogActions style={{ padding: '15px' }}>
            <Button onClick={() => setOpenConfirm(false)} variant="outlined">Cancel</Button>
            <Button onClick={handleDelete} color="secondary" variant="contained">Delete</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
};

export default Invoices;