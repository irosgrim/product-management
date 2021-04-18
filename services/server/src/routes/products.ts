
import { db, inMemoryProducts } from '../db/connect';

import express from 'express';
import Router from 'express';
import { requestType } from '../helpers/routes';
export const productsRoute = Router();

productsRoute.get('/', async (req, res: express.Response) => {
    const products = await db.getAllProducts();
    res.send(products);
})

productsRoute.get('/:partialProductName', async (req, res,) => {
    const partialProductName = req.params.partialProductName;
    if(!partialProductName) {
        res.status(requestType.badRequest).send();
        return;
    }
    const product =  await db.getProductsWithPartialProductName(partialProductName);
    if(!product) {
        res.status(requestType.notFound).send();
        return;
    }
    res.send(product);
})

productsRoute.post('/buy', async (req, res) => {
    const {product, amount} = req.query;
    if(!product || !amount) {
        res.status(requestType.badRequest).send();
        return;
    }
    if(product && amount) {
        const buyProductResponse = await db.buyProduct((product as string), parseInt(amount as string))
        if(!buyProductResponse) {
            res.status(requestType.badRequest).send('NOT OK!');
            return;
        }
        res.status(requestType.ok).send('OK!');
        return;
    }
    res.status(requestType.ok).send('OK!');
});

productsRoute.post('/create-product', async (req, res) => {
    const { productName, containArticles } = req.body;
    if(!productName || !containArticles || containArticles.length === 0) {
        res.status(requestType.badRequest).send();
        return;
    }
    if(inMemoryProducts.filter(x => x.name === productName).length > 0) {
        res.status(requestType.badRequest).send('PRODUCT ALREADY EXISTS!')
        return;
    }
    const createProductResponse = await db.createNewProduct(productName, containArticles);
    if(!createProductResponse) {
        res.status(requestType.badRequest).send('NOT OK!');
        return;
    }
    res.status(requestType.ok).send('OK!');
}); 

