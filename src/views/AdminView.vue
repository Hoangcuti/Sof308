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
      <li class="nav-item">
        <button class="nav-link" :class="{ active: activeTab === 'orders' }" @click="handleOrdersTab">Quản lý Đơn Hàng</button>
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

      <!-- ORDERS TAB -->
      <div v-if="activeTab === 'orders'" class="tab-pane fade show active">
        <h4>Quản lý đơn hàng</h4>
        <div class="table-responsive">
          <table class="table table-bordered table-hover mt-3">
            <thead class="table-dark">
              <tr>
                <th>Mã ĐH</th>
                <th>Khách hàng</th>
                <th>Thông tin</th>
                <th>Sản phẩm</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in store.orders" :key="order.Id">
                <td>{{ order.Id }}</td>
                <td>
                  <div class="fw-bold">{{ order.FullName }}</div>
                  <div class="small">SĐT: {{ order.Phone }}</div>
                </td>
                <td>
                  <div class="small">Email: {{ order.Email }}</div>
                  <div class="small">ĐC: {{ order.Address }}</div>
                  <div class="small">PTTT: {{ order.PaymentMethod }}</div>
                </td>
                <td>
                  <div v-for="item in order.items" :key="item.Id" class="small border-bottom mb-1">
                    {{ item.ProductName }} x 1
                  </div>
                </td>
                <td class="fw-bold text-danger">{{ order.Total }}</td>
                <td>
                  <span class="badge" :class="getStatusBadgeClass(order.Status)">
                    {{ order.Status === 'Pending' ? 'Chờ duyệt' : 
                       order.Status === 'Shipping' ? 'Đang giao' : 
                       order.Status === 'Delivered' ? 'Thành công' : 'Đã hủy' }}
                  </span>
                </td>
                <td>
                  <select class="form-select form-select-sm mb-1" @change="(e) => updateStatus(order.Id, e.target.value)">
                    <option :selected="order.Status === 'Pending'" value="Pending">Chờ duyệt</option>
                    <option :selected="order.Status === 'Shipping'" value="Shipping">Đang giao</option>
                    <option :selected="order.Status === 'Delivered'" value="Delivered">Thành công</option>
                    <option :selected="order.Status === 'Cancelled'" value="Cancelled">Đã hủy</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
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
                <label class="form-label d-block">Nguồn hình ảnh</label>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" v-model="imageSourceType" value="url" id="srcUrl">
                  <label class="form-check-label" for="srcUrl">Đường dẫn (URL)</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" v-model="imageSourceType" value="file" id="srcFile">
                  <label class="form-check-label" for="srcFile">Tải lên từ máy</label>
                </div>
                
                <div v-if="imageSourceType === 'url'" class="mt-2">
                  <input type="text" class="form-control" v-model="currentProduct.image" placeholder="Nhập URL ảnh...">
                </div>
                <div v-else class="mt-2">
                  <input type="file" class="form-control" @change="handleFileUpload" accept="image/*">
                </div>

                <div v-if="currentProduct.image" class="mt-3 text-center border p-2 rounded bg-light">
                  <p class="small text-muted mb-1">Xem trước:</p>
                  <img :src="currentProduct.image" alt="Preview" style="max-height: 150px; max-width: 100%; object-fit: contain;">
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Giá (VNĐ)</label>
                <input type="text" class="form-control" v-model="currentProduct.price" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Danh mục</label>
                <select class="form-select" v-model="currentProduct.category" required>
                  <option value="featured">Áo quần</option>
                  <option value="tuixach">Túi xách</option>
                  <option value="giaydep">Giày dép</option>
                  <option value="mu">Mũ</option>
                  <option value="thatluong">Thắt lưng</option>
                </select>
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
const imageSourceType = ref('url'); // 'url' or 'file'

const openProductModal = (prod) => {
  if (prod) {
    isEditingProduct.value = true;
    currentProduct.value = { ...prod };
    // Determine source type for editing
    imageSourceType.value = (prod.image && prod.image.startsWith('data:')) ? 'file' : 'url';
  } else {
    isEditingProduct.value = false;
    currentProduct.value = { name: '', image: '', price: '', category: 'featured' };
    imageSourceType.value = 'url';
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

const handleOrdersTab = () => {
    activeTab.value = 'orders';
    store.fetchOrders();
};

const updateStatus = (orderId, newStatus) => {
    store.updateOrderStatus(orderId, newStatus);
};

const getStatusBadgeClass = (status) => {
    switch (status) {
        case 'Pending': return 'bg-warning text-dark';
        case 'Shipping': return 'bg-info text-dark';
        case 'Delivered': return 'bg-success';
        case 'Cancelled': return 'bg-danger';
        default: return 'bg-secondary';
    }
};
</script>
