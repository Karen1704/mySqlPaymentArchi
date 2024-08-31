const db = require('../db');

class Transaction {
    static async create(senderId, recipientId, amount) {
        try {
            const [result] = await db.query(
                'INSERT INTO transactions (sender_id, recipient_id, amount) VALUES (?, ?, ?)',
                [senderId, recipientId, amount]
            );
            return result;
        } catch (error) {
            throw new Error('Error creating transaction');
        }
    }

    static async getByUserId(userId) {
        try {
            const [rows] = await db.query(
                'SELECT * FROM transactions WHERE sender_id = ? OR recipient_id = ?',
                [userId, userId]
            );
            return rows;
        } catch (error) {
            throw new Error('Error retrieving transactions');
        }
    }
}

module.exports = Transaction;
