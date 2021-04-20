<template>
    <div>
        <div class="action-control" v-if="product">
            <input 
                type="number" 
                :max="product.availability" 
                name="buy" 
                id="buy" 
                v-model="amountToBuy"
            >
            <button 
                type="button" 
                @click="buyProduct"
            >
                <slot></slot>
            </button>
        </div>
        <div class="action-control" v-if="inventoryArticle">
            <input 
                type="number" 
                min="0"
                name="update" 
                id="update" 
                v-model="newArticleAmount"
            >
            <button 
                type="button" 
                @click="updateInventoryArticle"
            >
                <slot></slot>
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { ProductArticle } from '../types/types';

@Component
export default class ActionControl extends Vue {
    @Prop() inventoryArticle!: {art_id: string; stock: number};
    @Prop() product!: {
        name: string;
        availability: number;
    };

    public amountToBuy = null;
    public newArticleAmount: number | null = null;

    public mounted(): void {
        if(this.inventoryArticle) {
            this.newArticleAmount = this.inventoryArticle.stock;
        }
    }

    public buyProduct(): void {
        if(!this.amountToBuy) {
            return;
        }
        this.$emit('buy-product', { product: this.product.name, amount: this.amountToBuy})
        this.amountToBuy = null;
    }

    public updateInventoryArticle(): void {
        if(this.newArticleAmount === null) {
            return;
        }
        this.$emit('update-inventory-article', { art_id: this.inventoryArticle.art_id, stock: this.newArticleAmount});
    }
}
</script>