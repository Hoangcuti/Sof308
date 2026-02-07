<template>
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
  </div>
</template>

<script setup>
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
</script>

<style scoped>
.product-detail-view {
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
}
</style>
