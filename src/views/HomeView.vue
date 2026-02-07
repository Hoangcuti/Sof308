<template>
  <div class="home-view">
    <!-- Carousel -->
    <div class="carousel mb-4">
      <div class="slides" ref="slidesRef">
        <div class="slide"><img src="https://vn.louisvuitton.com/content/dam/lv/online/picture/asiapacific/2025/Women_Prefall_Odyssey_DI3.jpg?wid=1440" alt="Slide 1"></div>
        <div class="slide"><img src="https://vn.louisvuitton.com/images/is/poster-video/9ed6c1c6-12f9-4ad0-8c85-fa847897396e/y1aMJIjU6NScxl6mmMnXCMeD.jpg?wid=1440" alt="Slide 2"></div>
        <div class="slide"><img src="https://media.houseandgarden.co.uk/photos/6596844963ef2cafeda7065c/16:9/w_2848,h_1602,c_limit/F5RPDR4akAAlwyi.jpeg" alt="Slide 3"></div>
      </div>
      <button @click="moveSlide(-1)">❮</button>
      <button @click="moveSlide(1)">❯</button>
    </div>

    <h2 class="Roboto-Flex my-5 text-center fw-bold text-uppercase letter-spacing-2">Khám phá các sáng tạo độc đáo của Louis Vuitton</h2>

    <div class="category-grid">
      <div class="category" v-for="cat in categories" :key="cat.name">
        <span class="click-icon"><i class="fas fa-heart"></i></span>
        <a :href="cat.link"><img :src="cat.image" :alt="cat.name"></a>
        <div class="category-title">{{ cat.name }}</div>
      </div>
    </div>

    <div class="hero my-5">
      <h1 class="display-4 fw-bold">Khám phá thế giới Louis Vuitton</h1>
    </div>

    <div class="product-grid mt-4">
      <div class="product" v-for="prod in displayedProducts" :key="prod.id">
        <span class="click-icon"><i class="fas fa-heart"></i></span>
        <router-link :to="'/product/' + prod.id">
          <img :src="prod.image" :alt="prod.name" style="cursor: pointer;">
        </router-link>
        <router-link :to="'/product/' + prod.id" class="text-decoration-none text-dark">
          <h4>{{ prod.name }}</h4>
        </router-link>
        <p class="text-danger fw-bold">{{ prod.price }}</p>
        <button class="btn-premium btn-premium-outline btn-sm w-100 py-3 mt-2" @click="store.addToCart(prod)">Thêm vào giỏ</button>
      </div>
    </div>

    <div v-if="showMoreButton" class="text-center mt-4 mb-5">
      <button class="btn-premium btn-premium-dark px-5 py-3" @click="showAll = true">Xem tất cả sản phẩm</button>
    </div>



    <section class="stores mt-5">
      <h2>Cửa hàng</h2>
      <p>Tòa nhà Opera View, 161 Đồng Khởi, Quận 1, TP. Hồ Chí Minh</p>
    </section>

    <!-- Image Modal -->
    <div id="imageModal" class="modal" :class="{ show: showImageModal }" @click.self="showImageModal = false">
      <span class="close" @click="showImageModal = false">&times;</span>
      <img :src="currentImage" class="modal-content">
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { store } from '../store';

const showImageModal = ref(false);
const currentImage = ref('');
const slideIndex = ref(0);
const slidesRef = ref(null);
let slideInterval = null;

const showAll = ref(false);
const limit = 4;

const displayedProducts = computed(() => {
  if (showAll.value) return store.products;
  return store.products.slice(0, limit);
});

const showMoreButton = computed(() => {
  return !showAll.value && store.products.length > limit;
});

