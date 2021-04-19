<template>
    <div class="buy-product">
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
            BUY
        </button>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class BuyProduct extends Vue {
    @Prop() product!: {
        name: string;
        availability: number;
    };

    public amountToBuy = null;
    public buyProduct(): void {
        if(!this.amountToBuy) {
            return;
        }
        this.$emit('buy-product', { product: this.product.name, amount: this.amountToBuy})
        this.amountToBuy = null;
    }
}
</script>