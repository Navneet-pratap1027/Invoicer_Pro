import moment from 'moment'

export default function ({
    name,
    address,
    phone,
    email,
    dueDate,
    date,
    id,
    notes,
    subTotal,
    type,
    vat,
    total,
    items,
    status,
    totalAmountReceived,
    balanceDue,
    currency,
    company,
}) {
    // ✅ Null-safe company fields
    const safeCompany = company || {}
    const businessName = safeCompany.businessName || safeCompany.name || 'My Business'
    const businessEmail = safeCompany.email || ''
    const businessPhone = safeCompany.phoneNumber || ''
    const businessAddress = safeCompany.contactAddress || ''
    const businessLogo = safeCompany.logo || null

    const isPaid = Number(balanceDue) <= 0
    const docType = isPaid ? 'Receipt' : (type || 'Invoice')
    const statusColor = status === 'Paid' ? '#16a34a' : '#dc2626'
    const statusBg = status === 'Paid' ? '#dcfce7' : '#fee2e2'

    const itemRows = (items || []).map((item) => {
        const amount = (item.quantity * item.unitPrice) - (item.quantity * item.unitPrice * item.discount / 100)
        return `
        <tr>
            <td class="td-item">${item.itemName || ''}</td>
            <td class="td-num">${item.quantity}</td>
            <td class="td-num">${Number(item.unitPrice).toLocaleString()}</td>
            <td class="td-num">${item.discount || 0}%</td>
            <td class="td-num td-amount">${Number(amount).toLocaleString()}</td>
        </tr>`
    }).join('')

    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 13px;
    color: #1a1a2e;
    background: #fff;
    padding: 48px;
    line-height: 1.5;
  }

  /* ── TOP HEADER ── */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 40px;
    padding-bottom: 28px;
    border-bottom: 2px solid #f1f1f1;
  }

  .logo-area img { max-height: 56px; max-width: 160px; }
  .logo-area .biz-name {
    font-size: 22px;
    font-weight: 700;
    color: #1a1a2e;
    letter-spacing: -0.5px;
  }

  .doc-title-area { text-align: right; }
  .doc-type {
    font-size: 32px;
    font-weight: 800;
    color: #3b82f6;
    letter-spacing: -1px;
    text-transform: uppercase;
  }
  .doc-id {
    font-size: 12px;
    color: #888;
    margin-top: 4px;
  }
  .status-pill {
    display: inline-block;
    margin-top: 10px;
    padding: 4px 14px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    background: ${statusBg};
    color: ${statusColor};
  }

  /* ── BILLING SECTION ── */
  .billing {
    display: flex;
    justify-content: space-between;
    margin-bottom: 36px;
    gap: 20px;
  }

  .billing-block { flex: 1; }

  .billing-block .label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #3b82f6;
    margin-bottom: 6px;
  }

  .billing-block .value {
    font-size: 14px;
    font-weight: 600;
    color: #1a1a2e;
    margin-bottom: 2px;
  }

  .billing-block .sub {
    font-size: 12px;
    color: #666;
    line-height: 1.6;
  }

  .dates-block { text-align: right; }
  .dates-block .date-row { margin-bottom: 10px; }
  .dates-block .date-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #888;
  }
  .dates-block .date-value {
    font-size: 13px;
    font-weight: 600;
    color: #1a1a2e;
  }

  /* ── ITEMS TABLE ── */
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 24px;
  }

  thead tr {
    background: #3b82f6;
    color: #fff;
  }

  thead th {
    padding: 11px 14px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    text-align: left;
  }

  thead th.th-num { text-align: right; }

  tbody tr:nth-child(even) { background: #f8faff; }
  tbody tr:nth-child(odd) { background: #fff; }

  td {
    padding: 11px 14px;
    font-size: 12.5px;
    color: #333;
    border-bottom: 1px solid #f0f0f0;
  }

  .td-num { text-align: right; }
  .td-amount { font-weight: 600; color: #1a1a2e; }

  /* ── TOTALS ── */
  .totals-wrap {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 36px;
  }

  .totals-table {
    width: 280px;
    border-collapse: collapse;
  }

  .totals-table td {
    padding: 7px 14px;
    font-size: 12.5px;
    border: none;
    color: #555;
  }

  .totals-table td:last-child { text-align: right; font-weight: 600; color: #1a1a2e; }

  .totals-table .total-row td {
    padding-top: 12px;
    font-size: 15px;
    font-weight: 800;
    color: #1a1a2e;
    border-top: 2px solid #3b82f6;
  }

  .totals-table .paid-row td { color: #16a34a; }

  .totals-table .balance-row td {
    font-size: 14px;
    font-weight: 700;
    color: ${isPaid ? '#16a34a' : '#dc2626'};
  }

  /* ── FOOTER NOTE ── */
  .footer {
    border-top: 1px solid #f0f0f0;
    padding-top: 18px;
    margin-top: 8px;
  }

  .footer .note-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #888;
    margin-bottom: 5px;
  }

  .footer .note-text {
    font-size: 12px;
    color: #555;
    line-height: 1.6;
  }

  .footer .thank-you {
    text-align: center;
    margin-top: 24px;
    font-size: 12px;
    color: #aaa;
  }
</style>
</head>
<body>

  <!-- HEADER -->
  <div class="header">
    <div class="logo-area">
      ${businessLogo
        ? `<img src="${businessLogo}" alt="${businessName}" />`
        : `<div class="biz-name">${businessName}</div>`
      }
      <div style="margin-top:8px; font-size:12px; color:#666; line-height:1.7;">
        ${businessEmail ? `${businessEmail}<br/>` : ''}
        ${businessPhone ? `${businessPhone}<br/>` : ''}
        ${businessAddress ? `${businessAddress}` : ''}
      </div>
    </div>
    <div class="doc-title-area">
      <div class="doc-type">${docType}</div>
      <div class="doc-id">#${id || ''}</div>
      <div class="status-pill">${status || 'Unpaid'}</div>
    </div>
  </div>

  <!-- BILLING -->
  <div class="billing">
    <div class="billing-block">
      <div class="label">Bill To</div>
      <div class="value">${name || ''}</div>
      <div class="sub">
        ${email ? `${email}<br/>` : ''}
        ${phone ? `${phone}<br/>` : ''}
        ${address ? `${address}` : ''}
      </div>
    </div>

    <div class="billing-block dates-block">
      <div class="date-row">
        <div class="date-label">Date Issued</div>
        <div class="date-value">${moment(date).format('DD MMM YYYY')}</div>
      </div>
      <div class="date-row">
        <div class="date-label">Due Date</div>
        <div class="date-value">${moment(dueDate).format('DD MMM YYYY')}</div>
      </div>
      ${currency ? `
      <div class="date-row">
        <div class="date-label">Currency</div>
        <div class="date-value">${currency}</div>
      </div>` : ''}
    </div>
  </div>

  <!-- ITEMS TABLE -->
  <table>
    <thead>
      <tr>
        <th>Item Description</th>
        <th class="th-num">Qty</th>
        <th class="th-num">Unit Price</th>
        <th class="th-num">Discount</th>
        <th class="th-num">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${itemRows}
    </tbody>
  </table>

  <!-- TOTALS -->
  <div class="totals-wrap">
    <table class="totals-table">
      <tr>
        <td>Subtotal</td>
        <td>${Number(subTotal || 0).toLocaleString()}</td>
      </tr>
      <tr>
        <td>VAT</td>
        <td>${Number(vat || 0).toLocaleString()}</td>
      </tr>
      <tr class="total-row">
        <td>Total (${currency || ''})</td>
        <td>${Number(total || 0).toLocaleString()}</td>
      </tr>
      <tr class="paid-row">
        <td>Amount Paid</td>
        <td>${totalAmountReceived || 0}</td>
      </tr>
      <tr class="balance-row">
        <td>Balance Due</td>
        <td>${balanceDue || 0}</td>
      </tr>
    </table>
  </div>

  <!-- FOOTER -->
  <div class="footer">
    ${notes ? `
    <div class="note-label">Note</div>
    <div class="note-text">${notes}</div>
    ` : ''}
    <div class="thank-you">Thank you for your business.</div>
  </div>

</body>
</html>`
}