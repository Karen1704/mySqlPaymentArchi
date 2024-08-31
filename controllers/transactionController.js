const Transaction = require('../models/Transaction');
const User = require('../models/User');

exports.createTransaction = async (req, res) => {
    const { recipientUsername, amount } = req.body;
    const senderId = req.user.id;

    // Find recipient
    const recipient = await User.findByUsername(recipientUsername);
    if (!recipient) {
        return res.status(404).json({ message: 'Recipient not found' });
    }

    const recipientId = recipient.id;

    try {
        // Create the transaction
        const result = await Transaction.create(senderId, recipientId, amount);

        // Return the transaction details
        res.status(201).json({
            transaction: {
                id: result.insertId,
                senderId,
                recipientId,
                amount,
                createdAt: new Date().toISOString()
            }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getUserTransactions = async (req, res) => {
    const userId = req.user.id;
    const transactions = await Transaction.getByUserId(userId);
    res.json(transactions);
};
