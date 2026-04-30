import React, { useEffect } from 'react'
import { toCommas } from '../../utils/utils'
import styles from './Dashboard.module.css'
import { useHistory, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getInvoicesByUser } from '../../actions/invoiceActions'
import Chart from './Chart'
import moment from 'moment'
import Spinner from '../Spinner/Spinner'

// Icon components yahan rahein...
const IconCheck = () => ( <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> )
const IconPie = () => ( <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg> )
const IconBag = () => ( <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> )
const IconCard = () => ( <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> )
const IconClock = () => ( <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> )
const IconFrown = () => ( <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg> )

const StatCard = ({ label, value, icon, accent, sub }) => (
  <div className={`${styles.card} ${accent ? styles[accent] : ''}`}>
    <div className={styles.cardBody}>
      <span className={styles.cardLabel}>{label}</span>
      <p className={styles.cardValue}>{value}</p>
      {sub && <span className={styles.cardSub}>{sub}</span>}
    </div>
    <div className={styles.cardIcon}>{icon}</div>
  </div>
)

const Dashboard = () => {
  const location = useLocation()
  const history = useHistory()
  const dispatch = useDispatch()
  const user = JSON.parse(localStorage.getItem('profile'))
  const { invoices, isLoading } = useSelector((state) => state?.invoices)

  useEffect(() => {
    dispatch(getInvoicesByUser({ search: user?.result?._id || user?.result?.googleId }))
  }, [location])

  if (!user) { history.push('/login'); return null }

  const overDue = invoices?.filter((inv) => inv.dueDate <= new Date().toISOString() && inv.status !== 'Paid')
  const paid = invoices?.filter((inv) => inv.status === 'Paid')
  const partial = invoices?.filter((inv) => inv.status === 'Partial')
  const unpaid = invoices?.filter((inv) => inv.status === 'Unpaid')
  const totalPaid = invoices.reduce((t, inv) => t + (inv.totalAmountReceived || 0), 0)
  const totalAmount = invoices.reduce((t, inv) => t + inv.total, 0)
  const totalPending = totalAmount - totalPaid

  let paymentHistory = []
  invoices.forEach((inv) => { if (inv.paymentRecords) paymentHistory = [...paymentHistory, ...inv.paymentRecords] })
  const sortedHistory = [...paymentHistory].sort((a, b) => new Date(b.datePaid) - new Date(a.datePaid))

  if (isLoading) return <div className={styles.pageContainer}><div className={styles.loadingWrap}><Spinner /></div></div>

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageSubtitle}>Welcome back, {user?.result?.name?.split(' ')[0]} 👋</p>
        </div>
        <a href="/invoice" className={styles.createBtn}>+ New Invoice</a>
      </div>

      <div className={styles.statsGrid}>
        <StatCard label="Total Received" value={`$${toCommas(totalPaid)}`} icon={<IconCheck />} accent="accentGreen" />
        <StatCard label="Pending" value={`$${toCommas(totalPending)}`} icon={<IconPie />} accent="accentOrange" />
        <StatCard label="Invoiced" value={`$${toCommas(totalAmount)}`} icon={<IconBag />} accent="accentBlue" />
        <StatCard label="Invoices" value={invoices.length} icon={<IconCard />} />
        <StatCard label="Paid" value={paid.length} icon={<IconCheck />} accent="accentGreen" sub={`${invoices.length ? Math.round((paid.length / invoices.length) * 100) : 0}%`} />
        <StatCard label="Partial" value={partial.length} icon={<IconPie />} accent="accentOrange" />
        <StatCard label="Unpaid" value={unpaid.length} icon={<IconFrown />} accent="accentRed" />
        <StatCard label="Overdue" value={overDue.length} icon={<IconClock />} accent="accentRed" />
      </div>
      {/* ... Baki chart aur table code waisa hi rahega */}
    </div>
  )
}
export default Dashboard