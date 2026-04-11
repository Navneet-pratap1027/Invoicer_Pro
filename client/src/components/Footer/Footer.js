/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import styles from './Footer.module.css'
import FabButton from '../Fab/Fab'

const Footer = () => {
    const location = useLocation()
    // LocalStorage se data nikalte waqt try-catch ya fallback dena safe rehta hai
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')))

    useEffect(() => {
        const profile = localStorage.getItem('profile')
        setUser(profile ? JSON.parse(profile) : null)
    }, [location])

    return (
        // Agar CSS file mein 'footerContainer' class hai toh use zaroor rakhein
        <footer className={styles.footerContainer}>
            <div className={styles.footerText}>
                © InvoicerPro {new Date().getFullYear()} — All rights reserved.
            </div>
            {/* Jab user login ho tabhi Floating Action Button dikhe */}
            {user && <FabButton />}
        </footer>
    )
}

export default Footer