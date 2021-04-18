
import { db } from '../db/connect';

import express from 'express';
import Router from 'express';
import { requestType } from '../helpers/routes';
export const inventoryRoute = Router();

inventoryRoute.get('/', async (req, res: express.Response) => {
    const inventory = await db.getAllInventory();
    res.send(inventory);
});

inventoryRoute.get('/:itemId', async (req, res) => {
    const itemId = req.params.itemId;
    if(!itemId) {
        res.status(requestType.badRequest).send();
    }
    const item =  await db.getInventoryItemById(itemId);
    if(!item) {
        res.status(requestType.notFound).send();
    }
    res.send(item);
});

inventoryRoute.get('/search/:partialArticleName', async (req, res) => {
    const partialArticleName = req.params.partialArticleName;
    if(!partialArticleName) {
        res.status(requestType.badRequest).send();
    }
    const item =  await db.getInventoryArticlesByName(partialArticleName);
    if(!item) {
        res.status(requestType.notFound).send();
    }
    res.send(item);
})


