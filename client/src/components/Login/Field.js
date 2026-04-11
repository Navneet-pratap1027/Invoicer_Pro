/* eslint-disable */
import React from 'react';
// ✅ MUI v4 Core Imports
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
// ✅ MUI v4 Icons
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

const Field = ({ name, handleChange, label, half, autoFocus, type, handleShowPassword }) => (
  <Grid item xs={12} sm={half ? 6 : 12}>
    <TextField
      name={name}
      onChange={handleChange}
      variant="outlined"
      required
      fullWidth
      label={label}
      autoFocus={autoFocus}
      type={type}
      size="small"
      // ✅ MUI v4 mein 'sx' nahi hota, isliye Inline styles use kar rahe hain compatibility ke liye
      InputLabelProps={{
        style: { color: '#6060a0' },
      }}
      InputProps={{
        style: { 
          color: '#e2e2f0', 
          backgroundColor: 'rgba(255,255,255,0.04)',
          borderRadius: '10px'
        },
        endAdornment: name === 'password' ? (
          <InputAdornment position="end">
            <IconButton onClick={handleShowPassword} edge="end" style={{ color: '#555580' }}>
              {type === 'password' ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
    />
  </Grid>
);

export default Field;