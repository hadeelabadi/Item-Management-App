//routes/items.js
const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/itemsController');

// Add item route
router.post('/add', itemsController.addItem);

// Update item route
router.put('/update/:id', itemsController.updateItem);

// Delete item route
router.delete('/delete/:id', itemsController.deleteItem);

// Get all items route
router.get('/all', itemsController.getAllItems);

module.exports = router;
