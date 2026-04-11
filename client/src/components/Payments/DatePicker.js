import 'date-fns';
import React from 'react';
// ✅ Sahi path: Grid hamesha 'core' se aayega
import Grid from '@material-ui/core/Grid'; 
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

export default function MaterialUIPickers({ setSelectedDate, selectedDate }) {
  
  const handleDateChange = (date) => {
    // Safety check: Agar date valid hai tabhi convert karein
    if (date) {
      setSelectedDate(date.toISOString());
    }
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justifyContent="space-around" style={{ width: '97%', paddingLeft: '10px', paddingBottom: '15px' }}>
        <KeyboardDatePicker
          fullWidth
          disableToolbar
          variant="inline"
          format="MM/dd/yyyy"
          margin="normal"
          id="date-picker-inline"
          label="Date paid"
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
          // Style fix: Input styling ko dark theme ke hisaab se clean rakha hai
          InputProps={{
            style: {
              padding: '10px 0',
              fontSize: '0.9rem',
              color: '#55595c',
            },
          }}
        />
      </Grid>
    </MuiPickersUtilsProvider>
  );
}