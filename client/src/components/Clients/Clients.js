import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
// ✅ Sahi path: 'core' folder se styles aayenge
import { makeStyles } from '@material-ui/core/styles'; 
import {
  Table, TableBody, TableCell, TableHead, TableContainer, TableFooter,
  TablePagination, TableRow, Paper, IconButton, Container, Button, Dialog, DialogActions, DialogContent, DialogTitle
} from '@material-ui/core';

// Icons sahi folder se
import BorderColorIcon from '@material-ui/icons/BorderColor';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutlineRounded';

import { useSnackbar } from 'react-simple-snackbar';
import TablePaginationActions from './TablePaginationActions';
import { deleteClient } from '../../actions/clientActions';
import styles from './Clients.module.css';

const useStyles = makeStyles((theme) => ({
  table: { minWidth: 500 },
  editButton: {
    backgroundColor: '#4caf50',
    color: 'white',
    marginRight: '5px',
    transition: 'transform 0.2s ease, background-color 0.3s ease',
    '&:hover': {
      backgroundColor: '#388e3c',
      transform: 'scale(1.1)',
    },
  },
  deleteButton: {
    backgroundColor: '#f44336',
    color: 'white',
    transition: 'transform 0.2s ease, background-color 0.3s ease',
    '&:hover': {
      backgroundColor: '#d32f2f',
      transform: 'scale(1.1)',
    },
  },
}));

const Clients = ({ setOpen, setCurrentId, clients }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default 5 rows
  const [openSnackbar] = useSnackbar();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);

  const handlePageChange = (event, newPage) => setPage(newPage);
  
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (id) => {
    setCurrentId(id);
    setOpen(true);
  };

  const openDeleteDialog = (clientId) => {
    setClientToDelete(clientId);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (clientToDelete) {
      dispatch(deleteClient(clientToDelete, openSnackbar));
    }
    setDeleteDialogOpen(false);
    setClientToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setClientToDelete(null);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, clients.length - page * rowsPerPage);

  return (
    <div className={styles.pageLayout}>
      <Container style={{ width: '85%' }}>
        <TableContainer component={Paper} elevation={0} className={styles.tableContainer}>
          <Table className={classes.table} aria-label="clients table">
            <TableHead>
              <TableRow>
                <TableCell className={styles.headerCell}>#</TableCell>
                <TableCell className={styles.headerCell}>Name</TableCell>
                <TableCell className={styles.headerCell}>Email</TableCell>
                <TableCell className={styles.headerCell}>Phone</TableCell>
                <TableCell className={styles.headerCell} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {(rowsPerPage > 0
                ? clients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : clients
              ).map((client, index) => (
                <TableRow key={client._id} className={styles.tableRow}>
                  <TableCell className={styles.tableCell}>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell className={styles.tableCell}>
                    <Button className={styles.nameButton} style={{textTransform: 'none'}}>{client.name}</Button>
                  </TableCell>
                  <TableCell className={styles.tableCell}>{client.email}</TableCell>
                  <TableCell className={styles.tableCell}>{client.phone}</TableCell>
                  <TableCell className={styles.tableCell} align="center">
                    <IconButton onClick={() => handleEdit(client._id)} className={classes.editButton} size="small">
                      <BorderColorIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => openDeleteDialog(client._id)} className={classes.deleteButton} size="small">
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                  colSpan={6}
                  count={clients.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: { 'aria-label': 'rows per page' },
                    native: true,
                  }}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>

        {/* Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this client?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelDelete} color="primary">Cancel</Button>
            <Button onClick={handleDelete} style={{color: 'red'}}>Delete</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
};

Clients.propTypes = {
  setOpen: PropTypes.func.isRequired,
  setCurrentId: PropTypes.func.isRequired,
  clients: PropTypes.array.isRequired,
};

export default Clients;