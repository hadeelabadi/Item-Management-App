// backend/deleteItem.js
const express = require('express');
const router = express.Router();
const Item = require('./models');

router.delete('/delete/:id', async (req, res) => {
  const itemId = req.params.id;

  try {
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    await item.remove();
    return res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'An error occurred' });
  }
});

module.exports = router;
