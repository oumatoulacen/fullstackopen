const testRouter = require('express').Router();
const User = require('../models/user');
const Blog = require('../models/blog');

testRouter.post('/reset', async (req, res) => {
    try {
        await User.deleteMany({});
        await Blog.deleteMany({});
        res.status(204).end();
    } catch (error) {
        console.error('Error resetting database:', error);
        res.status(500).json({ error: 'Failed to reset database' });
    }
});

module.exports = testRouter;