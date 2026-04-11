import React, { useState, useEffect, useRef } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import decode from 'jwt-decode'
import styles from './Header.module.css'

// ✅ MUI v4 Core Components (Icons folder se hata kar yahan dala)
import Button from '@material-ui/core/Button'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import Paper from '@material-ui/core/Paper'
import Popper from '@material-ui/core/Popper'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import Avatar from '@material-ui/core/Avatar'

const Header = () => {
    const dispatch = useDispatch()
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')))
    const history = useHistory()
    const location = useLocation()
    const [open, setOpen] = useState(false)
    const anchorRef = useRef(null)

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem('profile')))
    }, [location])

    const logout = () => {
        dispatch({ type: 'LOGOUT' })
        history.push('/')
        setUser(null)
    }

    useEffect(() => {
        const token = user?.token
        if (token) {
            const decodedToken = decode(token)
            if (decodedToken.exp * 1000 < new Date().getTime()) logout()
        }
    // eslint-disable-next-line
    }, [location, user])

    const handleToggle = () => setOpen((prev) => !prev)

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) return
        setOpen(false)
    }

    const openLink = (link) => {
        history.push(`/${link}`)
        setOpen(false)
    }

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault()
            setOpen(false)
        }
    }

    const prevOpen = useRef(open)
    useEffect(() => {
        if (prevOpen.current === true && open === false) anchorRef.current?.focus()
        prevOpen.current = open
    }, [open])

    if (!user) return (
        <div className={styles.header2}>
            <img
                style={{ width: '40px', cursor: 'pointer', borderRadius: '8px' }}
                onClick={() => history.push('/')}
                src="https://i.postimg.cc/hGZKzdkS/logo.png"
                alt="InvoicerPro"
            />
            <button onClick={() => history.push('/login')} className={styles.login}>Get started</button>
        </div>
    )

    return (
        <div className={styles.header}>
            <Button
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                style={{ minWidth: 'auto', padding: '4px' }}
            >
                <Avatar style={{ backgroundColor: '#6c63ff', width: 36, height: 36, fontSize: '0.9rem', fontWeight: 700 }}>
                    {user?.result?.name?.charAt(0)}
                </Avatar>
            </Button>
            <Popper 
                open={open} 
                anchorEl={anchorRef.current} 
                role={undefined} 
                transition 
                disablePortal 
                style={{ zIndex: 1300 }}
            >
                {({ TransitionProps, placement }) => (
                    <Grow {...TransitionProps} style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}>
                        <Paper style={{ backgroundColor: '#1e1e2e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden', marginTop: '8px', minWidth: 140 }}>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                                    <MenuItem 
                                        onClick={() => openLink('settings')} 
                                        style={{ color: '#e8e8f0', fontSize: '0.9rem', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                                    >
                                        {(user?.result?.name || '').split(' ')[0]}
                                    </MenuItem>
                                    <MenuItem onClick={logout} style={{ color: '#ef4444', fontSize: '0.9rem' }}>
                                        Logout
                                    </MenuItem>
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </div>
    )
}

export default Header