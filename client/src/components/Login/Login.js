/* eslint-disable */
import React, { useState } from 'react';
import styles from './Login.module.css';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import jwtDecode from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import { signup, signin } from '../../actions/auth';
import { createProfile } from '../../actions/profile';
import { useSnackbar } from 'react-simple-snackbar';

// ✅ MUI v4 Import
import CircularProgress from '@material-ui/core/CircularProgress';

const initialState = {
  firstName: '', lastName: '', email: '',
  password: '', confirmPassword: '', bio: '',
};

// Icons (SVG)
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

const InputField = ({ label, name, type = 'text', value, onChange, showToggle, onToggle, showPassword }) => (
  <div className={styles.inputGroup}>
    <label className={styles.inputLabel}>{label}</label>
    <div className={styles.inputWrap}>
      <input
        className={styles.input}
        name={name}
        type={showToggle ? (showPassword ? 'text' : 'password') : type}
        value={value}
        onChange={onChange}
        required
        autoComplete={name === 'password' ? 'current-password' : name}
      />
      {showToggle && (
        <button type="button" className={styles.eyeBtn} onClick={onToggle} tabIndex={-1}>
          {showPassword ? <EyeOff /> : <EyeOpen />}
        </button>
      )}
    </div>
  </div>
);

const Login = () => {
  const [formData, setFormData] = useState(initialState);
  const [isSignup, setIsSignup] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar] = useSnackbar();
  const user = JSON.parse(localStorage.getItem('profile'));
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (isSignup) {
      dispatch(signup(formData, openSnackbar, setLoading));
    } else {
      dispatch(signin(formData, openSnackbar, setLoading));
    }
  };

  const googleSuccess = async (res) => {
    try {
      const result = jwtDecode(res.credential);
      const token = res?.credential;
      dispatch(createProfile({
        name: result?.name, email: result?.email, userId: result?.jti,
        phoneNumber: '', businessName: '', contactAddress: '', logo: result?.picture, website: '',
      }));
      dispatch({ type: 'AUTH', data: { result, token } });
      window.location.href = '/dashboard';
    } catch (error) { console.log(error); }
  };

  if (user) history.push('/dashboard');

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.leftContent}>
          <div className={styles.logo}>
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
          <div className={styles.hero}>
            <h1 className={styles.heroTitle}>Invoicing that<br /><span className={styles.heroGradient}>works for you</span></h1>
            <p className={styles.heroSubtitle}>Create professional invoices, track payments, and manage clients — all in one place.</p>
          </div>
          <div className={styles.statsRow}>
            {[{ num: '10k+', label: 'Invoices sent' }, { num: '99%', label: 'Uptime' }, { num: '5min', label: 'Setup time' }].map((s) => (
              <div key={s.label} className={styles.stat}>
                <span className={styles.statNum}>{s.num}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.formBox}>
          <div className={styles.tabs}>
            <button type="button" className={`${styles.tabBtn} ${!isSignup ? styles.tabBtnActive : ''}`} onClick={() => setIsSignup(false)}>Sign In</button>
            <button type="button" className={`${styles.tabBtn} ${isSignup ? styles.tabBtnActive : ''}`} onClick={() => setIsSignup(true)}>Sign Up</button>
          </div>

          <h2 className={styles.formTitle}>{isSignup ? 'Create your account' : 'Welcome back'}</h2>
          
          <form onSubmit={handleSubmit} className={styles.form}>
            {isSignup && (
              <div className={styles.row}>
                <InputField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
                <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
              </div>
            )}
            <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} />
            
            <InputField 
              label="Password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              showToggle 
              onToggle={() => setShowPassword((p) => !p)} 
              showPassword={showPassword} 
            />

            {/* ✅ Added Confirm Password Field for Signup */}
            {isSignup && (
              <InputField 
                label="Confirm Password" 
                name="confirmPassword" 
                type="password" 
                value={formData.confirmPassword} 
                onChange={handleChange} 
              />
            )}
            
            {!isSignup && (
              <div className={styles.forgotRow}>
                <Link to="/forgot" className={styles.forgotLink}>Forgot password?</Link>
              </div>
            )}

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? <CircularProgress size={18} style={{ color: '#fff' }} /> : isSignup ? 'Create Account' : 'Sign In'}
            </button>

            <div className={styles.divider}><span /><p>or continue with</p><span /></div>

            <div className={styles.googleWrap}>
              <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
                <GoogleLogin 
                   onSuccess={googleSuccess} 
                   onError={() => console.log('Login Failed')} 
                />
              </GoogleOAuthProvider>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;