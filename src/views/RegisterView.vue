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
import { store } from '@/store'

const form = reactive({
  username: '',
  name: '',
  email: '',
  phone: '',
  password: '',
  confirm: ''
})

const handleRegister = () => {
  if (
    !form.username ||
    !form.name ||
    !form.email ||
    !form.phone ||
    !form.password
  ) {
    alert('Vui lòng nhập đầy đủ thông tin')
    return
  }

  if (form.password !== form.confirm) {
    alert('Mật khẩu xác nhận không khớp')
    return
  }

  store.register({
    username: form.username,
    password: form.password,
    profile: {
      name: form.name,
      email: form.email,
      phone: form.phone
    }
  })
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
