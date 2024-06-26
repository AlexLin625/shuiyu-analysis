<script setup>
const props = defineProps({
    title: String,
    number: Number
});
</script>

<template>
    <div class="flex flex-col items-center py-4">
        <h1 class="text-2xl pt-4 text-center">
            {{ number }}
        </h1>

        <p class="text-gray-400 pb-8 pt-2 text-center text-sm">
            {{ title }}
        </p>
    </div>
</template>
