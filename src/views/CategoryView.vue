<template>
  <div class="category-view container mt-3">
    <!-- Carousel specific to category -->
    <div v-if="sliderImages.length" class="carousel">
      <div class="slides" ref="slidesRef">
        <div class="slide" v-for="(img, index) in sliderImages" :key="index">
          <img :src="img" alt="Slide">
        </div>
      </div>
      <button class="carousel-btn left" @click="moveSlide(-1)">❮</button>
      <button class="carousel-btn right" @click="moveSlide(1)">❯</button>
    </div>

    <div class="hero mt-4">
      <h1>{{ categoryTitle }}</h1>
    </div>

    <div class="product-grid mt-4">
      <div class="product" v-for="prod in categoryProducts" :key="prod.id">
        <span class="click-icon"><i class="fas fa-heart"></i></span>
<<<<<<< HEAD
        <router-link :to="'/product/' + prod.id">
          <img :src="prod.image" :alt="prod.name" style="cursor: pointer;">
        </router-link>
        <router-link :to="'/product/' + prod.id" class="text-decoration-none text-dark">
          <h4>{{ prod.name }}</h4>
        </router-link>
=======
        <!-- Image Modal On Click -->
        <img :src="prod.image" :alt="prod.name" @click="goToProduct(prod.id)" style="cursor: pointer;">
        <h4>{{ prod.name }}</h4>
>>>>>>> 72f3a41cb807eebe8339b71307b64870173a07a8
        <p class="text-danger fw-bold">{{ prod.price }}</p>
        <button class="btn-premium btn-premium-outline btn-sm w-100 py-3 mt-2" @click="store.addToCart(prod)">Thêm vào giỏ</button>
      </div>
    </div>
    
    <div class="stores">
      <a href="https://www.google.com/maps/place/Louis+Vuitton+H%E1%BB%93+Ch%C3%AD+Minh" target="_blank">
        Tìm cửa hàng gần bạn <i class="fas fa-map-marker-alt map-icon"></i>
      </a>
    </div>

    <!-- Image Modal -->
    <div id="imageModal" class="modal" :class="{ show: showImageModal }" @click.self="showImageModal = false">
      <span class="close" @click="showImageModal = false">&times;</span>
      <img :src="currentImage" class="modal-content">
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { store } from '../store';

const route = useRoute();
const router = useRouter();
const slidesRef = ref(null);
const slideIndex = ref(0);
let slideInterval = null;

const showImageModal = ref(false);
const currentImage = ref('');

// Category specific data
const categoryData = {
    tuixach: {
        title: 'TÚI XÁCH',
        sliders: [
            'https://www.louisvuitton.com/images/is/image/lv/LV_RESORT_ON_MODEL_IMG03_LVCOM_2048x1152_DI3.jpg?wid=1440',
            'https://www.louisvuitton.com/images/is/image/lv/W_BC_LG_ALLIN_WORN_DEC24_01_DI3.jpg?wid=1440'
        ]
    },
    giaydep: {
        title: 'GIÀY DÉP',
        sliders: [
            'https://www.louisvuitton.com/images/is/image/lv/M_BC_Shoes_LVVeniceMule_Apr25_02_DI3.jpg?wid=1440',
            'https://www.louisvuitton.com/images/is/image/lv/M_BC_NewFormalSS25_AOU24_21_DI3.jpg?wid=1440'
        ]
    },
    mu: {
        title: 'MŨ',
        sliders: [
            'https://www.louisvuitton.com/images/is/image/lv/MEN_BC_LV_SIGNATURE_CAP_02_DI3.jpg?wid=1440',
            'https://vn.louisvuitton.com/images/is/image//content/dam/lv/editorial-content/brand-content-coremedia/men/2025/category/leather-goods/M_BC_Taurillon25_01_DI3.jpg?wid=1440'
        ]
    },
    thatluong: {
        title: 'THẮT LƯNG',
        sliders: [
            'https://www.louisvuitton.com/images/is/image/lv/MEN_ACC_BC_FORMAL_BELTS_FW25_01_DI3.jpg?wid=1440',
            'https://www.louisvuitton.com/images/is/image/lv/M_BC_ShowSS25_DL1_Jan25_05_DI3.jpg?wid=1440'
        ]
    }
};

const categoryId = computed(() => route.params.id);
const categoryTitle = computed(() => categoryData[categoryId.value]?.title || 'Sản phẩm');
const sliderImages = computed(() => categoryData[categoryId.value]?.sliders || []);

const categoryProducts = computed(() => {
    return store.products.filter(p => p.category === categoryId.value);
});

const goToProduct = (id) => {
  router.push(`/product/${id}`);
};

// Carousel Logic
const moveSlide = (n) => {
  if (!slidesRef.value) return;
  const totalSlides = slidesRef.value.children.length;
  if(totalSlides === 0) return;
  
  slideIndex.value += n;
  
  if (slideIndex.value < 0) slideIndex.value = totalSlides - 1;
  if (slideIndex.value >= totalSlides) slideIndex.value = 0;
  
  slidesRef.value.style.transform = `translateX(-${slideIndex.value * 100}%)`;
};

onMounted(() => {
  slideInterval = setInterval(() => moveSlide(1), 3000);
});

onUnmounted(() => {
  if (slideInterval) clearInterval(slideInterval);
});

// Reset slide when route changes
watch(categoryId, () => {
    slideIndex.value = 0;
    if(slidesRef.value) slidesRef.value.style.transform = `translateX(0)`;
});
</script>

<style scoped>
/* Reuse styles from HomeView/Asm */
.carousel { width: 100%; overflow: hidden; position: relative; border-radius: 8px; }
.slides { display: flex; transition: transform 0.5s ease; }
.slide { min-width: 100%; }
.slide img { width: 100%; height: auto; }
.carousel-btn { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(0, 0, 0, 0.5); color: white; border: none; padding: 10px; cursor: pointer; }
.carousel-btn.left { left: 10px; }
.carousel-btn.right { right: 10px; }

.hero { text-align: center; padding: 20px 0; background-color: #f5f5f5; margin-bottom: 20px; }
.hero h1 { font-family: 'Noto Serif'; font-size: 28px; color: #222; text-transform: uppercase; }

.product-grid { display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; }
.product { background: white; border-radius: 8px; width: 250px; padding: 10px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); text-align: center; position: relative; transition: transform 0.3s;}
.product img { width: 100%; height: auto; border-radius: 6px; }
.product:hover { transform: translateY(-5px); }
.product h4 { text-align: left; font-family: 'Oswald'; font-size: 16px; margin: 10px 0 5px; }
.product p { font-family: 'Oswald'; color: #505050; text-align: left; }

.stores { text-align: center; padding: 20px; margin-top: 40px; border-top: 1px solid #eee;}

.modal { display: none; position: fixed; z-index: 9999; left: 0; top: 0; width: 100vw; height: 100vh; background-color: rgba(0, 0, 0, 0.9); justify-content: center; align-items: center; }
.modal.show { display: flex !important; }
.modal-content { max-width: 90vw; max-height: 90vh; object-fit: contain; }
.close { position: absolute; top: 20px; right: 35px; color: #f1f1f1; font-size: 40px; font-weight: bold; cursor: pointer; }
.click-icon { position: absolute; top: 10px; right: 10px; font-size: 20px; color: #e60023; opacity: 0; transition: opacity 0.3s; cursor: pointer; }
.product:hover .click-icon { opacity: 1; }
</style>
