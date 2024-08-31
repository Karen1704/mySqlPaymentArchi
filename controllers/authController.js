const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findByUsername(username);
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await User.create(username, hashedPassword);

        const token = jwt.sign({ id: result.insertId }, 'secretKey', { expiresIn: '1h' });

        res.status(201).json({
            user: {
                id: result.insertId,
                username
            },
            token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findByUsername(username);
        if (!user) return res.status(400).json({ message: 'Invalid username or password' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid username or password' });

        const token = jwt.sign({ id: user.id }, 'secretKey', { expiresIn: '1h' });

        res.json({
            user: {
                id: user.id,
                username: user.username
            },
            token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
