const User = require('../models/User');
const Transaction = require('../models/Transaction');

exports.topUpBalance = async (req, res) => {
    const { amount } = req.body;
    const userId = req.user.id;

    if (amount <= 0) return res.status(400).json({ message: 'Amount must be greater than zero' });

    try {
        await User.updateBalance(userId, amount);
        res.json({
            message: 'Balance updated successfully',
            balanceUpdated: amount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createTransaction = async (req, res) => {
    const { recipientUsername, amount } = req.body;
    const senderId = req.user.id;

    try {
        const recipient = await User.findByUsername(recipientUsername);
        if (!recipient) return res.status(404).json({ message: 'Recipient not found' });

        const recipientId = recipient.id;

        await User.updateBalance(senderId, -amount); // Deduct from sender
        await User.updateBalance(recipientId, amount); // Add to recipient
        await Transaction.create(senderId, recipientId, amount);

        res.status(201).json({
            transaction: {
                senderId,
                recipientId,
                amount,
                createdAt: new Date().toISOString()
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserTransactions = async (req, res) => {
    const userId = req.user.id;

    try {
        const transactions = await Transaction.getByUserId(userId);
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
