// Input validation helpers
export const validateInvoice = (req, res, next) => {
    const { client, items, creator } = req.body
    if (!creator || (Array.isArray(creator) && creator.length === 0)) {
        return res.status(400).json({ message: 'Invoice must have a creator' })
    }
    if (!client || !client.name) {
        return res.status(400).json({ message: 'Invoice must have a client name' })
    }
    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'Invoice must have at least one item' })
    }
    next()
}

export const validateClient = (req, res, next) => {
    const { name, email } = req.body
    if (!name || name.trim() === '') {
        return res.status(400).json({ message: 'Client name is required' })
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: 'Invalid email address' })
    }
    next()
}

export const validateSignup = (req, res, next) => {
    const { email, password, confirmPassword, firstName, lastName } = req.body
    if (!firstName || !lastName) {
        return res.status(400).json({ message: 'First and last name are required' })
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: 'Valid email is required' })
    }
    if (!password || password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords don't match" })
    }
    next()
}

export const validateSignin = (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' })
    }
    next()
}
