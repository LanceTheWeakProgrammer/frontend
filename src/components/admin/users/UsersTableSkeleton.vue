<template>
    <h3 class="mb-4 text-xl font-semibold">
        <Skeleton width="12rem" height="2rem" class="mb-2"></Skeleton>
    </h3>

    <div class="card border-0 shadow-sm mb-4 p-4 rounded-lg">
        <div class="flex items-center justify-between mb-3">
            <Skeleton width="14rem" height="1.5rem"></Skeleton>
            <Skeleton width="4rem" height="2rem"></Skeleton>
        </div>
        <Divider />
        <div class="grid grid-cols-1 gap-4">
            <Skeleton width="100%" height="25rem" class="mb-4"></Skeleton>
        </div>
    </div>
</template>

<script setup>
import Skeleton from 'primevue/skeleton';
import Divider from 'primevue/divider';
</script>
