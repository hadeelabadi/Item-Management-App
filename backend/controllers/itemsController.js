//controllers/
const Item = require('../models/item');

const addItem = async (req, res) => {
  try {
    const { name, description, mobileNumber } = req.body;
    const newItem = new Item({ name, description, mobileNumber });
    await newItem.save();
    res.status(201).json({ message: 'Item added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding item' });
  }
};

const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, mobileNumber } = req.body;
    await Item.findByIdAndUpdate(id, { name, description, mobileNumber });
    res.status(200).json({ message: 'Item updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating item' });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    await Item.findByIdAndDelete(id);
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting item' });
  }
};

const getAllItems = async (_req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching items' });
  }
};

module.exports = {
  addItem,
  updateItem,
  deleteItem,
  getAllItems,
};
