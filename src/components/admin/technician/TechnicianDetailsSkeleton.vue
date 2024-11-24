<template>
    <div class="p-4">
        <div class="flex flex-row">
            <div class="flex flex-col w-full lg:ml-auto overflow-hidden">
                <h3 class="mb-4 text-xl font-semibold">
                    <Skeleton width="12rem" height="2rem" class="mb-2"></Skeleton>
                </h3>
                <Skeleton width="15rem" height="1.5rem" class="mb-4"></Skeleton>
                
                <div class="card border-0 shadow-sm p-4 rounded-lg">
                    <div class="flex lg:flex-row flex-col lg:gap-10 gap-4 items-start">
                        <div class="flex flex-col items-center lg:w-2/3 w-full my-auto">
                            <div class="p-3">
                                <Skeleton shape="circle" size="20rem" class="mb-4"></Skeleton>
                            </div>
                        </div>

                        <div class="flex flex-col lg:w-2/3 w-full">
                            <div class="p-3">
                                <Skeleton width="10rem" height="1.5rem" class="mb-2"></Skeleton>
                                <Skeleton width="100%" height="2rem" class="mb-4"></Skeleton>
                            </div>
                            <div class="p-3">
                                <Skeleton width="10rem" height="1.5rem" class="mb-2"></Skeleton>
                                <Skeleton width="100%" height="2rem" class="mb-4"></Skeleton>
                            </div>
                            <div class="p-3">
                                <Skeleton width="12rem" height="1.5rem" class="mb-2"></Skeleton>
                                <Skeleton width="100%" height="2rem" class="mb-4"></Skeleton>
                            </div>
                            <div class="p-3">
                                <Skeleton width="15rem" height="1.5rem" class="mb-2"></Skeleton>
                                <Skeleton width="100%" height="2rem" class="mb-4"></Skeleton>
                            </div>
                            <div class="p-3">
                                <Skeleton width="18rem" height="1.5rem" class="mb-2"></Skeleton>
                                <Skeleton width="100%" height="2rem" class="mb-4"></Skeleton>
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col mt-4">
                        <Skeleton width="20rem" height="2rem" class="my-5"></Skeleton>
                        <div class="flex flex-wrap gap-4">
                            <Skeleton width="6rem" height="2rem" class="mb-4"></Skeleton>
                            <Skeleton width="6rem" height="2rem" class="mb-4"></Skeleton>
                            <Skeleton width="6rem" height="2rem" class="mb-4"></Skeleton>
                        </div>
                    </div>

                    <div class="flex flex-col mt-4">
                        <Skeleton width="20rem" height="2rem" class="my-5"></Skeleton>
                        <div class="flex flex-wrap gap-4">
                            <Skeleton width="6rem" height="2rem" class="mb-4"></Skeleton>
                            <Skeleton width="6rem" height="2rem" class="mb-4"></Skeleton>
                            <Skeleton width="6rem" height="2rem" class="mb-4"></Skeleton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Skeleton from 'primevue/skeleton';
</script>
