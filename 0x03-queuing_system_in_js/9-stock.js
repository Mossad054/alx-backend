import express from 'express';
import redis from 'redis';
import { promisify } from 'util';

// Create an Express app
const app = express();

// Create a Redis client
const client = redis.createClient();

// Promisify Redis functions
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

// List of products
const listProducts = [
  { itemId: 1, itemName: 'Suitcase 250', price: 50, initialAvailableQuantity: 4 },
  { itemId: 2, itemName: 'Suitcase 450', price: 100, initialAvailableQuantity: 10 },
  { itemId: 3, itemName: 'Suitcase 650', price: 350, initialAvailableQuantity: 2 },
  { itemId: 4, itemName: 'Suitcase 1050', price: 550, initialAvailableQuantity: 5 }
];

// Function to get item by ID
const getItemById = (id) => {
  return listProducts.find(product => product.itemId === parseInt(id));
};

// Function to reserve stock in Redis
const reserveStockById = async (itemId, stock) => {
  await setAsync(`item.${itemId}`, stock);
};

// Function to get current reserved stock from Redis
const getCurrentReservedStockById = async (itemId) => {
  const stock = await getAsync(`item.${itemId}`);
  return stock ? parseInt(stock) : null;
};

// Route: List all products
app.get('/list_products', (req, res) => {
  res.json(listProducts);
});

// Route: Get product details and current stock
app.get('/list_products/:itemId', async (req, res) => {
  const itemId = req.params.itemId;
  const product = getItemById(itemId);

  if (!product) {
    return res.json({ status: 'Product not found' });
  }

  const currentStock = await getCurrentReservedStockById(itemId);
  const availableQuantity = currentStock !== null ? currentStock : product.initialAvailableQuantity;

  res.json({
    ...product,
    currentQuantity: availableQuantity,
  });
});

// Route: Reserve a product
app.get('/reserve_product/:itemId', async (req, res) => {
  const itemId = req.params.itemId;
  const product = getItemById(itemId);

  if (!product) {
    return res.json({ status: 'Product not found' });
  }

  const currentStock = await getCurrentReservedStockById(itemId);
  const availableQuantity = currentStock !== null ? currentStock : product.initialAvailableQuantity;

  if (availableQuantity <= 0) {
    return res.json({ status: 'Not enough stock available', itemId });
  }

  // Reserve one item
  await reserveStockById(itemId, availableQuantity - 1);

  res.json({ status: 'Reservation confirmed', itemId });
});

// Server listening on port 1245
const PORT = 1245;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

