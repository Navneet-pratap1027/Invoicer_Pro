/* eslint-disable */
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { reset } from '../../actions/auth';
import styles from '../Login/Login.module.css';
// ✅ MUI v4 Spinner
import CircularProgress from '@material-ui/core/CircularProgress';

const EyeOpen = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const Reset = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const { token } = useParams();
  const user = JSON.parse(localStorage.getItem('profile'));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(reset({ password, token }, history));
    
    // Safety timeout in case of redirect delay
    setTimeout(() => setLoading(false), 2000);
  };

  if (user) history.push('/dashboard');

  return (
    <div className={styles.page} style={{ justifyContent: 'center' }}>
      <div className={styles.right} style={{ width: '100%', borderLeft: 'none' }}>
        <div className={styles.formBox}>
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
          
          <h2 className={styles.formTitle}>Reset Password</h2>
          <p className={styles.formSub}>Enter your new secure password below</p>
          
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>New Password</label>
              <div className={styles.inputWrap}>
                <input
                  className={styles.input}
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPassword((p) => !p)} tabIndex={-1}>
                  {showPassword ? <EyeOff /> : <EyeOpen />}
                </button>
              </div>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? (
                <CircularProgress size={18} style={{ color: '#fff' }} />
              ) : (
                'Set New Password'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Reset;