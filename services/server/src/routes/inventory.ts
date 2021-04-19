
import { db } from '../db/connect';

import express from 'express';
import Router from 'express';
import { requestType } from '../helpers/routes';
export const inventoryRoute = Router();

inventoryRoute.get('/', async (req, res: express.Response) => {
    const inventory = await db.getAllInventory();
    res.send(inventory);
});


inventoryRoute.get('/:partialArticleName', async (req, res) => {
    const partialArticleName = req.params.partialArticleName;
    const item =  await db.getInventoryArticlesByName(partialArticleName);
    if(!item) {
        res.status(requestType.notFound).send();
    }

    res.send(item);
})

inventoryRoute.get('/id/:itemId', async (req, res) => {
    const itemId = req.params.itemId;
    if(!itemId) {
        res.status(requestType.badRequest).send();
    }

    const inventoryItemResponse =  await db.getInventoryItemById(itemId);
    if(!inventoryItemResponse) {
        res.status(requestType.notFound).send();
    }

    res.send(inventoryItemResponse);
});


