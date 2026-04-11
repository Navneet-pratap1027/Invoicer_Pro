/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSnackbar } from 'react-simple-snackbar';
import { useLocation } from 'react-router-dom';
// ✅ MUI v4 Core Imports
import { Avatar, Button, Paper, Grid, Container } from '@material-ui/core';

import Uploader from './Uploader';
import { getProfilesByUser, updateProfile } from '../../../actions/profile';
import useStyles from './styles';
import Input from './Input';
import ProfileDetail from './Profile';

const Settings = () => {
  const user = JSON.parse(localStorage.getItem('profile'));
  const initialState = { 
    name: '', 
    email: '',
    phoneNumber: '',
    businessName: '',
    contactAddress: '', 
    logo: '',
    paymentDetails: ''
  };

  const [form, setForm] = useState(initialState);
  const [switchEdit, setSwitchEdit] = useState(0);
  const location = useLocation();
  const dispatch = useDispatch();
  const classes = useStyles();
  
  // Redux state se profile uthana
  const { profiles } = useSelector((state) => state.profiles);
  const [openSnackbar] = useSnackbar();

  // 1. Initial Profile Fetching
  useEffect(() => {
    if (user?.result?._id || user?.result?.googleId) {
      dispatch(getProfilesByUser({ search: user?.result?._id || user?.result?.googleId }));
    }
  }, [location, dispatch]);

  // 2. Edit mode switch hone par form fill karna
  useEffect(() => {
    if (switchEdit === 1 && profiles) {
      setForm(profiles);
    }
  }, [switchEdit, profiles]);

  // 3. LocalStorage update (Sirf tab jab profiles change ho, render loop se bachne ke liye)
  useEffect(() => {
    if (profiles) {
      localStorage.setItem('profileDetail', JSON.stringify({ ...profiles }));
    }
  }, [profiles]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Safety check: profiles._id exist karna chahiye
    if (profiles?._id) {
      await dispatch(updateProfile(profiles._id, form, openSnackbar));
      setSwitchEdit(0);
    } else {
      openSnackbar("Profile ID not found. Please refresh.");
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div style={{ paddingTop: '80px' }}>
      {switchEdit === 0 && (
        <Container component="main" maxWidth="sm">
          <Paper className={classes.paper} elevation={0}>
            <ProfileDetail profiles={profiles} />
            <Button 
              variant="outlined" 
              color="primary"
              style={{ margin: '30px', padding: '10px 30px', textTransform: 'none' }} 
              onClick={() => setSwitchEdit(1)}
            >
              Edit Business Profile
            </Button>
          </Paper>
        </Container>
      )}

      {switchEdit === 1 && (
        <Container component="main" maxWidth="sm">
          <Paper className={classes.paper} elevation={1}>
            <div style={{
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              borderBottom: 'solid 1px #dddddd',
              paddingBottom: '20px',
              marginBottom: '20px'
            }}>
              <Avatar style={{ width: '100px', height: '100px' }} src={form?.logo || profiles?.logo} alt="" className={classes.avatar} />
            </div>
            
            <form className={classes.form} onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Uploader form={form} setForm={setForm} />
                <Input name="email" label="Email Address" handleChange={handleChange} type="email" half value={form?.email} />
                <Input name="phoneNumber" label="Phone Number" handleChange={handleChange} type="text" half value={form?.phoneNumber} />
                <Input name="businessName" label="Business Name" handleChange={handleChange} type="text" value={form?.businessName} />
                <Input name="contactAddress" label="Contact Address" handleChange={handleChange} type="text" value={form?.contactAddress} />
                <Input name="paymentDetails" label="Payment Details/Notes" handleChange={handleChange} type="text" multiline rows={4} value={form?.paymentDetails} />
              </Grid>
              
              <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit} style={{ marginTop: '20px' }}>
                Update Settings
              </Button>
              
              <Button fullWidth variant="text" onClick={() => setSwitchEdit(0)} style={{ marginTop: '10px', textTransform: 'none' }}>
                Cancel
              </Button>
            </form>
          </Paper>
        </Container>
      )}
    </div>
  );
};

export default Settings;