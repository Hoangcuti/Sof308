<template>
<<<<<<< HEAD
  <div class="product-detail-view container mt-5 pt-5" v-if="product">
    <div class="row">
      <!-- Image Gallery -->
      <div class="col-md-6 mb-4">
        <div class="product-image-container p-4 border rounded shadow-sm bg-white">
          <img :src="product.image" :alt="product.name" class="img-fluid main-image">
        </div>
      </div>

      <!-- Product Info -->
      <div class="col-md-6 text-start">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><router-link to="/">Trang chủ</router-link></li>
            <li class="breadcrumb-item text-capitalize">{{ product.category }}</li>
            <li class="breadcrumb-item active" aria-current="page">{{ product.name }}</li>
          </ol>
        </nav>

        <h1 class="display-5 fw-bold mb-3 font-oswald text-uppercase">{{ product.name }}</h1>
        <h3 class="text-primary fw-bold mb-4 fs-2">{{ product.price }}</h3>
        
        <div class="divider mb-4"></div>

        <p class="text-muted mb-4 lead">
          Mô tả sản phẩm: Sản phẩm cao cấp thuộc bộ sưu tập Louis Vuitton. 
          Chất liệu thượng hạng, thiết kế tinh xảo, mang lại vẻ đẹp sang trọng và đẳng cấp cho người sở hữu.
        </p>

        <div class="d-grid gap-2 d-md-flex justify-content-md-start">
          <button class="btn-premium btn-premium-dark btn-lg px-5 py-3 fw-bold" @click="addToCart">
            <i class="fas fa-cart-plus me-2"></i> THÊM VÀO GIỎ HÀNG
          </button>
        </div>

        <div class="mt-5 p-3 border-start border-4 border-dark bg-light">
          <h6>Cam kết chất lượng:</h6>
          <ul class="small text-muted mb-0">
            <li>Hàng chính hãng 100% từ Louis Vuitton.</li>
            <li>Đổi trả trong vòng 7 ngày nếu có lỗi từ nhà sản xuất.</li>
            <li>Giao hàng nhanh toàn quốc.</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Related Products Placeholder -->
    <div class="related-section mt-5 pt-5 border-top">
        <h3 class="font-oswald mb-4">SẢN PHẨM TƯƠNG TỰ</h3>
        <div class="row row-cols-2 row-cols-md-4 g-4">
            <div v-for="p in relatedProducts" :key="p.id" class="col">
                <router-link :to="'/product/' + p.id" class="text-decoration-none text-dark">
                    <div class="card h-100 border-0 shadow-sm product-card-mini">
                        <img :src="p.image" class="card-img-top p-3" alt="...">
                        <div class="card-body p-2 text-center">
                            <p class="small mb-1 text-uppercase fw-bold">{{ p.name }}</p>
                            <p class="small text-primary mb-0">{{ p.price }}</p>
                        </div>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
  </div>
  <div v-else class="container mt-5 pt-5 text-center">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <p class="mt-3">Đang tải thông tin sản phẩm...</p>
