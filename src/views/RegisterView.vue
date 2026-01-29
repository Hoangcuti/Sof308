<template>
  <div class="auth-form">
    <h2>Đăng Ký</h2>

    <input
      type="text"
      v-model="form.username"
      placeholder="Tên đăng nhập"
    />

    <input
      type="text"
      v-model="form.name"
      placeholder="Họ và tên"
    />

    <input
      type="email"
      v-model="form.email"
      placeholder="Email"
    />

    <input
      type="text"
      v-model="form.phone"
      placeholder="Số điện thoại"
    />

    <input
      type="password"
      v-model="form.password"
      placeholder="Mật khẩu"
    />

    <input
      type="password"
      v-model="form.confirm"
      placeholder="Xác nhận mật khẩu"
    />

    <button @click="handleRegister">
      Đăng ký
    </button>

    <p @click="$emit('switch')">
      Đã có tài khoản? Đăng nhập
    </p>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { store } from '../store.js'

const form = reactive({
  username: '',
  name: '',
  email: '',
  phone: '',
  password: '',
  confirm: ''
})

const handleRegister = async () => {
  if (
    !form.username ||
    !form.name ||
    !form.email ||
    !form.phone ||
    !form.password ||
    !form.confirm
  ) {
    alert('Vui lòng nhập đầy đủ tất cả các trường')
    return
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.email)) {
    alert('Định dạng email không hợp lệ');
    return;
  }

  // Phone validation
  const phoneRegex = /^[0-9]{10,11}$/;
  if (!phoneRegex.test(form.phone)) {
    alert('Số điện thoại phải có 10-11 chữ số');
    return;
  }

  if (form.password !== form.confirm) {
    alert('Mật khẩu xác nhận không khớp')
    return
  }

  // Check if user exists
  if (store.users.find(u => u.username === form.username)) {
    alert('Tên đăng nhập đã tồn tại')
    return
  }

  try {
    await store.register({
      username: form.username,
      password: form.password,
      role: 'user',
      name: form.name,
      email: form.email,
      phone: form.phone,
      profile: {
        name: form.name,
        email: form.email,
        phone: form.phone,
        bio: '',
        gender: '',
        birthday: ''
      }
    })

    alert('Đăng ký thành công!')
    // Switch to login or redirect
  } catch (error) {
    alert('Đăng ký thất bại. Vui lòng thử lại.')
  }
}
</script>

<style scoped>
.auth-form {
  padding: 20px;
}
.auth-form input {
  display: block;
  width: 100%;
  margin-bottom: 10px;
}
</style>
