<template>
    <div class="p-4">
        <div class="flex flex-col w-full overflow-hidden">
            <h3 class="mb-4 text-xl font-semibold">
                <Skeleton width="12rem" height="2rem" class="mb-2"></Skeleton>
            </h3>

            <!-- CAROUSEL -->
            <div class="card border-0 shadow-sm mb-4 p-4 rounded-lg">
                <div class="flex items-center justify-between mb-3">
                    <Skeleton width="14rem" height="1.5rem"></Skeleton>
                    <Skeleton width="4rem" height="2rem"></Skeleton>
                </div>
                <Divider />
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Skeleton width="100%" height="20rem" class="mb-4"></Skeleton>
                    <Skeleton width="100%" height="20rem" class="mb-4"></Skeleton>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Skeleton from 'primevue/skeleton';
import Divider from 'primevue/divider';
</script>
