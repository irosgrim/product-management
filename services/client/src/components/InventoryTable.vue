<template>
    <ul class="no-list-style table">
        <li class="row table-heading">
            <ul class="d-flex flex-wrap w-100 justify-content-between no-list-style text-bold">
                <li>
                    <ul class="d-flex no-list-style">
                        <li>Id</li>
                        <li class="ml-3">Article name</li>
                    </ul>
                </li>
                <li>Stock</li>
            </ul>
        </li>
        <li class="row" v-for="article in inventory" :key="article.art_id">
            <button type="button">
                <ul class="d-flex flex-wrap w-100 justify-content-between no-list-style no-pointer-events">
                    <li>
                        <ul class="d-flex no-list-style">
                            <li>{{ article.art_id }}</li>
                            <li class="ml-3">{{ article.name }}</li>
                        </ul>
                    </li>
                    <li class="availability">
                        <div class="d-flex justify-content-end align-items-center">
                            <span class="text-bold">{{ article.stock }} </span><span> pcs</span>
                            <div class="availability-indicator ml-3" :class="getAvailabilityStatus(article.stock)"></div>
                        </div>
                    </li>
                </ul>
            </button>
        </li>
    </ul>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { getAvailabilityStatus } from '../helpers/text';
import { AvailabilityIndicator } from '../types/types'

@Component
export default class InventoryTable extends Vue {
    @Prop() public inventory!: any[];


    public getAvailabilityStatus(amount: number): AvailabilityIndicator {
        return getAvailabilityStatus(amount);

    }
}
</script>