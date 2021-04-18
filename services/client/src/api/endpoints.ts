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
    public async getAllAvailability(): Promise<number[]> {
        return [1, 2, 3];
    }
    public async searchProductsByName(partialName: string): Promise<any> {
        return [];
    }
    public async searchInventoryByArticleName(partialArticleName: string): Promise<any> {
        return []
    }
    public async getAllInventory(): Promise<any[]> {
        return [];
    }
    public async getProductWithName(productName): Promise<any> {
        return;
    }
    // public async getAllProducts(): Promise<number[]> {
        
    //     return [1, 2, 3];
    // }
    // public searchProductsByName() {}
    // public getAllInventory() {}
    // public searchInventoryByArticleName() {}
    
    // public getAvailabilityForProduct() {}
}

class RealEndpoints {
    constructor() {}
    public async getAllAvailability(): Promise<any> {
        const availability = await fetch(serverBaseUrl + '/availability');
        return availability.json();
    }
    public async searchProductsByName(partialName: string): Promise<any> {
        const searchResult = await fetch(serverBaseUrl + '/availability/' + partialName);
        return searchResult.json();
    }
    public async searchInventoryByArticleName(partialArticleName: string): Promise<any> {
        const searchResult = await fetch(serverBaseUrl + '/inventory/search/' + partialArticleName);
        return searchResult.json();
    }
    public async getAllInventory(): Promise<any[]> {
        const inventoryResponse = await fetch(serverBaseUrl + '/inventory');
        const parsedInventory = await inventoryResponse.json();
        let inventoryArrayFromDictionary = [];
        for(const article in parsedInventory) {
            const inventoryArticle = {art_id: article.toString(), ...parsedInventory[article]}
            inventoryArrayFromDictionary = [...inventoryArrayFromDictionary, inventoryArticle];
        }
        return inventoryArrayFromDictionary;
    }
    public async getProductWithName(productName: string): Promise<any> {
        const searchResult = await fetch(serverBaseUrl + '/availability/' + productName);
        const searchResultParsed = await searchResult.json();
        if(searchResultParsed.length) {
            const product = searchResultParsed[0];
            const detailedProduct = {...product, contain_articles: []};
            for(const article of product.contain_articles) {
                const getInventoryItemByIdResponse = await this.getInventoryItemById(article.art_id);
                const detailedArticle = {...article, name: getInventoryItemByIdResponse.name, stock: getInventoryItemByIdResponse.stock};
                detailedProduct.contain_articles = [...detailedProduct.contain_articles, detailedArticle];
            }
            console.log(detailedProduct)
            return detailedProduct;
        }
    }

    private async getInventoryItemById(articleId: string): Promise<any> {
        const searchResult = await fetch(serverBaseUrl +'/inventory/' + articleId);
        return searchResult.json();
    }
    // public getAvailabilityForProduct() {}
    // public getAllProducts() {}
    // public getAllInventory() {}
    // public searchInventoryByArticleName() {}
        
    // }

}

export const endpoints = new Endpoints();