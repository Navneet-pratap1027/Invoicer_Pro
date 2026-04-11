import React from 'react';
// ✅ Sahi path: 'core' folder se styles aur design components
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar'; // Spelling theek ki

// ✅ Icons bilkul sahi jagah se hain
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import PhoneInTalkIcon from '@material-ui/icons/PhoneInTalk';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import AccountBalanceWalletRoundedIcon from '@material-ui/icons/AccountBalanceWalletRounded';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 450,
  },
  large: {
    width: theme.spacing(12),
    height: theme.spacing(12),
  },
}));

export default function ProfileDetail({ profiles }) {
  const classes = useStyles();

  return (
    <>
      <div style={{
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        borderBottom: 'solid 1px #dddddd',
        paddingBottom: '20px',
        marginBottom: '10px'
      }}>
        {/* Profile Logo check */}
        <Avatar 
          alt={profiles?.businessName} 
          src={profiles?.logo} 
          className={classes.large} 
        />
      </div>

      <List className={classes.root}>
        <ListItem>
          <BusinessCenterIcon style={{ marginRight: '20px', color: 'gray' }} />
          <ListItemText primary={profiles?.businessName || 'Business Name'} />
        </ListItem>

        <ListItem>
          <LocationOnIcon style={{ marginRight: '20px', color: 'gray' }} />
          <ListItemText primary={profiles?.contactAddress || 'Address not set'} />
        </ListItem>

        <ListItem>
          <PhoneInTalkIcon style={{ marginRight: '20px', color: 'gray' }} />
          <ListItemText primary={profiles?.phoneNumber || 'No phone number'} />
        </ListItem>

        <ListItem>
          <AlternateEmailIcon style={{ marginRight: '20px', color: 'gray' }} />
          <ListItemText primary={profiles?.email || 'No email'} />
        </ListItem>

        <ListItem>
          <AccountBalanceWalletRoundedIcon style={{ marginRight: '20px', color: 'gray' }} />
          <ListItemText primary={profiles?.paymentDetails || 'No payment details'} />
        </ListItem>
      </List>
    </>
  );
}