
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

inventoryRoute.post('/update', async (req, res) => {
    const { art_id, stock } = req.query;
    // @ts-ignore
    if(!art_id || isNaN(stock)) {
        res.status(requestType.badRequest).send('NOT OK!');
        return;
    }
    const updateInventoryArticleResponse = await db.updateInventoryArticle({art_id: art_id as string, stock: Math.floor(Number(stock))});
    if(!updateInventoryArticleResponse) {
        res.status(requestType.notFound).send();
    }
    res.send(updateInventoryArticleResponse);
});

inventoryRoute.post('/create', async (req, res) => {
    const { name, stock } = req.query;
    // @ts-ignore
    if(!name || isNaN(stock)) {
        res.status(requestType.badRequest).send('NOT OK!');
        return;
    }
    const createArticleResponse = await db.createInventoryArticle({name: name as string, stock: Math.floor(Number(stock))});
    if(!createArticleResponse) {
        res.status(requestType.notFound).send();
    }
    res.send(createArticleResponse);

})


