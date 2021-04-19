<template>
    <div class="modal-bg" @click.prevent="closeModal">
        <div class="modal-frame" @click.stop>
            <div class="d-flex justify-content-end modal-header">
                <button type="button" @click="closeModal" class="btn-close">x</button>
            </div>
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class Modal extends Vue {

    public closeModal() {
        this.$emit('close-modal');
    }
}
</script>