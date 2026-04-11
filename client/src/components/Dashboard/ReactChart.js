import * as React from 'react';
import moment from 'moment';
// ✅ Sahi path: 'core' se aayega Paper
import Paper from '@material-ui/core/Paper'; 
import {
  Chart,
  BarSeries,
  Title,
  ArgumentAxis,
  ValueAxis,
} from '@devexpress/dx-react-chart-material-ui';
import { Animation } from '@devexpress/dx-react-chart';

const ReactChart = ({ paymentHistory }) => {

    // Data formatting (Safety check added for paymentHistory)
    const data = paymentHistory && paymentHistory.length > 0 
        ? paymentHistory.map((payment) => ({
            year: moment(payment.datePaid).format("MMM Do YY"), 
            population: payment.amountPaid
          }))
        : [];

    console.log("Chart Data:", data);

    // Agar data nahi hai toh blank screen ki jagah message dikhao
    if (data.length === 0) {
        return (
            <Paper style={{ padding: '20px', textAlign: 'center' }}>
                No payment history to display on chart.
            </Paper>
        );
    }

    return (
      <Paper elevation={3} style={{ padding: '10px' }}>
        <Chart
          data={data}
        >
          <ArgumentAxis />
          <ValueAxis />

          <BarSeries
            valueField="population"
            argumentField="year"
            name="Payments"
          />
          <Title text="Payment History Overview" />
          <Animation />
        </Chart>
      </Paper>
    );
}

export default ReactChart;