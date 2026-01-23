<template>
  <header>
    <nav class="nav-left">
      <ul>
        <li><a href="#" data-bs-toggle="offcanvas" data-bs-target="#offcanvasMenu"><i class="fas fa-bars"></i></a></li>
        <li><a href="#TimKiem"><i class="fas fa-search"></i></a></li>
      </ul>
    </nav>

    <div class="logo"><router-link to="/">LUÔN VUI TƯƠI</router-link></div>

    <nav class="nav-right">
      <ul>
        <li>
          <router-link to="/cart">
            <i class="fas fa-shopping-cart"></i>
            <span v-if="cartCount" class="badge bg-danger rounded-pill">{{ cartCount }}</span>
          </router-link>
        </li>
        <li><a href="#lienLac"><i class="fas fa-heart"></i></a></li>

        <li v-if="!isLoggedIn" class="login-item" @click="$emit('open-login')">
          <i class="fas fa-user"></i><a href="#">Đăng Nhập</a>
        </li>
        <li v-else class="login-item">
          <router-link to="/profile" class="d-flex align-items-center gap-2">
            <i class="fas fa-user-check"></i> {{ currentUser.username }}
          </router-link>
        </li>
      </ul>
    </nav>
  </header>
  
  <!-- Offcanvas Menu (Global) -->
  <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasMenu" aria-labelledby="offcanvasMenuLabel">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasMenuLabel">MENU</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
        <ul class="list-group list-group-flush">
          <li class="list-group-item border-0"><router-link to="/" class="text-decoration-none text-dark fw-bold text-uppercase">Trang chủ</router-link></li>
          <li class="list-group-item border-0" v-if="isLoggedIn && currentUser.role === 'admin'"><router-link to="/admin" class="text-decoration-none text-danger fw-bold text-uppercase">Admin Dashboard</router-link></li>
          <li class="list-group-item border-0" v-if="isLoggedIn"><router-link to="/blog" class="text-decoration-none text-dark fw-bold text-uppercase">Bảng tin</router-link></li>
          <li class="list-group-item border-0"><router-link to="/cart" class="text-decoration-none text-dark fw-bold text-uppercase">Giỏ hàng <span v-if="cartCount" class="badge bg-danger ms-2">{{ cartCount }}</span></router-link></li>
          <li class="list-group-item border-0" v-if="!isLoggedIn">
            <a href="#" @click="$emit('open-login')" data-bs-dismiss="offcanvas" class="text-decoration-none text-dark fw-bold text-uppercase">Đăng nhập</a>
          </li>
          <li class="list-group-item border-0" v-if="isLoggedIn">
            <router-link to="/profile" class="text-decoration-none text-dark fw-bold text-uppercase">Tài khoản</router-link>
          </li>
          <li class="list-group-item border-0" v-if="isLoggedIn">
            <a href="#" @click="$emit('logout')" class="text-decoration-none text-dark fw-bold text-uppercase">Đăng xuất</a>
          </li>
        </ul>
      </div>
    </div>
</template>

<script setup>
const props = defineProps({
  isLoggedIn: Boolean,
  currentUser: Object,
  cartCount: Number
});

defineEmits(['open-login', 'logout']);
</script>

<style scoped>
/* Copied styles from asm.css relevant to Header */
header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
}
.nav-left ul, .nav-right ul {
  list-style: none;
  display: flex;
  gap: 15px;
  margin: 0;
  padding: 0;
}
.nav-left ul li a, .nav-right ul li a {
  color: #000;
  text-decoration: none;
  font-size: 18px;
}
.logo {
  font-family: 'Noto Serif';
  font-size: 20px;
  font-weight: bold;
  text-transform: uppercase;
  text-align: center;
}
.logo a {
  text-decoration: none;
  color: #000;
}
ul { padding-left: 0; margin-bottom: 0; }
a { text-decoration: none; color: inherit; }
</style>
