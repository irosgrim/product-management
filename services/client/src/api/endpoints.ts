import { CreateNewProduct, DetailedProduct, InventoryDictionary, InventoryItem, ProductAndAvailability } from '@/types/types';

const params = new URLSearchParams(window.location.search);
const useFakeEndpoints = params.get('fake');
const serverBaseUrl = 'http://localhost:3000'

class Endpoints {
    loadEndpoints() {
        if(useFakeEndpoints) {
            return new FakeEndpoints();
        }
        return new RealEndpoints();
    }
}

class FakeEndpoints {
    public async getAllAvailability(): Promise<ProductAndAvailability[]> {
        return [];
    }
    public async searchProductsByName(partialName: string): Promise<ProductAndAvailability[]> {
        return [];
    }
    public async searchInventoryByArticleName(partialArticleName: string): Promise<InventoryItem[]> {
        return []
    }
    public async getAllInventory(): Promise<InventoryItem[]> {
        return [];
    }
    public async getProductWithName(productName: string): Promise<DetailedProduct | undefined> {
        return ;
    }
    private async getInventoryItemById(articleId: string): Promise<{name: string; stock: number}> {
        return {name: '', stock: 1}
    }
    public async submitNewProduct(newProduct: CreateNewProduct): Promise<CreateNewProduct | undefined> {
        return;
    }
    public async buyProduct(product: {product: string; amount: number}): Promise<{product: string; amount: number} | undefined> {
        return;
    }
}

class RealEndpoints {
    constructor() {}
    public async getAllAvailability(): Promise<ProductAndAvailability[]> {
        const availability = await fetch(serverBaseUrl + '/availability');
        return availability.json();
    }
    public async searchProductsByName(partialName: string): Promise<ProductAndAvailability[]> {
        const searchResult = await fetch(serverBaseUrl + '/availability/' + partialName);
        return searchResult.json();
    }
    public async searchInventoryByArticleName(partialArticleName: string): Promise<InventoryItem[]> {
        if(partialArticleName === '') {
            const searchResult = await this.getAllInventory();
            return searchResult;
        }
        const searchResult = await fetch(serverBaseUrl + '/inventory/' + partialArticleName);
        return searchResult.json();
    }
    public async getAllInventory(): Promise<InventoryItem[]> {
        const inventoryResponse = await fetch(serverBaseUrl + '/inventory');
        const parsedInventory: InventoryDictionary = await inventoryResponse.json();
        let inventoryArrayFromDictionary: InventoryItem[] = [];

        for(const article in parsedInventory) {
            const inventoryArticle = {art_id: article.toString(), ...parsedInventory[article]}
            inventoryArrayFromDictionary = [...inventoryArrayFromDictionary, inventoryArticle];
        }

        return inventoryArrayFromDictionary;
    }
    public async getProductWithName(productName: string): Promise<DetailedProduct | undefined> {
        const searchResult = await fetch(serverBaseUrl + '/availability/' + productName);
        const searchResultParsed: ProductAndAvailability[] = await searchResult.json();

        if(searchResultParsed.length) {
            const product = searchResultParsed[0];
            const detailedProduct: DetailedProduct = {...product, contain_articles: []};
            console.log(detailedProduct);

            for(const article of product.contain_articles) {
                const getInventoryItemByIdResponse = await this.getInventoryItemById(article.art_id);
                const detailedArticle = {...article, name: getInventoryItemByIdResponse.name, stock: getInventoryItemByIdResponse.stock};
                detailedProduct.contain_articles = [...detailedProduct.contain_articles, detailedArticle];
            }

            return detailedProduct;
        }
    }

    private async getInventoryItemById(articleId: string): Promise<{name: string; stock: number}> {
        const searchResult = await fetch(serverBaseUrl +'/inventory/id/' + articleId);
        return searchResult.json();
    }

    public async submitNewProduct(newProduct: CreateNewProduct): Promise<CreateNewProduct | undefined> {
        const createNewProductResponse = await fetch(serverBaseUrl + '/products/create-product', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newProduct)
        });

        if(createNewProductResponse.status !== 200) {
            return;
        }
    
        return newProduct;
    }

    public async buyProduct(product: {product: string; amount: number}): Promise<{product: string; amount: number} | undefined> {
        const createNewProductResponse = await fetch(serverBaseUrl + `/products/buy?product=${product.product}&amount=${product.amount}`, {
            method: 'POST',
            cache: 'no-cache',
        });
        if(createNewProductResponse.status !== 200) {
            return;
        }
        return product;
    }

}

export const endpoints = new Endpoints();