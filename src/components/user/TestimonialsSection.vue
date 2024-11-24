<template>
  <div>
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path
          fill="#f43f5e"
          fill-opacity="1"
          d="M0,256L48,245.3C96,235,192,213,288,192C384,171,480,149,576,170.7C672,192,768,256,864,261.3C960,267,1056,213,1152,202.7C1248,192,1344,224,1392,240L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>
    </div>
    <div class="pt-10 bg-rose-500">
      <h1 class="my-4 text-center text-5xl h-title">
        <span class="text-neutral-50">Testimonials</span>
      </h1>

      <div class="mx-4">
        <swiper
          v-if="testimonials.length > 0"
          :slidesPerView="3"
          :grabCursor="true"
          :effect="'coverflow'"
          :loop="true"
          :centeredSlides="true"
          :coverflowEffect="{ rotate: 50, stretch: 10, depth: 80, modifier: 1, slideShadows: false }"
          :modules="modules"
          :autoplay="{ delay: 2500, disableOnInteraction: false }"
          :breakpoints="{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }"
          class="swiper-testimonials pt-5"
          style="height: 350px;"
        >
          <swiper-slide
            class="card shadow"
            v-for="testimonial in testimonials"
            :key="testimonial.id"
            style="height: 270px;"
          >
            <div class="profile flex items-center mb-3">
              <img src="/src/test_images/avatar.jpg" alt="Profile" width="30px" />
              <h3 class="ms-3">
                {{ testimonial.user?.profile?.full_name || testimonial.author_name || 'Anonymous' }}
              </h3>
            </div>
            <p>{{ testimonial.content }}</p>
            <div class="rating mt-3">
              <i
                v-for="n in testimonial.rating"
                :key="n"
                class="pi pi-star-fill text-rose-500 mx-1"
              ></i>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, watch } from 'vue';
import { useGlobalStore } from '../../stores/global.store';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, EffectCoverflow } from 'swiper/modules';

const modules = [Autoplay, EffectCoverflow];
const globalStore = useGlobalStore();

const testimonials = computed(() => globalStore.testimonials);

onMounted(() => {
  globalStore.fetchTestimonials();
});
</script>
