<template>
  <div class="home">
    <div>
        <div class="position-relative">
            <input 
                type="text" 
                class="search-bar" 
                :placeholder="getPlaceholder" 
                v-model="searchString"
            >
            <button 
                type="button" 
                v-if="searchString" @click="searchString = ''"
                class="position-absolute position-right clear-btn" 
            >
                x
            </button>
        </div>
        <nav class="search-nav">
            <ul class="d-flex no-list-style search-buttons">
                <li>
                    <button 
                        type="button" 
                        :class="currentViewIsActive('products')" 
                        @click="activeView = 'products'"
                    >
                        Products
                    </button>
                </li>
                <li>
                    <button 
                        type="button" 
                        :class="currentViewIsActive('inventory')" 
                        @click="activeView = 'inventory'"
                    >
                        Inventory
                    </button>
                </li>
            </ul>
        </nav>
        <section class="text-color-light">
            showing {{showResultAmount}} items out of {{showResultAmount}}
        </section>
        <main>
            <ProductsTable 
                v-if="products.length && activeView === 'products'" 
                :products="products" 
                @refresh-products="getAllProductsOrAllInventory"
            />
            <InventoryTable 
                v-if="inventory.length && activeView === 'inventory'"
                @update-inventory-article="updateInventoryArticle"
                @refresh-products="getAllProductsOrAllInventory"
                :inventory="inventory"
            />
        </main>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { endpoints } from '../api/endpoints';
import { InventoryItem, ProductAndAvailability } from '../types/types';

const api = endpoints.loadEndpoints();

export type ActiveView = "products" | "inventory";
let debounceTimer:number;


@Component({
    components: {
        ProductsTable: () => import(/* webpackChunkName: "ProductsComponent" */ '../components/ProductsTable.vue'),
        InventoryTable: () => import(/* webpackChunkName: "InventoryComponent" */ '../components/InventoryTable.vue')
    }
})
export default class Home extends Vue {

    public products: ProductAndAvailability[] = [];
    public inventory: InventoryItem[] = [];
    public activeView: ActiveView = 'products';
    public searchString = '';
    public searchInProgress = false;

    public currentViewIsActive(view: ActiveView): 'active' | null {
        return this.activeView === view ? 'active' : null;
    }

    public get getPlaceholder(): string {
        return "search in " + this.activeView;
    }

    @Watch('activeView', {immediate: true})
    public async getAllProductsOrAllInventory(): Promise<void> {
        this.searchString = '';
        if(this.activeView === 'products') {
            const getAllProductsAndAvailability = await api.getAllAvailability();
            this.products = getAllProductsAndAvailability;
        }
        if(this.activeView === 'inventory') {
            const getAllInventory = await api.getAllInventory();
            this.inventory = getAllInventory;
        }
    }

    @Watch('searchString')
    public searchStringChanged(): void {
        this.debouncedSearch();
    }

    public debouncedSearch(): void {
        clearTimeout(debounceTimer);
        debounceTimer = window.setTimeout(() => {
            this.search();
        }, 1000);
    }

    public async search(): Promise<void> {
        if(this.activeView === 'products') {
            const searchResult = await api.searchProductsByName(this.searchString);
            this.products = searchResult;
        }
        if(this.activeView === 'inventory') {
            const searchResult = await api.searchInventoryByArticleName(this.searchString);
            this.inventory = searchResult;
        }
    }

    public get showResultAmount(): number {
        switch (this.activeView) {
            case 'products':
                return this.products.length;
            case 'inventory':
                return this.inventory.length;
        }
    }

    public async updateInventoryArticle(article: {art_id: string; stock: number}): Promise<void> {
        const updateInventoryArticleResponse = await api.updateInventoryArticle(article);
        if(!updateInventoryArticleResponse) {
            return;
        }
        this.getAllProductsOrAllInventory();
    }
}
</script>

<style lang="scss">
    @import '@/styles/home.scss';
</style>