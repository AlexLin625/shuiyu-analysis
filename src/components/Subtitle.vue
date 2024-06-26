<script setup>
const props = defineProps({
    text: String
})
</script>

<template>
    <h2 class="text-2xl py-4 pl-1 have-bar">{{ props.text }}</h2>
</template>
