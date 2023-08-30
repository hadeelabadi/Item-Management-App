// backend/items.js
const express = require('express');
const router = express.Router();
const Item = require('./models');

router.post('/add', async (req, res) => {
  const { name, description, mobileNumber } = req.body;

  try {
    const newItem = new Item({
      name,
      description,
      mobileNumber,
    });

    console.log('Creating new item:', newItem);

    await newItem.save();
    console.log('Item saved successfully');
    return res.json({ message: 'Item added successfully' });
  } catch (error) {
    console.error('Error adding item:', error); 
    return res.status(500).json({ error: 'An error occurred' });
  }
});
module.exports = router;
