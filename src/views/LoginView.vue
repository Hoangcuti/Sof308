cd<template>
  <div class="auth-container">
    <h2>Đăng nhập</h2>

    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Mật khẩu" />

    <p v-if="error" class="error">{{ error }}</p>

    <button @click="handleLogin">Đăng nhập</button>

    <p class="switch">
      Chưa có tài khoản?
      <router-link to="/register">Đăng ký</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../store.js'

const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')

const handleLogin = () => {
  error.value = ''

  if (!email.value || !password.value) {
    error.value = 'Vui lòng nhập đầy đủ thông tin'
    return
  }

  const user = store.users.find(
    u => u.email === email.value && u.password === password.value
  )

  if (!user) {
    error.value = 'Email hoặc mật khẩu không đúng'
    return
  }

  store.login(user)
  router.push('/profile')
}
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 80px auto;
  padding: 25px;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 0 15px rgba(0,0,0,0.1);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

input {
  width: 100%;
  padding: 10px;
  margin-bottom: 12px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

button {
  width: 100%;
  padding: 10px;
  background: #42b983;
  border: none;
  color: white;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
}

.error {
  color: red;
  font-size: 14px;
  margin-bottom: 10px;
}

.switch {
  margin-top: 15px;
  text-align: center;
}
</style>
