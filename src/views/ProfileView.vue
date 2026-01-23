<template>
  <div class="profile-view container mt-5">
    <h2>Hồ Sơ Của Tôi</h2>
    <div v-if="store.currentUser" class="card">
        <div class="card-body">
            <p><strong>Tên đăng nhập:</strong> {{ store.currentUser.username }}</p>
            <p><strong>Email:</strong> {{ store.currentUser.email }}</p>
            <p><strong>Vai trò:</strong> {{ store.currentUser.role }}</p>
            <button class="btn btn-danger" @click="store.logout(); $router.push('/')">Đăng Xuất</button>
        </div>
    </div>
  </div>
</template>

<script setup>
import { store } from '../store';
</script>
