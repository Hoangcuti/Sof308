<template>
  <div class="profile-page">
    <div class="profile-container">
      <h2>Hồ sơ cá nhân</h2>

      <!-- Account Settings -->
      <section class="profile-section">
        <div class="section-header">
          <i class="fas fa-user-circle"></i>
          <h3>Thông tin tài khoản</h3>
        </div>
        
        <div class="input-group">
          <label>Họ tên</label>
          <input type="text" v-model="userForm.name" placeholder="Nhập họ tên của bạn" />
        </div>

        <div class="input-group">
          <label>Email</label>
          <input type="email" v-model="userForm.email" placeholder="Nhập địa chỉ email" />
        </div>

        <div class="input-group">
          <label>Số điện thoại</label>
          <input type="text" v-model="userForm.phone" placeholder="Nhập số điện thoại" />
        </div>
      </section>

      <!-- Personal Details -->
      <section class="profile-section">
        <div class="section-header">
          <i class="fas fa-info-circle"></i>
          <h3>Thông tin cá nhân</h3>
        </div>

        <div class="input-group">
          <label>Tiểu sử</label>
          <textarea v-model="userForm.profile.bio" rows="4" placeholder="Một vài dòng giới thiệu về bản thân..."></textarea>
        </div>

        <div class="row-inputs">
          <div class="input-group">
            <label>Ngày sinh</label>
            <input type="date" v-model="userForm.profile.birthday" />
          </div>

          <div class="input-group">
            <label>Giới tính</label>
            <select v-model="userForm.profile.gender">
              <option value="">Chọn giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>
        </div>
      </section>

      <div class="actions">
        <button class="save-btn" @click="handleSave" :disabled="isSaving">
          <span v-if="!isSaving">Lưu thay đổi</span>
          <span v-else>Đang lưu...</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref } from 'vue'
import { store } from '../store.js'

const isSaving = ref(false)

const userForm = reactive({
  name: '',
  email: '',
  phone: '',
  profile: {
    bio: '',
    birthday: '',
    gender: ''
  }
})

const loadUserData = () => {
  const user = store.currentUser
  if (user) {
    // Fill top level info
    userForm.name = user.name || (user.profile && user.profile.name) || ''
    userForm.email = user.email || (user.profile && user.profile.email) || ''
    userForm.phone = user.phone || (user.profile && user.profile.phone) || ''
    
    // Fill profile object info
    if (user.profile) {
      userForm.profile.bio = user.profile.bio || ''
      userForm.profile.birthday = user.profile.birthday || ''
      userForm.profile.gender = user.profile.gender || ''
    }
  }
}

onMounted(() => {
  loadUserData()
})

const handleSave = async () => {
  isSaving.value = true
  
  try {
    const updatedData = {
      name: userForm.name,
      email: userForm.email,
      phone: userForm.phone,
      profile: {
        ...userForm.profile,
        name: userForm.name,
        email: userForm.email,
        phone: userForm.phone
      }
    }
    
    await store.updateUser(updatedData)
    // Small delay to feel the interaction
    await new Promise(resolve => setTimeout(resolve, 500))
  } catch (error) {
    console.error('Lỗi khi lưu profile:', error)
    alert('Có lỗi xảy ra khi lưu thông tin.')
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.profile-page {
  min-height: calc(100vh - 200px);
  background-color: #f8f9fa;
  padding: 40px 20px;
}

.profile-container {
  max-width: 800px;
  margin: 0 auto;
}

h2 {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 30px;
  text-align: center;
  font-weight: 700;
}

.profile-section {
  background: #ffffff;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid #edf2f7;
}

.section-header i {
  font-size: 1.5rem;
  color: #3498db;
}

.section-header h3 {
  font-size: 1.25rem;
  color: #2d3436;
  font-weight: 600;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #636e72;
  margin-bottom: 8px;
}

input,
textarea,
select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #edeff2;
  border-radius: 10px;
  font-size: 1rem;
  color: #2d3436;
  transition: all 0.3s ease;
  background-color: #fdfdfd;
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: #3498db;
  background-color: #fff;
  box-shadow: 0 0 0 4px rgba(52, 152, 219, 0.1);
}

textarea {
  resize: vertical;
}

.row-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 600px) {
  .row-inputs {
    grid-template-columns: 1fr;
  }
}

.actions {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.save-btn {
  background: linear-gradient(135deg, #2c3e50, #000000);
  color: #fff;
  padding: 16px 40px;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.save-btn:active:not(:disabled) {
  transform: translateY(0);
}

.save-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
