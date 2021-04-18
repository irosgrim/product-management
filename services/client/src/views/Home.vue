<template>
  <div class="home">
    <form action="">
        <div class="position-relative">
            <input type="text" class="search-bar" placeholder="search in products">
            <button type="button" class="position-absolute position-right clear-btn ">
                x
            </button>
        </div>
        <nav class="search-nav">
            <ul class="d-flex no-list-style search-buttons">
                <li>
                    <button type="button" class="active">
                        Products
                    </button>
                </li>
                <li class="">
                    <button type="button">
                        Inventory
                    </button>
                </li>
            </ul>
        </nav>
        <section class="text-color-light">
            showing 100 out of 1000
        </section>
        <main>
            <nav class="secondary-nav">
                <button type="button">
                    + Add new product
                </button>
            </nav>
            <ProductsTable />
            <InventoryTable />
        </main>
    </form>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({
    components: {
        ProductsTable: () => import(/* webpackChunkName: "ProductsComponent" */ '../components/ProductsTable.vue'),
        InventoryTable: () => import(/* webpackChunkName: "ProductsComponent" */ '../components/InventoryTable.vue')
    }
})
export default class Home extends Vue {

}
</script>

<style lang="scss">
    @import '@/styles/home.scss';
</style>