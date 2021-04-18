<template>
    <div>
        <nav class="secondary-nav">
            <button type="button">
                + Add new product
            </button>
        </nav>
        <div v-if="showModal" class="modal-bg" @click="showModal = false">
            <div class="modal-frame">
                <h3>Components</h3>
                <ul class="no-list-style w-100 text-left components-table">
                    <li>
                        <ul class="d-flex justify-content-between no-list-style text-left text-bold">
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
            </div>
        </div>
        <ul class="no-list-style table">
            <li class="row table-heading">
                <ul class="d-flex flex-wrap w-100 justify-content-between no-list-style text-bold">
                    <li>Product name</li>
                    <li>Availability</li>
                </ul>
            </li>
                <li class="row" v-for="(product, productIndex) in products" :key="productIndex">
                <button type="button" @click="showProductDetails(product.name)">
                    <ul class="d-flex flex-wrap w-100 justify-content-between no-list-style no-pointer-events">
                        <li>
                            {{product.name}}
                        </li>
                        <li class="availability">
                            <div class="d-flex justify-content-end align-items-center">
                                <span class="text-bold">{{product.potential_availability}} </span><span> pcs</span>
                                <div class="availability-indicator ml-3" :class="getAvailabilityStatus(product.potential_availability)"></div>
                            </div>
                        </li>
                    </ul>
                </button>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { endpoints } from '../api/endpoints';
import { getAvailabilityStatus } from '../helpers/text';
import { AvailabilityIndicator } from '../types/types'

const api = endpoints.loadEndpoints();

@Component
export default class ProductsTable extends Vue {
    @Prop({default: () => []}) public products!: any[];
    public productDetails = {};
    public showModal = false;

    public getAvailabilityStatus(amount: number): AvailabilityIndicator {
        return getAvailabilityStatus(amount);
    }

    public async showProductDetails(productName: string) {
        const getProductWithNameResponse = await api.getProductWithName(productName);
        if(getProductWithNameResponse) {
            this.productDetails = getProductWithNameResponse;
            this.showModal = true;
        }
    }
}
</script>