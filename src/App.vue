<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { store } from './store';
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';

const router = useRouter();

// Global Login Modal State managed here for simplicity
const showLoginModal = ref(false);
const activeForm = ref('login');
const loginData = ref({ username: '', password: '' });
const registerData = ref({ username: '', password: '', confirmPassword: '' });
const showPass = ref(false);

const openLogin = () => {
    showLoginModal.value = true;
    activeForm.value = 'login';
};

const handleLogin = () => {
    if (!loginData.value.username || !loginData.value.password) return;
    
    // Mock Login
    let role = 'user';
    if (loginData.value.username === 'admin' && loginData.value.password === 'admin') {
        role = 'admin';
    }
    
    const user = {
        username: loginData.value.username,
        email: role === 'admin' ? 'admin@louisvuitton.com' : 'user@example.com',
        role: role
    };
    
    store.login(user);
    alert('Đăng nhập thành công!');
    showLoginModal.value = false;
    
    if (role === 'admin') router.push('/admin');
};

const handleLogout = () => {
    store.logout();
    router.push('/');
}

const handleRegister = () => {
    // Basic validation
    if (registerData.value.password !== registerData.value.confirmPassword) {
        alert('Mật khẩu không khớp');
        return;
    }
    alert('Đăng ký thành công!');
    activeForm.value = 'login';
}

const cartCount = computed(() => store.cart.length);
</script>

<template>
  <div class="app-container">
    <AppHeader 
      :isLoggedIn="store.isLoggedIn" 
      :currentUser="store.currentUser" 
      :cartCount="cartCount"
      @open-login="openLogin"
      @logout="handleLogout"
    />
    
    <router-view />
    
    <AppFooter />
    
    <!-- Global Login Modal -->
    <div v-if="showLoginModal" class="popup-form active">
      <div class="popup-header">
        <h2 id="popup-title">{{ activeForm === 'login' ? 'Đăng Nhập' : 'Đăng Ký' }}</h2>
        <span class="close-popup" @click="showLoginModal = false">&times;</span>
      </div>

      <div class="popup-body">
        <div v-if="activeForm === 'login'">
          <form @submit.prevent="handleLogin">
            <input type="text" v-model="loginData.username" placeholder="Tên đăng nhập" required />
            <div class="password-container">
              <input :type="showPass ? 'text' : 'password'" v-model="loginData.password" placeholder="Mật khẩu" required />
              <span class="toggle-password" @click="showPass = !showPass">👁️</span>
            </div>
            <button type="submit">Đăng nhập</button>
          </form>
          <a href="#" class="small-link" @click="activeForm = 'register'">Chưa có tài khoản? Đăng ký</a>
        </div>

        <div v-if="activeForm === 'register'">
          <form @submit.prevent="handleRegister">
            <input type="text" v-model="registerData.username" placeholder="Tên đăng nhập" required />
            <div class="password-container">
              <input :type="showPass ? 'text' : 'password'" v-model="registerData.password" placeholder="Mật khẩu" required />
            </div>
             <div class="password-container">
              <input type="password" v-model="registerData.confirmPassword" placeholder="Xác nhận" required />
            </div>
            <button type="submit">Đăng ký</button>
          </form>
          <a href="#" class="small-link" @click="activeForm = 'login'">Đã có tài khoản? Đăng nhập</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Global Styles from asm.css */
body {
  font-family: 'Oswald', sans-serif;
  color: #303030;
  margin: 0;
  padding: 0;
}

.password-container { position: relative; margin-bottom: 15px; }
.password-container input { width: 100%; padding: 10px; padding-right: 40px; }
.toggle-password { position: absolute; top: 10px; right: 10px; cursor: pointer; }

/* Modal specific styles needed globally */
.popup-form {
  position: fixed;
  top: 0;
  right: 0; /* Active by default when v-if is true */
  width: 350px;
  height: 100%;
  background-color: white;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.2);
  z-index: 10000;
  padding: 30px 20px;
}
.popup-header { display: flex; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
.close-popup { cursor: pointer; color: red; font-size: 24px; }
.popup-body input { width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; }
.popup-body button { width: 100%; padding: 10px; background: black; color: white; border: none; cursor: pointer; }
.small-link { display: block; text-align: center; margin-top: 15px; font-size: 0.9em; text-decoration: none; color: #666; }

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
