<script setup>
import { ref, onMounted } from "vue";
import axios from '../../services/axios';

import Button from "primevue/button";
import Divider from "primevue/divider";
import Dialog from "primevue/dialog";
import FileUpload from "primevue/fileupload";
import ToastComponent from "../../components/ToastComponent.vue";
import CarouselSkeleton from '../../components/admin/carousel/CarouselSkeleton.vue';
import avatarPlaceholder from '../../test_images/avatar.jpg';

const visible = ref(false);
const carousels = ref([]);

const loading = ref(true);
const uploading = ref(false); 
const toastComponent = ref(null);

const carouselInfo = ref({
    carousel_image: null
});

const fetchCarousel = async () => {
    try {
        const response = await axios.get('/api/admin/v1/carousel');
        if (response.data.success) {
            carousels.value = response.data.data;
        }
    } catch (error) {
        console.error('Failed to fetch carousel images:', error);
    } finally {
        loading.value = false;
    }
};

const showDialog = () => {
    carouselInfo.value = { carousel_image: null };
    visible.value = true;
};

const onFileSelect = (event) => {
    carouselInfo.value.carousel_image = event.files[0];
};

const onUpload = () => {};

const addCarousel = async () => {
    if (!carouselInfo.value.carousel_image) {
        toastComponent.value.showToast('error', 'Validation Failed', 'Please select an image.');
        return;
    }

    const formData = new FormData();
    formData.append('carousel_image', carouselInfo.value.carousel_image);

    uploading.value = true; 

    try {
        const response = await axios.post('/api/admin/v1/carousel', formData, {
            headers: {
                'Content-type': 'multipart/form-data'
            }
        });

        if (response.data.success) {
            carousels.value.push(response.data.data);
            toastComponent.value.showToast('success', 'Image uploaded', 'Image uploaded successfully!');
            visible.value = false;
        }
    } catch (error) {
        console.error('Failed to upload image:', error);    
        toastComponent.value.showToast('error', 'Upload Failed', 'Fail to upload image.');
    } finally {
        uploading.value = false; 
    }
};

const toggleCarousel = async (carouselId) => {
    try {
        const response = await axios.put(`/api/admin/v1/carousel/toggle/${carouselId}`);
        if (response.data.success) {
            const index = carousels.value.findIndex(item => item.id === carouselId);
            if (index !== -1) {
                carousels.value[index].active = response.data.carousel.active;
                toastComponent.value.showToast('success', 'Toggle Success', response.data.message);
            }
        }
    } catch (error) {
        console.error('Failed to toggle carousel image status:', error);
        toastComponent.value.showToast('error', 'Toggle Failed', 'Failed to toggle carousel image status.');
    }
};

const getAvatarUrl = (carousel_image) => {
    return carousel_image ? `http://localhost:8000/storage/${carousel_image}` : avatarPlaceholder;
};

onMounted(() => {
    fetchCarousel();
});
</script>

<template>
    <CarouselSkeleton v-if="loading" />
    <div v-else>
        <div class="p-4">
            <div class="flex flex-col w-full overflow-hidden">
                <h3 class="mb-4 text-xl font-semibold">Carousel</h3>

                <div class="card border-0 shadow-sm mb-4 p-4 rounded-lg">
                    <div class="flex items-center justify-between mb-3">
                        <h5 class="font-semibold text-lg m-0">Images</h5>
                        <Button
                            @click="showDialog"
                            severity="secondary"
                            icon="pi pi-plus-circle"
                            class="px-3 py-1 text-sm rounded shadow"
                            size="small"
                            label="Add"
                            :loading="uploading"  
                            :disabled="uploading"
                        >
                        </Button> 
                        
                        <Dialog v-model:visible="visible" modal header="Add Image" :style="{ width: '25rem' }">
                            <div class="flex flex-col gap-4">
                                <div class="flex flex-col gap-2">
                                    <label for="carousel_image" class="font-semibold">Image</label>
                                    <FileUpload
                                        mode="basic"
                                        name="carousel_image"
                                        accept="image/*"
                                        maxFileSize="2000000"
                                        customUpload
                                        :auto="false"
                                        :chooseLabel="'Choose Image'"
                                        @upload="onUpload"
                                        @select="onFileSelect"
                                    />
                                </div>
                                <div class="flex justify-end gap-2 mt-4">
                                    <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                                    <Button type="button" label="Add" @click="addCarousel" :loading="uploading" :disabled="uploading"></Button>
                                </div>
                            </div>
                        </Dialog>
                    </div>
                    <Divider />
                    <div class="grid grid-cols-2 gap-4" id="carousel-data">
                        <div v-for="carousel in carousels" :key="carousel.id" class="relative rounded-lg shadow-md mb-8">
                            <img :src="getAvatarUrl(carousel.carousel_image)" alt="Carousel" class="w-full h-80 object-cover rounded-md">
                            <Button
                                :icon="carousel.active ? 'pi pi-eye' : 'pi pi-eye-slash'"
                                severity="secondary"
                                class="!absolute !top-2 !right-2"
                                outlined
                                @click="toggleCarousel(carousel.id)" 
                            >
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <ToastComponent ref="toastComponent" />
    </div>
</template>
