<template>
  <div class="admin-view container mt-5" style="min-height: 80vh;">
    <h2 class="text-center mb-4">Quản Trị Hệ Thống</h2>

    <ul class="nav nav-tabs mb-3">
      <li class="nav-item">
        <button class="nav-link" :class="{ active: activeTab === 'products' }" @click="activeTab = 'products'">Quản lý Sản Phẩm</button>
      </li>
      <li class="nav-item">
        <button class="nav-link" :class="{ active: activeTab === 'posts' }" @click="activeTab = 'posts'">Quản lý Bài Viết</button>
      </li>
    </ul>

    <div class="tab-content">
      <!-- PRODUCTS TAB -->
      <div v-if="activeTab === 'products'" class="tab-pane fade show active">
        <div class="d-flex justify-content-between mb-3">
          <h4>Danh sách sản phẩm</h4>
          <button class="btn btn-primary" @click="openProductModal()">+ Thêm Sản Phẩm</button>
        </div>
        <table class="table table-bordered table-hover">
          <thead class="table-light">
            <tr>
              <th>ID</th>
              <th>Hình ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Giá</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="prod in store.products" :key="prod.id">
              <td>{{ prod.id }}</td>
              <td><img :src="prod.image" alt="" style="height: 50px;"></td>
              <td>{{ prod.name }}</td>
              <td>{{ prod.price }}</td>
              <td>
                <button class="btn btn-sm btn-warning me-2" @click="openProductModal(prod)">Sửa</button>
                <button class="btn btn-sm btn-danger" @click="deleteProduct(prod.id)">Xóa</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- POSTS TAB -->
      <div v-if="activeTab === 'posts'" class="tab-pane fade show active">
        <h4>Duyệt bài đăng người dùng</h4>
        <table class="table table-bordered">
          <thead class="table-light">
            <tr>
              <th>Người đăng</th>
              <th>Tiêu đề</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="post in store.posts" :key="post.id">
              <td>{{ post.author }}</td>
              <td>{{ post.title }}</td>
              <td>
                <span :class="{'badge bg-success': post.status === 'approved', 'badge bg-warning': post.status === 'pending'}">
                  {{ post.status === 'approved' ? 'Đã duyệt' : 'Chờ duyệt' }}
                </span>
              </td>
              <td>
                <button v-if="post.status === 'pending'" class="btn btn-sm btn-success me-2" @click="store.approvePost(post)">Duyệt</button>
                <button class="btn btn-sm btn-danger" @click="deletePost(post.id)">Xóa</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Product Modal -->
    <div v-if="showModal" class="modal show d-block" style="background: rgba(0,0,0,0.5)">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditingProduct ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm' }}</h5>
            <button type="button" class="btn-close" @click="showModal = false"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveProduct">
              <div class="mb-3">
                <label class="form-label">Tên sản phẩm</label>
                <input type="text" class="form-control" v-model="currentProduct.name" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Link ảnh (URL hoặc Upload)</label>
                <input type="text" class="form-control mb-2" v-model="currentProduct.image" placeholder="URL ảnh...">
                <input type="file" class="form-control" @change="handleFileUpload" accept="image/*">
                <div v-if="currentProduct.image" class="mt-2">
                  <img :src="currentProduct.image" alt="Preview" style="height: 50px;">
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Giá (VNĐ)</label>
                <input type="text" class="form-control" v-model="currentProduct.price" required>
              </div>
              <button type="submit" class="btn btn-primary w-100">{{ isEditingProduct ? 'Cập nhật' : 'Thêm mới' }}</button>
            </form>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { store } from '../store';

const activeTab = ref('products');
const showModal = ref(false);
const isEditingProduct = ref(false);
const currentProduct = ref({});

const openProductModal = (prod) => {
  if (prod) {
    isEditingProduct.value = true;
    currentProduct.value = { ...prod };
  } else {
    isEditingProduct.value = false;
    currentProduct.value = { name: '', image: '', price: '' };
  }
  showModal.value = true;
};

const saveProduct = () => {
  if (isEditingProduct.value) {
    store.updateProduct(currentProduct.value);
  } else {
    currentProduct.value.id = Date.now();
    store.addProduct(currentProduct.value);
  }
  showModal.value = false;
};

const deleteProduct = (id) => {
  if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
    store.deleteProduct(id);
  }
};

const deletePost = (id) => {
  if (confirm('Bạn có chắc muốn xóa bài viết này?')) {
    store.deletePost(id);
  }
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      currentProduct.value.image = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};
</script>
