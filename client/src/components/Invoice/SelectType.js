/* eslint-disable no-use-before-define */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

export default function SelectType({ type, setType }) {

  const options = [
    { title: 'Invoice' },
    { title: 'Receipt' },
    { title: 'Estimate' },
    { title: 'Quotation' },
    { title: 'Bill' },
  ];

  return (
    <Autocomplete
      id="combo-box-demo"
      options={options}
      // Agar type string hai toh use sahi object se match karega
      value={options.find((opt) => opt.title === type) || null}
      getOptionLabel={(option) => option.title || ""}
      // Important for MUI v4 validation
      getOptionSelected={(option, value) => option.title === value.title}
      onChange={(event, newValue) => {
        // Pura object pass karne ki jagah sirf 'title' (string) pass karega
        setType(newValue ? newValue.title : '');
      }}
      style={{ width: 300, marginBottom: '20px' }}
      renderInput={(params) => (
        <TextField 
          {...params} 
          label="Select Type" 
          variant="outlined" 
          size="small"
        />
      )}
    />
  );
}