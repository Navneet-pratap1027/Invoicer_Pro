/* eslint-disable */
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { forgot } from '../../actions/auth';
import styles from '../Login/Login.module.css';

// ✅ MUI v4 Import for Spinner
import CircularProgress from '@material-ui/core/CircularProgress';

const InputField = ({ label, name, type = 'text', value, onChange }) => (
  <div className={styles.inputGroup}>
    <label className={styles.inputLabel}>{label}</label>
    <div className={styles.inputWrap}>
      <input 
        className={styles.input} 
        name={name} 
        type={type} 
        value={value} 
        onChange={onChange} 
        required 
      />
    </div>
  </div>
);

const Forgot = () => {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(0); // 0: Form, 1: Success, 2: Error
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('profile'));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Dispatching the action
    dispatch(forgot({ email }));

    // Simulating network delay for smooth UI feel
    setTimeout(() => {
      setLoading(false);
      if (window.navigator.onLine) {
        setStep(1); // Email Sent Step
      } else {
        setStep(2); // Connection Error Step
      }
    }, 1500);
  };

  // Agar user pehle se login hai, toh seedha dashboard bhej do
  if (user) history.push('/dashboard');

  return (
    <div className={styles.page} style={{ justifyContent: 'center' }}>
      <div className={styles.right} style={{ width: '100%', borderLeft: 'none' }}>
        <div className={styles.formBox}>
          
          {/* Brand Logo */}
          <div className={styles.logo} style={{ justifyContent: 'center', marginBottom: '2rem' }}>
            <div className={styles.logoIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="8" y1="13" x2="16" y2="13"/>
                <line x1="8" y1="17" x2="13" y2="17"/>
              </svg>
            </div>
            <span className={styles.logoText}>InvoicerPro</span>
          </div>

          {/* STEP 0: FORGOT PASSWORD FORM */}
          {step === 0 && (
            <>
              <h2 className={styles.formTitle}>Forgot Password</h2>
              <p className={styles.formSub}>Enter your email and we'll send you a reset link</p>
              
              <form onSubmit={handleSubmit} className={styles.form}>
                <InputField 
                  label="Email Address" 
                  name="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />

                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? (
                    <CircularProgress size={18} style={{ color: '#fff' }} />
                  ) : (
                    'Send Reset Link'
                  )}
                </button>

                <p className={styles.switchRow}>
                  Remember it?{' '}
                  <button 
                    type="button" 
                    className={styles.switchBtn} 
                    onClick={() => history.push('/login')}
                  >
                    Back to sign in
                  </button>
                </p>
              </form>
            </>
          )}

          {/* STEP 1: SUCCESS MESSAGE */}
          {step === 1 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✉️</div>
              <h2 className={styles.formTitle}>Check your email</h2>
              <p className={styles.formSub}>
                A password reset link was sent to <br />
                <strong style={{ color: '#7c6af7' }}>{email}</strong>
              </p>
              
              <button 
                className={styles.submitBtn} 
                style={{ marginTop: '1.5rem' }} 
                onClick={() => history.push('/login')}
              >
                Back to Sign In
              </button>

              <p className={styles.switchRow}>
                Didn't get it?{' '}
                <button 
                  type="button" 
                  className={styles.switchBtn} 
                  onClick={() => { setStep(0); setLoading(false); }}
                >
                  Resend link
                </button>
              </p>
            </div>
          )}

          {/* STEP 2: ERROR MESSAGE */}
          {step === 2 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
              <h2 className={styles.formTitle}>Connection Error</h2>
              <p className={styles.formSub}>Please check your internet connection and try again.</p>
              
              <button 
                className={styles.submitBtn} 
                style={{ marginTop: '1.5rem' }} 
                onClick={() => { setStep(0); setLoading(false); }}
              >
                Try Again
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Forgot;