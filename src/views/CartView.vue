<template>
  <div class="cart-view container mt-4">
    <router-link to="/" class="back-btn">Quay lại</router-link>
    <h2>GIỎ HÀNG</h2>
    <table id="cart-table">
      <thead>
        <tr>
          <th style="width: 15%;">Ảnh</th>
          <th style="width: 50%;">Tên sản phẩm</th>
          <th style="width: 20%;">Giá</th>
          <th style="width: 15%;">Xóa</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="store.cart.length === 0">
          <td colspan="4" class="text-center">Giỏ hàng trống</td>
        </tr>
        <tr v-for="(item, index) in store.cart" :key="index">
          <td><img :src="item.image" :alt="item.name"></td>
          <td>{{ item.name }}</td>
          <td>{{ item.price }}</td>
          <td><button class="remove-btn" @click="store.removeFromCart(index)">Xóa</button></td>
        </tr>
      </tbody>
    </table>
    
    <!-- NOTE: Price calculation needs parsing since price strings are '99.000.000 ₫' -->
    <span id="total" class="mt-3 d-block text-end fw-bold fs-4">Tổng tiền: {{ totalPrice }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { store } from '../store';

const totalPrice = computed(() => {
  let total = 0;
  store.cart.forEach(item => {
    // Parse price string: '99.000.000 ₫' -> 99000000
    const priceNum = parseInt(item.price.replace(/\./g, '').replace(' ₫', '')) || 0;
    total += priceNum;
  });
  return total.toLocaleString() + ' ₫';
});
</script>

<style scoped>
.cart-view {
  font-family: 'Roboto Flex', sans-serif;
  max-width: 1200px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

th, td {
  border: 1px solid #ccc;
  padding: 12px;
  text-align: left;
}

th {
  background: #f5f5f5;
  font-weight: bold;
  text-transform: uppercase;
}

img {
  width: 70px;
  height: auto;
  border-radius: 4px;
}

.remove-btn {
  background-color: #cc0000;
  color: white;
  border: none;
  padding: 6px 14px;
  border-radius: 6px;
  font-family: 'Oswald', sans-serif;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.remove-btn:hover {
  background-color: #a80000;
  transform: scale(1.05);
}

.back-btn {
  display: inline-block;
  margin: 20px 0;
  padding: 10px 20px;
  background-color: #303030;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-family: 'Oswald', sans-serif;
  transition: background-color 0.3s ease;
}

.back-btn:hover {
  background-color: #555;
}
</style>
