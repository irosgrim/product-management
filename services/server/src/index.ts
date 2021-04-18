require('dotenv').config();
export const rootDirectoryPath = __dirname;
import express from 'express';
import { availabilityRoute } from './routes/availability';
import { inventoryRoute } from './routes/inventory';
import { productsRoute } from './routes/products';
const app = express();
const PORT = 3000;
app.use(express.json());

app.use('/products', productsRoute);
app.use('/inventory', inventoryRoute);
app.use('/availability', availabilityRoute);

app.listen(PORT, () => console.log("Server runnin on port ", PORT));