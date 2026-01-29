<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { store } from './store';
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
import NotificationToast from './components/NotificationToast.vue';

const router = useRouter();

// Global Login Modal State managed here for simplicity
const showLoginModal = ref(false);
const activeForm = ref('login');
const loginData = ref({ username: '', password: '' });
const registerData = ref({ 
    username: '', 
    password: '', 
    confirmPassword: '',
    fullName: '',
    email: '',
    phone: ''
});
const showPass = ref(false);

const openLogin = () => {
    showLoginModal.value = true;
    activeForm.value = 'login';
};

const handleLogin = () => {
    if (!loginData.value.username || !loginData.value.password) return;
    
    // Find user in store
    const user = store.users.find(u => 
        (u.username === loginData.value.username || u.email === loginData.value.username) && 
        u.password === loginData.value.password
    );
    
    if (user) {
        store.login(user);
        alert('Đăng nhập thành công!');
        showLoginModal.value = false;
        if (user.role === 'admin') router.push('/admin');
        else router.push('/profile');
    } else {
        alert('Tên đăng nhập hoặc mật khẩu không đúng');
    }
};

const handleLogout = () => {
    store.logout();
    router.push('/');
}

const handleRegister = async () => {
    const { username, password, confirmPassword, fullName, email, phone } = registerData.value;

    // Validation
    if (!username || !password || !confirmPassword || !fullName || !email || !phone) {
        alert('Vui lòng điền đầy đủ tất cả các trường thông tin');
        return;
    }

    if (password !== confirmPassword) {
        alert('Mật khẩu xác nhận không khớp');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Định dạng email không hợp lệ');
        return;
    }

    // Phone validation (basic)
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(phone)) {
        alert('Số điện thoại phải có từ 10-11 chữ số');
        return;
    }

    // Check if user exists
    if (store.users.find(u => u.username === username)) {
        alert('Tên đăng nhập đã tồn tại');
        return;
    }

    if (store.users.find(u => u.email === email)) {
        alert('Email này đã được sử dụng');
        return;
    }

    try {
        await store.register({
            username: username,
            password: password,
            role: 'user',
            name: fullName,
            email: email,
            phone: phone,
            profile: {
                name: fullName,
                email: email,
                phone: phone,
                bio: '',
                gender: '',
                birthday: ''
            }
        });

        alert('Đăng ký thành công!');
        // Clear form
        registerData.value = { username: '', password: '', confirmPassword: '', fullName: '', email: '', phone: '' };
        activeForm.value = 'login';
    } catch (error) {
        alert('Đã có lỗi xảy ra khi đăng ký.');
    }
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

    <NotificationToast />
    
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
            <input type="text" v-model="loginData.username" placeholder="Tên đăng nhập hoặc Email" required />
            <div class="password-container">
              <input :type="showPass ? 'text' : 'password'" v-model="loginData.password" placeholder="Mật khẩu" required />
              <span class="toggle-password" @click="showPass = !showPass">👁️</span>
            </div>
            <button type="submit">Đăng nhập</button>
          </form>
          <a href="#" class="small-link" @click="activeForm = 'register'">Chưa có tài khoản? Đăng ký</a>
        </div>

        <div v-if="activeForm === 'register'" class="register-form-scroll">
          <form @submit.prevent="handleRegister">
            <input type="text" v-model="registerData.fullName" placeholder="Họ và tên" required />
            <input type="email" v-model="registerData.email" placeholder="Email" required />
            <input type="text" v-model="registerData.phone" placeholder="Số điện thoại" required />
            <input type="text" v-model="registerData.username" placeholder="Tên đăng nhập" required />
            
            <div class="password-container">
              <input :type="showPass ? 'text' : 'password'" v-model="registerData.password" placeholder="Mật khẩu (ít nhất 6 ký tự)" required />
            </div>
             <div class="password-container">
              <input type="password" v-model="registerData.confirmPassword" placeholder="Xác nhận mật khẩu" required />
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
.popup-body input { width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; }
.popup-body button { width: 100%; padding: 12px; background: black; color: white; border: none; cursor: pointer; border-radius: 4px; font-weight: 600; margin-top: 10px; }
.register-form-scroll { max-height: 500px; overflow-y: auto; padding-right: 5px; }
.register-form-scroll::-webkit-scrollbar { width: 5px; }
.register-form-scroll::-webkit-scrollbar-thumb { background: #eee; border-radius: 10px; }
.small-link { display: block; text-align: center; margin-top: 15px; font-size: 0.9em; text-decoration: none; color: #666; }

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
