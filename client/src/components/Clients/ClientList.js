import React, { useState, useEffect } from 'react';
import Clients from './Clients';
import AddClient from './AddClient';
import { getClientsByUser } from '../../actions/clientActions';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import NoData from '../svgIcons/NoData';
import Spinner from '../Spinner/Spinner';

const ClientList = () => {
    const history = useHistory();
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const dispatch = useDispatch();
    
    // User profile data from LocalStorage
    const user = JSON.parse(localStorage.getItem('profile'));
    
    // Redux State
    const { clients } = useSelector((state) => state.clients);
    const isLoading = useSelector(state => state.clients.isLoading);

    // 1. Redirect to Login if user is not authenticated
    useEffect(() => {
        if (!user) {
            history.push('/login');
        }
    }, [user, history]);

    // 2. Fetch clients only when user exists and location/dispatch changes
    useEffect(() => {
        if (user) {
            dispatch(getClientsByUser({ 
                search: user?.result?._id || user?.result?.googleId 
            }));
        }
    }, [location, dispatch]);

    // 3. Show Spinner while loading data
    if (isLoading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', paddingTop: '20px' }}>
                <Spinner />
            </div>
        );
    }

    // 4. Show "No Data" view if the clients list is empty
    if (!clients || clients.length === 0) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', paddingTop: '20px', margin: '80px' }}>
                <NoData />
                <p style={{ padding: '40px', color: 'gray', textAlign: 'center' }}>
                    No customers yet. Click the plus icon to add customer
                </p>
                {/* Modal included here so it can be opened via the plus icon in the header */}
                <AddClient open={open} setOpen={setOpen} currentId={currentId} setCurrentId={setCurrentId} />
            </div>
        );
    }

    // 5. Final Main View
    return (
        <div>
            <AddClient 
                open={open} 
                setOpen={setOpen} 
                currentId={currentId} 
                setCurrentId={setCurrentId} 
            />
            <Clients 
                open={open} 
                setOpen={setOpen} 
                currentId={currentId} 
                setCurrentId={setCurrentId} 
                clients={clients} 
            />
        </div>
    );
};

export default ClientList;