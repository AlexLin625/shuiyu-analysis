<script setup>
import NumberDisplay from "@/components/NumberDisplay.vue";

const props = defineProps({
    briefInfo: Object
});
</script>

<template>
    <div class="flex flex-row w-full justify-between px-2">
        <NumberDisplay v-for="(value, key) in briefInfo" :key="key" :title="key" :number="value"/>
    </div>
</template>
