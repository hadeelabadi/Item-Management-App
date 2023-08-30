//app.js
import express from 'express';
import { connect, connection as _connection, Schema, model } from 'mongoose';
import cors from 'cors';
import { post } from 'axios';
import { json as _json } from 'body-parser'; 


const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: 'http://localhost:3000', 
  optionsSuccessStatus: 200,
};

app.options('*', cors(corsOptions));

app.use(cors(corsOptions));
app.get('/', (_req, res) => {
  res.send('Hello, this is your backend server.');
});

app.use(json());

const MONGODB_URI = 'mongodb+srv://mongo:mongo123@cluster0.wwefwmu.mongodb.net/'; 
connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const connection = _connection;
connection.once('open', () => {
  console.log('MongoDB connection established successfully');
});

const NUMVERIFY_API_KEY = '71ce26a07d1f51e4b795320d00e8b5e6';

app.use(_json());
//Define the Item schema
const itemSchema = new Schema({
  name: String,
  description: String,
  mobileNumber: String,
});

// Create the Item model using the schema
const Item = model('Item', itemSchema);

//validate
app.post('/validate', async (req, res) => {
  console.log('Request received at /validate');
  const { mobileNumber } = req.body;

  try {
    console.log('Calling Numverify API...');
    const response = await post(`http://apilayer.net/api/validate`, null, {
      params: {
        access_key: NUMVERIFY_API_KEY,
        number: mobileNumber,
      },
    });
    console.log('Numverify API response:', response.data);

    const { valid, country_code, country_name, carrier } = response.data;

    if (valid) {
      const result = {
        countryCode: country_code,
        countryName: country_name,
        operatorName: carrier,
      };
      res.json(result);
    } else {
      res.status(400).json({ error: 'Invalid mobile number' });
    }
  } catch (error) {
    console.error('Error calling Numverify API:', error);
    res.status(500).json({ error: 'An error occurred while processing the request' });
  }
});




// Define the /add endpoint
app.post('/add', async (req, res) => {
  const { name, description, mobileNumber } = req.body;

  try {
    console.log('Received data:', { name, description, mobileNumber });

    if (mobileNumber) {
      const validationResponse = await post('http://localhost:5000/validate', {
        mobileNumber,
      });

      if (!validationResponse.data.valid) {
        return res.status(400).json({ error: 'Invalid mobile number' });
      }
    }

    const newItem = new Item({
      name,
     description,
      mobileNumber,
    });

    await newItem.save();

    res.json({ message: 'Item added successfully' });
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ error: 'An error occurred while adding the item' });
  }
});

// Define the /update/:id endpoint
    app.put('/update/:id', async (req, res) => {
    const { name, description, mobileNumber } = req.body;
    const itemId = req.params.id;
  
    try {
      const updatedItem = await Item.findByIdAndUpdate(
        itemId,
        { name, description, mobileNumber },
        { new: true }
      );
  
      res.json(updatedItem);
    } catch (error) {
      console.error('Error updating item:', error);
      res.status(500).json({ error: 'An error occurred while updating the item' });
    }
  });
  
  // Define the /delete/:id endpoint
  app.delete('/delete/:id', async (req, res) => {
    const itemId = req.params.id;
  
    try {
      await Item.findByIdAndRemove(itemId);
  
      res.json({ message: 'Item deleted successfully' });
    } catch (error) {
      console.error('Error deleting item:', error);
      res.status(500).json({ error: 'An error occurred while deleting the item' });
    }
  });
  
  app.get('/all', async (_req, res) => {
    try {
      const items = await Item.find();
      res.json(items);
    } catch (error) {
      console.error('Error fetching items:', error);
      res.status(500).json({ error: 'An error occurred while fetching items' });
    }
  });
  
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  