<template>
    <div>
        <nav class="secondary-nav">
            <button 
                type="button" 
                @click="openCreateNewProductModal"
            >
                + Create new product
            </button>
        </nav>
        <Modal 
            v-if="showProductDetailsModal" 
            @close-modal="showProductDetailsModal = false"
        >
            <h4 class="mb-3">
                Components for {{productDetails.name}}
            </h4>
            <ul class="no-list-style w-100 text-left components-table">
                <li>
                    <ul class="d-flex justify-content-between no-list-style text-left text-bold color-heading">
                        <li class="col-3">Id</li>
                        <li class="col-3">Name</li>
                        <li class="col-3 text-right">Amount of</li>
                        <li class="col-3 text-right">Stock</li>
                    </ul>
                </li>
                <li v-for="product in productDetails.contain_articles" :key="product.art_id">
                    <ul class="d-flex justify-content-between no-list-style text-left">
                        <li class="col-3">{{product.art_id}}</li>
                        <li class="col-3">{{product.name}}</li>
                        <li class="col-3 text-right">{{product.amount_of}}</li>
                        <li class="col-3 text-right">{{product.stock}}</li>
                    </ul>
                </li>
            </ul>
        </Modal>
        <Modal 
            v-if="showAddNewProductModal"  
            @close-modal="showAddNewProductModal = false"
        >
            <h4 class="mb-3">
                Create a new product
            </h4>
            <form 
                v-if="newProduct" 
                @submit.prevent="submitNewProduct"
            >
                <div class="d-flex flex-column text-left mb-3">
                    <label for="productName">
                        Product name
                    </label>
                    <input 
                        type="text" 
                        id="productName" 
                        name="productName" 
                        v-model="newProduct.productName"
                    >
                </div>
                <div class="text-left">
                    <div>
                        Contains components
                    </div>
                    <ul class="no-list-style component-list">
                        <li 
                            class="d-flex justify-content-between align-items-center" 
                            v-for="(component, componentIndex) in allInventory" 
                            :key="component.art_id"
                        >
                            <button 
                                type="button"
                            >
                                {{component.name}}
                            </button>
                            <input 
                                v-if="newProduct.containArticles" 
                                type="number"
                                max="100"
                                style="height: 30px; max-width: 80px" 
                                v-model="newProduct.containArticles[componentIndex].amount_of"
                            >
                        </li>
                    </ul>
                </div>
                <div class="d-flex justify-content-between">
                    <button class="p-x-3">CANCEL</button>
                    <button class="p-x-3" type="submit">CREATE</button>
                </div>
            </form>

        </Modal>
        <ul class="no-list-style table">
            <li class="row table-heading">
                <ul class="d-flex flex-wrap w-100 justify-content-between no-list-style text-bold">
                    <li>Product name</li>
                    <li>Availability</li>
                </ul>
            </li>
            <li class="row" v-for="(product, productIndex) in products" :key="productIndex">
                <ul class="d-flex flex-wrap w-100 justify-content-between no-list-style">
                    <li style="width: 80%; display:block">
                        <button 
                            type="button" 
                            @click="showProductDetails(product.name)" 
                            class="w-100 text-left row-button info-button"
                        >
                            {{product.name}}
                        </button>
                    </li>
                    <li class="availability">
                        <div class="d-flex justify-content-end align-items-center h-100">
                            <span class="text-bold">
                                {{product.potential_availability}} 
                            </span>
                            <span> pcs</span>
                            <div class="availability-indicator ml-3 mr-3" :class="getAvailabilityStatus(product.potential_availability)"></div>
                            <BuyProduct 
                                @buy-product="buyProduct" 
                                :product="{name: product.name, availability: product.potential_availability}"
                            />
                        </div>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { endpoints } from '../api/endpoints';
import { getAvailabilityStatus } from '../helpers/text';
import { AvailabilityIndicator, CreateNewProduct, DetailedProduct, InventoryItem, ProductAndAvailability } from '../types/types';
import BuyProduct from '../components/BuyProduct.vue';

const api = endpoints.loadEndpoints();

@Component({
    components: {
        Modal: () => import(/* webpackChunkName: "Modal" */ '../components/Modal.vue'),
        BuyProduct
    }
})
export default class ProductsTable extends Vue {
    @Prop({default: () => []}) public products!: ProductAndAvailability[];
    public productDetails!: DetailedProduct;
    public showProductDetailsModal = false;
    public showAddNewProductModal = false;
    public allInventory: InventoryItem[] = [];
    public newProduct: CreateNewProduct = {
        productName: '',
        containArticles: []
    }

    public getAvailabilityStatus(amount: number): AvailabilityIndicator {
        return getAvailabilityStatus(amount);
    }

    public async showProductDetails(productName: string): Promise<void> {
        const getProductWithNameResponse = await api.getProductWithName(productName);
        if(getProductWithNameResponse) {
            this.productDetails = getProductWithNameResponse;
            this.showProductDetailsModal = true;
        }
    }

    public async openCreateNewProductModal(): Promise<void> {
        const getAllInventoryResponse = await api.getAllInventory();
        this.allInventory = getAllInventoryResponse;
        const remapedInventory: {art_id: string; amount_of: number | null}[] =  getAllInventoryResponse.map(x => {
            return {
                art_id: x.art_id,
                amount_of: null
            }
        });
        this.newProduct.containArticles = [...this.newProduct.containArticles, ...remapedInventory];
        this.showAddNewProductModal = true;
    }

    public async submitNewProduct(): Promise<void> {
        const newProduct: CreateNewProduct = {
            productName: this.newProduct.productName,
            containArticles: this.newProduct.containArticles.filter(article => article.amount_of !== null && article.amount_of > 0 )
        };
        const sendProductResponse = await api.submitNewProduct(newProduct);
        if(!sendProductResponse) {
            alert('Could not add new product!');
        } else {
            this.emitRefreshProducts();
        }
        const newEmptyProduct = {
            productName: '',
            containArticles: []
        }
        Object.assign(this.newProduct, newEmptyProduct);
        this.showAddNewProductModal = false;
    }

    public async buyProduct(product: {product: string; amount: number}): Promise<void> {
        const buyProductResponse = await api.buyProduct(product);
        if(!buyProductResponse) {
            alert('Could not buy the product');
            return;
        }
        this.emitRefreshProducts();
    }

    public emitRefreshProducts(): void {
        this.$emit('refresh-products');
    }
}
</script>