import React from 'react';
import moment from 'moment';
import { toCommas } from '../../utils/utils';
import styles from './InvoiceDetails.module.css';

const PaymentHistory = ({ paymentRecords = [] }) => {

    // Agar koi payment record nahi hai, toh section hi mat dikhao
    if (!paymentRecords || paymentRecords.length === 0) return null;

    return (
        <div className="tabs">
            <div className="tab">
                <input type="checkbox" id="chck1" />
                <label className="tab-label" htmlFor="chck1">
                    Payment History 
                    <span className={styles.totalUnpaid}>{paymentRecords.length}</span>
                </label>
                
                <div className="tab-content">
                    <div style={{ overflowX: 'auto' }}>
                        <table>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'left', padding: '10px' }}>Date Paid</th>
                                    <th style={{ textAlign: 'left', padding: '10px' }}>Amount Paid</th>
                                    <th style={{ textAlign: 'left', padding: '10px' }}>Payment Method</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paymentRecords.map((record) => (
                                    <tr key={record._id || Math.random()}>
                                        <td style={{ padding: '10px' }}>
                                            {moment(record.datePaid).format('MMMM Do YYYY')}
                                        </td>
                                        <td style={{ padding: '10px', fontWeight: 'bold', color: '#00A86B' }}>
                                            {toCommas(record.amountPaid)}
                                        </td>
                                        <td style={{ padding: '10px' }}>
                                            {record.paymentMethod}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentHistory;