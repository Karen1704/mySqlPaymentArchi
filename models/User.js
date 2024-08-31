const db = require('../db');

class User {
    static async create(username, password) {
        try {
            const [result] = await db.query(
                'INSERT INTO users (username, password, balance) VALUES (?, ?, ?)',
                [username, password, 0]
            );
            return result;
        } catch (error) {
            throw new Error('Error creating user');
        }
    }

    static async findByUsername(username) {
        try {
            const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
            return rows[0];
        } catch (error) {
            throw new Error('Error finding user');
        }
    }

    static async updateBalance(userId, amount) {
        try {
            const [result] = await db.query(
                'UPDATE users SET balance = balance + ? WHERE id = ?',
                [amount, userId]
            );
            return result;
        } catch (error) {
            throw new Error('Error updating balance');
        }
    }
}

module.exports = User;
