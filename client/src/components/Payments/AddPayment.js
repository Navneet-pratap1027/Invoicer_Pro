import React, { useState } from 'react'
import Modal from './Modal'
import Button from '@material-ui/core/Button' // Material-UI button add kiya

const AddPayment = () => {
    // 1. Initial state ko false rakhein taaki modal shuru mein band rahe
    const [open, setOpen] = useState(false)

    return (
        <div style={{ padding: '10px 0' }}>
            {/* 2. Modal component jo aapne banaya hai */}
            <Modal open={open} setOpen={setOpen} />

            {/* 3. Ek button jo modal ko open karega */}
            <Button 
                onClick={() => setOpen(true)} 
                variant="contained" 
                style={{ 
                    backgroundColor: '#00A86B', 
                    color: 'white', 
                    textTransform: 'none',
                    fontWeight: 'bold' 
                }}
            >
                Record Payment
            </Button>
        </div>
    )
}

export default AddPayment