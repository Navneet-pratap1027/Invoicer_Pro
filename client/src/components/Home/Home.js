import React from 'react';
import { useHistory } from 'react-router-dom';
import styles from './Home.module.css';

const Home = () => {
    const history = useHistory();

    return (
        <div className={styles.pageContainer}>
            {/* Top Right Header */}
            <header className={styles.header}>
                <div className={styles.logo}>InvoicerPro</div>
                <div className={styles.authButtons}>
                    <button className={styles.secondaryBtn} onClick={() => history.push('/login')}>Sign In</button>
                    <button className={styles.primaryBtn} onClick={() => history.push('/signup')}>Get Started</button>
                </div>
            </header>

            {/* Hero Section */}
            <section className={styles.hero}>
                <h1>Invoicing that works for you</h1>
                <p className={styles.paragraph}>
                    Create, manage, and send professional invoices in seconds. 
                    Track your payments, manage your clients, and grow your business 
                    with our all-in-one financial dashboard.
                </p>
                <div className={styles.heroCta}>
                    <button className={styles.bigPrimaryBtn} onClick={() => history.push('/signup')}>
                        Start your 14-day free trial
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Home;