=======
  <div class="product-detail-view container mt-5 mb-5" v-if="product">
    <div class="row">
      <!-- Left Column: Images -->
      <div class="col-md-7">
        <div class="image-gallery">
          <div class="main-image-container">
            <img :src="currentImage" class="main-image" :alt="product.name" />
          </div>
          <div class="thumbnails mt-3">
            <img
              v-for="(img, index) in product.images"
              :key="index"
              :src="img"
              class="thumbnail"
              :class="{ active: currentImage === img }"
              @click="currentImage = img"
            />
          </div>
        </div>
      </div>

      <!-- Right Column: Product Details -->
      <div class="col-md-5 product-info">
        <div class="breadcrumbs mb-3">
          <router-link to="/">Trang chủ</router-link> /
          <router-link :to="'/category/' + product.category">{{
            product.category
          }}</router-link>
          /
          <span>{{ product.name }}</span>
        </div>

        <h1 class="product-title">{{ product.name }}</h1>
        <p class="product-price">{{ product.price }}</p>

        <!-- Colors -->
        <div
          class="product-attribute mt-4"
          v-if="product.colors && product.colors.length"
        >
          <label>Màu sắc:</label>
          <div class="attribute-options">
            <button
              v-for="color in product.colors"
              :key="color"
              class="btn-option"
              :class="{ selected: selectedColor === color }"
              @click="selectedColor = color"
            >
              {{ color }}
            </button>
          </div>
        </div>

        <!-- Sizes -->
        <div
          class="product-attribute mt-3"
          v-if="product.sizes && product.sizes.length"
        >
          <label>Kích cỡ:</label>
          <div class="attribute-options">
            <button
              v-for="size in product.sizes"
              :key="size"
              class="btn-option"
              :class="{ selected: selectedSize === size }"
              @click="selectedSize = size"
            >
              {{ size }}
            </button>
          </div>
        </div>

        <!-- Add to Cart -->
        <div class="actions mt-5 d-flex gap-3">
          <button
            class="btn btn-outline-dark btn-lg flex-grow-1 add-to-cart-btn"
            @click="handleAddToCart"
          >
            THÊM VÀO GIỎ
          </button>
          <button
            class="btn btn-dark btn-lg flex-grow-1 buy-now-btn"
            @click="handleBuyNow"
          >
            MUA NGAY
          </button>
        </div>

        <!-- Description Accordion (Simple) -->
        <div class="product-description mt-5">
          <div class="accordion-item">
            <h5 class="accordion-header">MÔ TẢ SẢN PHẨM</h5>
            <div class="accordion-body">
              <p>{{ product.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-center mt-5">
    <p>Loading product...</p>
>>>>>>> 72f3a41cb807eebe8339b71307b64870173a07a8
  </div>
</template>

<script setup>
<<<<<<< HEAD
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { store } from '../store';

const route = useRoute();
const productId = ref(route.params.id);

const product = computed(() => {
    return store.products.find(p => p.id.toString() === productId.value.toString());
});

const relatedProducts = computed(() => {
    if (!product.value) return [];
    return store.products
        .filter(p => p.category === product.value.category && p.id !== product.value.id)
        .slice(0, 4);
});

const addToCart = () => {
    if (product.value) {
        store.addToCart(product.value);
    }
};

// Re-fetch or update when ID changes (for related products)
watch(() => route.params.id, (newId) => {
    productId.value = newId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

onMounted(() => {
    window.scrollTo(0, 0);
});
=======
import { ref, onMounted, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { store } from "../store";
import axios from "axios";

const route = useRoute();
const product = ref(null);
const currentImage = ref("");
const selectedColor = ref("");
const selectedSize = ref("");

const fetchProduct = async () => {
  try {
    const id = route.params.id;
    // In a real app, you might fetch specific product by ID API
    // Here we first check store, then fetch list if needed
    if (store.products.length === 0) {
      await store.init();
    }

    const found = store.products.find((p) => p.id == id);
    if (found) {
      product.value = found;
      // Default selections
      currentImage.value = found.image; // Main image
      // If images array exists and has items, use the first one if preferred, but existing matches logic
      if (found.colors && found.colors.length)
        selectedColor.value = found.colors[0];
      if (found.sizes && found.sizes.length)
        selectedSize.value = found.sizes[0];
    }
  } catch (error) {
    console.error("Error fetching product", error);
  }
};

const handleAddToCart = () => {
  if (!product.value) return;

  // Create cart item with selected attributes
  const cartItem = {
    ...product.value,
    selectedColor: selectedColor.value,
    selectedSize: selectedSize.value,
    cartId: Date.now(), // Unique ID for cart entry
  };

  store.addToCart(cartItem);
};

const handleBuyNow = () => {
  if (!product.value) return;
  handleAddToCart();
  router.push('/cart');
};

onMounted(() => {
  fetchProduct();
});

watch(
  () => route.params.id,
  () => {
    fetchProduct();
    window.scrollTo(0, 0);
  },
);
>>>>>>> 72f3a41cb807eebe8339b71307b64870173a07a8
</script>

<style scoped>
.product-detail-view {
<<<<<<< HEAD
    font-family: 'Roboto Flex', sans-serif;
    animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

.font-oswald {
    font-family: 'Oswald', sans-serif;
}

.product-image-container {
    transition: transform 0.3s ease;
}

.product-image-container:hover {
    transform: scale(1.02);
}

.main-image {
    max-height: 500px;
    object-fit: contain;
}

.divider {
    height: 2px;
    background: #eee;
    width: 100px;
}

.product-card-mini {
    transition: all 0.3s ease;
}

.product-card-mini:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
}

.breadcrumb-item a {
    color: #666;
    text-decoration: none;
}

.breadcrumb-item a:hover {
    color: #000;
=======
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  color: #333;
}

.breadcrumbs {
  font-size: 0.85rem;
  color: #666;
  text-transform: uppercase;
}
.breadcrumbs a {
  color: #666;
  text-decoration: none;
}

/* Image Gallery */
.main-image-container {
  width: 100%;
  /* background-color: #f9f9f9; */
  display: flex;
  justify-content: center;
  border-radius: 8px;
  overflow: hidden;
}
.main-image {
  width: 100%;
  max-width: 600px;
  height: auto;
  object-fit: cover;
}
.thumbnails {
  display: flex;
  gap: 10px;
  justify-content: center;
}
.thumbnail {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border: 1px solid transparent;
  cursor: pointer;
  border-radius: 4px;
  opacity: 0.7;
  transition: all 0.2s;
}
.thumbnail.active,
.thumbnail:hover {
  border-color: #333;
  opacity: 1;
}

/* Product Info */
.product-title {
  font-size: 2rem;
  font-weight: 300; /* Thin refined look */
  margin-bottom: 10px;
  letter-spacing: 0.5px;
}
.product-price {
  font-size: 1.5rem;
  font-weight: 400;
  color: #e60023; /* Or keep black for luxury */
  margin-bottom: 2rem;
}

.product-attribute label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
}

.attribute-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.btn-option {
  background: #fff;
  border: 1px solid #ddd;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.9rem;
  min-width: 40px;
}
.btn-option:hover {
  border-color: #999;
}
.btn-option.selected {
  border-color: #000;
  background-color: #000;
  color: #fff;
}

.add-to-cart-btn {
  border-radius: 0; /* Boxy luxury style */
  padding: 15px;
  font-weight: 500;
  letter-spacing: 1px;
  transition: transform 0.2s;
}
.add-to-cart-btn:hover {
  transform: translateY(-2px);
}

.accordion-item {
  border-top: 1px solid #eee;
  padding: 20px 0;
}
.accordion-header {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 10px;
  text-transform: uppercase;
}
.accordion-body {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #555;
  white-space: pre-line;
}

@media (max-width: 768px) {
  .product-title {
    font-size: 1.5rem;
    margin-top: 20px;
  }
>>>>>>> 72f3a41cb807eebe8339b71307b64870173a07a8
}
</style>
