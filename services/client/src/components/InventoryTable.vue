<template>
    <div>
        <nav class="secondary-nav text-right">
            <button 
                type="button" 
                @click="showAddNewArticleModal = true"
            >
                + Add new inventory
            </button>
        </nav>
        <Modal 
            v-if="showAddNewArticleModal"  
            @close-modal="clearNewArticle"
        >
            <h4 class="mb-3">
                Create a new article
            </h4>
            <form 
                v-if="newArticle" 
                @submit.prevent="submitNewInventoryArticle"
            >
                <div class="d-flex justify-content-between">
                    <div class="d-flex flex-column text-left mb-3 w-100">
                        <label for="articleName">
                            Article name
                        </label>
                        <input 
                            type="text" 
                            id="articleName" 
                            name="articleName" 
                            v-model="newArticle.name"
                        >
                    </div>
                    <div class="d-flex flex-column text-left mb-3 ml-3">
                        <label for="stock">
                            Stock
                        </label>
                        <input 
                            type="number"
                            min="0"
                            id="stock" 
                            name="stock" 
                            v-model="newArticle.stock"
                        >
                    </div>
                </div>
                <div class="d-flex justify-content-between">
                    <button class="p-x-3" @click="clearNewArticle">CANCEL</button>
                    <button class="p-x-3" type="submit">CREATE</button>
                </div>
            </form>
        </Modal>
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
            <li class="row d-flex justify-content-between align-items-center flex-wrap w-100" v-for="article in inventory" :key="article.art_id">
                <div class="d-flex flex-wrap justify-content-between align-items-center" style="flex-grow: 1; min-width: 80%">
                    <div class="d-flex" style="justify-content: flex-start;">
                        <div>{{ article.art_id }}</div>
                        <div class="ml-3">{{ article.name }}</div>
                    </div>
                    <div class="d-flex justify-content-end align-items-center stock flex-wrap">
                        <span class="text-bold">{{ article.stock }} </span><span> pcs</span>
                        <div class="availability-indicator ml-3" :class="getAvailabilityStatus(article.stock)"></div>
                    </div>
                </div>
                <div class="d-flex justify-content-end action-control-container">
                    <ActionControl 
                        @update-inventory-article="$emit('update-inventory-article', $event)" 
                        :inventoryArticle="{ art_id: article.art_id, stock: article.stock }"
                    >
                        UPDATE
                    </ActionControl>
                </div>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { getAvailabilityStatus } from '../helpers/text';
import { AvailabilityIndicator, InventoryItem } from '../types/types'
import ActionControl from '../components/ActionControl.vue';
import { endpoints } from '../api/endpoints';

const api = endpoints.loadEndpoints();

@Component({
    components: {
        ActionControl,
        Modal: () => import("../components/Modal.vue"),
    }
})
export default class InventoryTable extends Vue {
    @Prop() public inventory!: InventoryItem[];

    public showAddNewArticleModal = false;
    public newArticle: {name: string; stock: number | null} = {
        name: '', 
        stock: null
        };

    public getAvailabilityStatus(amount: number): AvailabilityIndicator {
        return getAvailabilityStatus(amount);
    }

    public async submitNewInventoryArticle(): Promise<void> {
        if(this.newArticle.name && this.newArticle.stock !== null) {
            // @ts-ignore
            const sendProductResponse = await api.submitNewInventoryArticle(this.newArticle);
            if(!sendProductResponse) {
                alert('Could not add article in the inventory!');
            } else {
                this.emitRefreshProducts();
            }
            this.clearNewArticle();
        }
    }

    public emitRefreshProducts(): void {
        this.$emit('refresh-products');
    }

    public clearNewArticle(): void {
        this.newArticle.name = '';
        this.newArticle.stock = null;
        this.showAddNewArticleModal = false;
    }
}
</script>

<style lang="scss" scoped>
   .stock {
       min-width: 140px; 
       padding: 0.5rem 1.7rem;
       @media(min-width: 600px) {
           padding: 0.5rem;
       }
   }
   .action-control-container {
       width: 100%;
       @media(min-width: 600px) {
           width: auto;
       }
   }
</style>