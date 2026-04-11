import React, { useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom'; // history add kiya
import { Fab, Action } from 'react-tiny-fab';
import 'react-tiny-fab/dist/styles.css';

// Icons sahi folder se (Stable approach)
import AddIcon from '@material-ui/icons/Add';
import CreateIcon from '@material-ui/icons/Create';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

import AddClient from '../Invoice/AddClient';

const FabButton = () => {
    const location = useLocation();
    const history = useHistory(); // History hook ka use
    const [open, setOpen] = useState(false);

    const mainButtonStyles = { backgroundColor: '#1976D2' };

    // Dashboard ya Clients page par hi ye button dikhana hai toh:
    // if(location.pathname === '/login') return null;

    return (
        <div>
            {/* Customer Add karne wala Modal */}
            <AddClient setOpen={setOpen} open={open} />

            <Fab
                mainButtonStyles={mainButtonStyles}
                icon={<AddIcon />}
                alwaysShowTitle={true}
                aria-label="Floating Action Button"
            >
                {/* New Invoice Action (Sirf tab dikhega jab hum pehle se invoice page par na hon) */}
                {location.pathname !== '/invoice' && (
                    <Action
                        text="New Invoice"
                        onClick={() => history.push('/invoice')} // Page reload nahi hoga, fast chalega
                    >
                        <CreateIcon />
                    </Action>
                )}

                {/* New Customer Action */}
                <Action
                    text="New Customer"
                    onClick={() => setOpen((prev) => !prev)}
                >
                    <PersonAddIcon />
                </Action>
            </Fab>
        </div>
    );
};

export default FabButton;