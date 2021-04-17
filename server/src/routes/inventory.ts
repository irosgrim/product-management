
import { db } from '../db/connect';

import express from 'express';
import Router from 'express';
import { requestType } from '../helpers/routes';
export const inventoryRoute = Router();

inventoryRoute.get('/', async (req, res: express.Response, next) => {
    const inventory = await db.getAllInventory();
    res.send(inventory);
})

inventoryRoute.get('/:itemId', async (req, res, next) => {
    const itemId = req.params.itemId;
    if(!itemId) {
        res.status(requestType.badRequest);
    }
    const item =  await db.getInventoryItemById(itemId);
    if(!item) {
        res.status(requestType.notFound);
    }
    res.send(item);
})

inventoryRoute.get('/search/:str', async (req, res, next) => {
    const searchString = req.params.str;
    if(!searchString) {
        res.status(requestType.badRequest);
    }
    const item =  await db.getInventoryArticlesByName(searchString);
    if(!item) {
        res.status(requestType.notFound);
    }
    res.send(item);
})


