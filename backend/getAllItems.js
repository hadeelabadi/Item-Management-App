//getAllItems.js
const express = require('express');
const router = express.Router();
const Item = require('./models'); 

router.get('/all', async (_req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'An error occurred while fetching items' });
  }
});

module.exports = router;
