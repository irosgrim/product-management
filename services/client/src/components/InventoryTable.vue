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
            <li class="row">
            <button type="button">
                <ul class="d-flex flex-wrap w-100 justify-content-between no-list-style no-pointer-events">
                    <li>
                        <ul class="d-flex no-list-style">
                            <li>1</li>
                            <li class="ml-3">The name of the article</li>
                        </ul>
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
export default class InventoryTable extends Vue {
    @Prop() public inventory!: any;
}
</script>