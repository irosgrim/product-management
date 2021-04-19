# Product management

### To do

- [ ] use websocket to poll inventory changes
- [ ] error handling
- [ ] log server
- [ ] fix client side types
- [ ] authentication
- [ ] add new inventory


### Server

- [x] endpoints product availability:
    - [x] get all products detail and availability: `/availability`
    - [x] get product details and availability by partial name: `/availability/:partial name`
- [x] endpoint for getting inventory article by partial name: `/inventory/search/:partialArticleName`
- [x] endpoint for getting inventory article by id: `/inventory/:articleId`
- [x] endpoint for getting all inventory: `/inventory`
- [x] **POST** endpoint for creating and adding a new product: `products/create-product`
- [x] **POST** endpoint for buying a product: `/products/buy?product=productName&amount=number`
- [x] endpoint for getting specific product: `/products/:partialProductName`
- [x] endpoint for getting all products: `/products`
- [x] DB handler
- [x] create types
- [x] setup routing
- [x] setup node/express backend