// backend/updateItem.js
const express = require('express');
const router = express.Router();
const Item = require('./models');

router.put('/update/:id', async (req, res) => {
  const { name, description, mobileNumber } = req.body;
  const itemId = req.params.id;

  try {
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    item.name = name;
    item.description = description;
    item.mobileNumber = mobileNumber;

    await item.save();
    return res.json({ message: 'Item updated successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'An error occurred' });
  }
});

module.exports = router;
