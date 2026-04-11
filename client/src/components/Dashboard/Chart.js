/* eslint-disable */
import React, { useState, useMemo } from "react";
window.React = React; 

import ReactApexChart from "react-apexcharts";
import { useTheme } from '@material-ui/core/styles'; 

const currencyOptions = [
  { label: 'USD', symbol: '$' },
  { label: 'EUR', symbol: '€' },
  { label: 'JPY', symbol: '¥' },
  { label: 'TZS', symbol: 'TZS' }
];

function Chart({ paymentHistory }) {
  const theme = useTheme();
  const [currency, setCurrency] = useState(currencyOptions[0]);

  // Logic is same as your previous code (Perfectly written)
  const paymentDates = useMemo(() => 
    paymentHistory && paymentHistory.length > 0
      ? paymentHistory.map(payment =>
          payment.datePaid ? new Date(payment.datePaid).getTime() : 0
        )
      : [],
    [paymentHistory]
  );

  const paymentAmounts = useMemo(() => 
    paymentHistory && paymentHistory.length > 0
      ? paymentHistory.map(payment => Number(payment.amountPaid) || 0)
      : [],
    [paymentHistory]
  );

  const averagePayment = useMemo(() => 
    paymentAmounts.length > 0 
      ? paymentAmounts.reduce((a, b) => a + b, 0) / paymentAmounts.length 
      : 0,
    [paymentAmounts]
  );

  const handleCurrencyChange = (e) => {
    const selectedCurrency = currencyOptions.find(opt => opt.label === e.target.value);
    if (selectedCurrency) setCurrency(selectedCurrency);
  };

  const containerStyle = {
    background: theme.palette.type === 'dark' ? '#1e1e2e' : '#ffffff',
    borderRadius: 16,
    padding: '24px',
    margin: '24px auto',
    width: '94%',
    boxShadow: `0 8px 24px rgba(0,0,0,0.1)`,
    border: `1px solid ${theme.palette.divider}`,
  };

  const chartOptions = useMemo(() => ({
    chart: {
      type: 'area',
      height: 350,
      toolbar: { show: true },
      animations: { enabled: true },
      background: 'transparent',
      foreColor: theme.palette.text.secondary
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    xaxis: {
      type: 'datetime',
      categories: paymentDates,
    },
    yaxis: {
      labels: {
        formatter: (value) => `${currency.symbol}${value.toLocaleString()}`,
      },
    },
    colors: [theme.palette.primary.main],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100]
      }
    },
    tooltip: {
      theme: theme.palette.type === 'dark' ? 'dark' : 'light',
      x: { format: 'dd MMM yyyy' },
    }
  }), [theme, paymentDates, currency, averagePayment]);

  if (!paymentHistory || paymentHistory.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'gray' }}>
        No payment data available.
      </div>
    );
  }

  return (
    <div style={containerStyle}>
       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, fontWeight: 700 }}>Payment Analytics</h3>
        <select 
          value={currency.label} 
          onChange={handleCurrencyChange}
          style={{ padding: '5px', borderRadius: '5px', outline: 'none' }}
        >
          {currencyOptions.map(opt => <option key={opt.label} value={opt.label}>{opt.label}</option>)}
        </select>
      </div>
      
      {/* ✅ Component check */}
      {ReactApexChart && (
        <ReactApexChart 
            options={chartOptions} 
            series={[{ name: "Payment Amount", data: paymentAmounts }]} 
            type="area" 
            height={350}
        />
      )}
    </div>
  );
}

export default Chart;