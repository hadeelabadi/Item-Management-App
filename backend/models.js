// backend/models.js
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    validate: {
      validator: async function (value) {
        try {
          const response = await axios.post('http://localhost:5000/validate', { mobileNumber: value });
          return response.status === 200;
        } catch (error) {
          return false;
        }
      },
      message: props => 'Invalid mobile number',
    },
    required: true,
  },
});


