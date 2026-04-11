import React from 'react'
import ReactApexChart from "react-apexcharts";

const Donut = ({ unpaid = [], paid = [], partial = [] }) => {

    // Safety: Agar data undefined ho toh blank array use ho
    const series = [
        unpaid?.length || 0, 
        paid?.length || 0, 
        partial?.length || 0
    ];

    const options = {
        chart: {
            type: 'donut',
        },
        // Modern Colors for Invoices
        colors: ['#FF4560', '#00E396', '#FEB019'], 
        labels: ['Unpaid Invoices', 'Paid Invoices', 'Partially Paid'],
        legend: {
            position: 'bottom',
            fontFamily: 'inherit',
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '65%'
                }
            }
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 300
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    }

    if (series.reduce((a, b) => a + b, 0) === 0) {
        return <p style={{textAlign: 'center', color: 'gray'}}>No invoice data for chart</p>;
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
            <ReactApexChart options={options} series={series} type="donut" width={400} />
        </div>
    )
}

export default Donut;