const categories = ref([
  { name: 'Túi chéo', image: 'https://vn.louisvuitton.com/images/is/image//content/dam/lv/editorial-content/New-Homepage/2024/central/category/women_bags/Women_Handbags_WW_HP_Category_Push_20240816_DII.jpg?wid=490', link: '/category/tuixach' },
  { name: 'Giày Dép Nam', image: 'https://vn.louisvuitton.com/images/is/image//content/dam/lv/editorial-content/New-Homepage/2025/central/categories/evergreen/Men_Shoes_White_WW_HP_Category_Push_DII.jpg?wid=490', link: '/category/giaydep' },
  { name: 'Thắt Lưng', image: "https://vn.louisvuitton.com/images/is/image//content/dam/lv/editorial-content/New-Homepage/2025/central/categories/father's-day/Men_Belts_WW_HP_Category_DII.jpg?wid=490", link: '/category/thatluong' },
  { name: 'Mũ', image: "https://vn.louisvuitton.com/images/is/image//content/dam/lv/editorial-content/New-Homepage/2025/central/categories/father's-day/Men_Hats_WW_HP_Category_DII.jpg?wid=490", link: '/category/mu' }
]);

const openImageModal = (src) => {
  currentImage.value = src;
  showImageModal.value = true;
};

const moveSlide = (n) => {
  if (!slidesRef.value) return;
  const totalSlides = slidesRef.value.children.length;
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
</script>

<style scoped>
/* Imported Styles relevant to Home */
.category-grid { display: flex; justify-content: center; gap: 30px; flex-wrap: wrap; }
.category { width: 300px; text-align: center; position: relative; }
.category img { width: 100%; height: auto; border-radius: 8px; transition: transform 0.3s; }
.category:hover img { transform: scale(1.05); }
.category-title { margin-top: 12px; font-size: 16px; font-weight: 500; }

.product-grid { display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; }
.product { background: white; border-radius: 8px; width: 250px; padding: 10px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); text-align: center; position: relative; }
.product img { width: 100%; height: auto; border-radius: 6px; }
.product h4 { text-align: left; font-family: 'Oswald'; font-size: 16px; margin: 10px 0 5px; }
.product p { font-family: 'Oswald'; color: #505050; font-weight: 150; text-align: left; }
.product button { box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1); transition: opacity 0.3s; color: #e60023; background: none; border: 1px solid #e60023; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-top: 10px; position: static !important; transform: none !important; }
.product button:hover { background: #e60023; color: white; }
.click-icon { position: absolute; top: 10px; right: 10px; font-size: 20px; color: #e60023; opacity: 0; transition: opacity 0.3s; cursor: pointer; }
.product:hover .click-icon { opacity: 1; }
.product:hover { transform: translateY(-5px); transition: ease-in-out 1s; }

.carousel { width: 100%; overflow: hidden; position: relative; }
.slides { display: flex; transition: transform 0.5s ease; }
.slide { min-width: 100%; }
.slide img { width: 100%; height: auto; }
.carousel button { position: absolute; top: 35%; transform: translateY(-50%); background: rgba(0, 0, 0, 0.3); color: white; border: none; padding: 20px 15px; cursor: pointer; transition: all 0.3s; z-index: 10; font-size: 24px; }
.carousel button:hover { background: rgba(0, 0, 0, 0.7); }
.carousel button:first-of-type { left: 0; border-radius: 0 5px 5px 0; }
.carousel button:last-of-type { right: 0; border-radius: 5px 0 0 5px; }

.hero { text-align: center; padding: 80px 20px; background-color: #fcfcfc; border-top: 1px solid #f0f0f0; border-bottom: 1px solid #f0f0f0; margin-bottom: 40px; }
.hero h1 { font-size: 36px; color: #222; }

.stores { text-align: center; padding: 20px; background: #f5f5f5; }

.modal { display: none; position: fixed; z-index: 9999; left: 0; top: 0; width: 100vw; height: 100vh; background-color: rgba(0, 0, 0, 0.9); justify-content: center; align-items: center; }
.modal.show { display: flex !important; }
.modal-content { max-width: 90vw; max-height: 90vh; object-fit: contain; }
.close { position: absolute; top: 20px; right: 35px; color: #f1f1f1; font-size: 40px; font-weight: bold; cursor: pointer; }

/* Global Fonts helper */
.Roboto { font-family: 'Roboto Flex', sans-serif; }
</style>
