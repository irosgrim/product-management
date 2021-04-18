<template>
  <div class="home">
    <form action="">
        <div class="position-relative">
            <input 
                type="text" 
                class="search-bar" 
                :placeholder="getPlaceholder" 
                v-model="searchString"
            >
            <button type="button" class="position-absolute position-right clear-btn" v-if="searchString" @click="searchString = ''">
                x
            </button>
        </div>
        <nav class="search-nav">
            <ul class="d-flex no-list-style search-buttons">
                <li>
                    <button type="button" :class="currentViewIsActive('products')" @click="activeView = 'products'">
                        Products
                    </button>
                </li>
                <li class="">
                    <button type="button" :class="currentViewIsActive('inventory')" @click="activeView = 'inventory'">
                        Inventory
                    </button>
                </li>
            </ul>
        </nav>
        <section class="text-color-light">
            showing {{showResultAmount}} items out of {{showResultAmount}}
        </section>
        <main>
            <ProductsTable v-if="products.length && activeView === 'products'" :products="products"/>
            <InventoryTable v-if="inventory.length && activeView === 'inventory'" :inventory="inventory"/>
        </main>
    </form>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { endpoints } from '../api/endpoints';

const api = endpoints.loadEndpoints();

export type ActiveView = "products" | "inventory";
let debounceTimer;


@Component({
    components: {
        ProductsTable: () => import(/* webpackChunkName: "ProductsComponent" */ '../components/ProductsTable.vue'),
        InventoryTable: () => import(/* webpackChunkName: "ProductsComponent" */ '../components/InventoryTable.vue')
    }
})
export default class Home extends Vue {

    public products: any = [];
    public inventory: any = [];
    public activeView: ActiveView = 'products';
    public searchString = '';
    public searchInProgress = false;

    public async created() {
        
    }

    public currentViewIsActive(view: ActiveView): 'active' | null {
        return this.activeView === view ? 'active' : null;
    }

    public get getPlaceholder(): string {
        return "search in " + this.activeView;
    }

    @Watch('activeView', {immediate: true})
    public async searchOnActiveViewChange() {
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
    public searchStringChanged() {
        this.debouncedSearch();
    }

    public debouncedSearch() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            this.search();
        }, 1000);
    }

    public async search() {
        if(this.activeView === 'products') {
            const searchResult = await api.searchProductsByName(this.searchString);
            this.products = searchResult;
        }
        if(this.activeView === 'inventory') {
            const searchResult = await api.searchInventoryByArticleName(this.searchString);
            this.inventory = searchResult;
        }
    }

    public get showResultAmount() {
        switch (this.activeView) {
            case 'products':
                return this.products.length;
            case 'inventory':
                return this.inventory.length;
        }
    }
    

}
</script>

<style lang="scss">
    @import '@/styles/home.scss';
</style>