import React, { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import styles from './NavBar.module.css'

const NavBar = () => {
  const location = useLocation()
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')))

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('profile')))
  }, [location])

  if (!user) return null

  const isActive = (path) => location.pathname === path ? styles.active : ''

  return (
    <div>
      <nav className={styles.navbar}>
        <ul className={styles.navbarNav}>

          {/* Logo */}
          <li className={styles.logo}>
            <a href="/dashboard" className={styles.navLink}>
              <span className={styles.logoText}>
                <img style={{ width: '36px' }} src="https://i.postimg.cc/hGZKzdkS/logo.png" alt="arc-invoice" />
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </li>

          {/* Dashboard */}
          <li className={styles.navItem}>
            <Link
              to="/dashboard"
              className={`${styles.navLink} ${isActive('/dashboard')}`}
              data-tooltip="Dashboard"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                <path d="M22 12A10 10 0 0 0 12 2v10z" />
              </svg>
              <span className={styles.linkText}>Dashboard</span>
            </Link>
          </li>

          {/* Create */}
          <li className={styles.navItem}>
            <a
              href="/invoice"
              className={`${styles.navLink} ${isActive('/invoice')}`}
              data-tooltip="Create"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span className={styles.linkText}>Create</span>
            </a>
          </li>

          {/* Invoices */}
          <li className={styles.navItem}>
            <a
              href="/invoices"
              className={`${styles.navLink} ${isActive('/invoices')}`}
              data-tooltip="Invoices"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
              <span className={styles.linkText}>Invoices</span>
            </a>
          </li>

          {/* Customers */}
          <li className={styles.navItem}>
            <a
              href="/customers"
              className={`${styles.navLink} ${isActive('/customers')}`}
              data-tooltip="Customers"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span className={styles.linkText}>Customers</span>
            </a>
          </li>

          {/* Settings — stays at bottom via margin-top: auto */}
          <li className={styles.navItem}>
            <a
              href="/settings"
              className={`${styles.navLink} ${isActive('/settings')}`}
              data-tooltip="Settings"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83
                  2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33
                  1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09
                  A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06
                  a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06
                  a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3
                  a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9
                  a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83
                  2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9
                  a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09
                  a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06
                  a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06
                  a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21
                  a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              <span className={styles.linkText}>Settings</span>
            </a>
          </li>

        </ul>
      </nav>
    </div>
  )
}

export default NavBar
