<template>
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
  </div>
</template>

<script setup>
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
</script>

<style scoped>
.product-detail-view {
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
}
</style>
