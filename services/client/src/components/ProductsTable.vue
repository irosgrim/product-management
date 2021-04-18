<template>
    <ul class="no-list-style table">
        <li class="row table-heading">
            <ul class="d-flex flex-wrap w-100 justify-content-between no-list-style text-bold">
                <li>product nam1</li>
                <li>availability</li>
            </ul>
        </li>
            <li class="row">
            <button type="button">
                <ul class="d-flex flex-wrap w-100 justify-content-between no-list-style no-pointer-events">
                    <li>
                        product nam2
                    </li>
                    <li class="availability">
                        <div class="d-flex justify-content-end align-items-center">
                            <span class="text-bold">10 </span><span> pcs</span>
                            <div class="availability-indicator high ml-3"></div>
                        </div>
                    </li>
                </ul>
            </button>
        </li>
    </ul>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class ProductsTable extends Vue {
    @Prop({default: () => []}) public products!: any[];
}
</script>