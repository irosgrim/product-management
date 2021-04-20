require('dotenv').config();
export const rootDirectoryPath = __dirname;
import express from 'express';
import cors from 'cors';
import { availabilityRoute } from './routes/availability';
import { inventoryRoute } from './routes/inventory';
import { productsRoute } from './routes/products';
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(cors());

app.use('/products', productsRoute);
app.use('/inventory', inventoryRoute);
app.use('/availability', availabilityRoute);

app.get('/', (req, res) => {
    const endpoints = `
    <h3>Endpoints:</h3>
    <ul>
        <li><a href="/api/products">/api/products</a></li>
        <li><a href="/api/inventory">/api/inventory</a></li>
        <li><a href="/api/availability">/api/availability</a></li>
    </ul>
   `;
    res.send(endpoints);
})

app.listen(PORT, () => console.log("Server runnin on port ", PORT));