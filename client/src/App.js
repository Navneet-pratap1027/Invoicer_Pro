import React from 'react';
import { BrowserRouter, Route, Switch, Redirect, useLocation } from 'react-router-dom';
import SnackbarProvider from 'react-simple-snackbar';

// Components Import
import Home from './components/Home/Home'; // ✅ Home Page Import
import Invoice from './components/Invoice/Invoice';
import Invoices from './components/Invoices/Invoices';
import InvoiceDetails from './components/InvoiceDetails/InvoiceDetails';
import ClientList from './components/Clients/ClientList';
import NavBar from './components/NavBar/NavBar';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import Settings from './components/Settings/Settings';
import Forgot from './components/Password/Forgot';
import Reset from './components/Password/Reset';

const AUTH_FREE_PATHS = ['/', '/login', '/forgot', '/reset', '/signup'];

const AppShell = () => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('profile'));
  
  // Checking if current path is an auth page (or home)
  const isAuthPage = AUTH_FREE_PATHS.includes(location.pathname) || location.pathname.startsWith('/reset/');

  return (
    <>
      {/* Navbar aur Header sirf tab dikhega jab user login ho ya auth page na ho */}
      {!isAuthPage && user && <NavBar />}
      {!isAuthPage && <Header />}
      
      <Switch>
        {/* Public Routes */}
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/forgot" component={Forgot} />
        <Route path="/reset/:token" exact component={Reset} />

        {/* ✅ Protected Routes (Sirf user login hone par access honge) */}
        {user ? (
          <>
            <Route path="/invoice" exact component={Invoice} />
            <Route path="/edit/invoice/:id" exact component={Invoice} />
            <Route path="/invoice/:id" exact component={InvoiceDetails} />
            <Route path="/invoices" exact component={Invoices} />
            <Route path="/settings" exact component={Settings} />
            <Route path="/dashboard" exact component={Dashboard} />
            <Route path="/customers" exact component={ClientList} />
          </>
        ) : (
          <Redirect to="/login" />
        )}
        
        {/* Fallback */}
        <Redirect to="/" />
      </Switch>
      
      {!isAuthPage && <Footer />}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <SnackbarProvider>
        <AppShell />
      </SnackbarProvider>
    </BrowserRouter>
  );
}

export default App;