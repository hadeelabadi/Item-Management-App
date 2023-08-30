import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';






function App() {
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/all');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleAddItem = async () => {
    if (!name || !description) {
      console.error('Name and description are required');
      return;
    }

    try {
      const validationResponse = await axios.post('http://localhost:5000/validate', {
        mobileNumber,
      });

      if (!validationResponse.data.valid) {
        console.error('Invalid mobile number');
        return;
      }

      await axios.post('http://localhost:5000/add', {
        name,
        description,
        mobileNumber,
      });
      fetchItems();
      setName('');
      setDescription('');
      setMobileNumber('');
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleUpdateItem = async (id) => {
    try {
      const validationResponse = await axios.post('http://localhost:5000/validate', {
        mobileNumber,
      });

      if (!validationResponse.data.valid) {
        console.error('Invalid mobile number');
        return;
      }

      await axios.put(`http://localhost:5000/update/${id}`, {
        name,
        description,
        mobileNumber,
      });

      fetchItems();
      setName('');
      setDescription('');
      setMobileNumber('');
      setEditingItem(null); // Clear the editing state
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/delete/${id}`);
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setName(item.name);
    setDescription(item.description);
    setMobileNumber(item.mobileNumber);
  };

  
  return (
    <div className="App">
      <div className="form">
        <h2>{editingItem ? 'Edit Item' : 'Add Item'}</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Mobile Number"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
        />
        {editingItem ? (
          <>
            <button onClick={() => handleUpdateItem(editingItem._id)}>Save Changes</button>
            <button onClick={() => setEditingItem(null)}>Cancel</button>
          </>
        ) : (
          <button onClick={handleAddItem}>Add Item</button>
        )}
      </div>
      <div className="items">
        <h2>Items List</h2>
        <table className="item-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Mobile Number</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>{item.mobileNumber}</td>
                <td>
                  <button onClick={() => handleEditItem(item)}>Edit</button>
                  <button onClick={() => handleDeleteItem(item._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;