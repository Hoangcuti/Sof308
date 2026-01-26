<template>
  <div class="profile-page">
    <h2>Hồ sơ cá nhân</h2>

    <!-- Thông tin đăng ký -->
    <div class="profile-box">
      <h3>Thông tin tài khoản</h3>

      <ProfileRow label="Họ tên">
        <input type="text" :value="user.name" disabled />
      </ProfileRow>

      <ProfileRow label="Email">
        <input type="email" :value="user.email" disabled />
      </ProfileRow>

      <ProfileRow label="Số điện thoại">
        <input type="text" :value="user.phone" disabled />
      </ProfileRow>
    </div>

    <!-- Thông tin cá nhân -->
    <div class="profile-box">
      <h3>Thông tin cá nhân</h3>

      <ProfileRow label="Tiểu sử">
        <textarea v-model="profile.bio" rows="3" />
      </ProfileRow>

      <ProfileRow label="Ngày sinh">
        <input type="date" v-model="profile.birthday" />
      </ProfileRow>

      <ProfileRow label="Giới tính">
        <select v-model="profile.gender">
          <option value="">-- Chọn --</option>
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
          <option value="Khác">Khác</option>
        </select>
      </ProfileRow>

      <button class="save-btn" @click="saveProfile">
        Lưu thông tin
      </button>
    </div>
  </div>
</template>

<script>
import ProfileRow from '../components/ProfileRow.vue'

export default {
  name: 'ProfileView',
  components: {
    ProfileRow
  },
  data() {
    return {
      user: {},
      profile: {
        bio: '',
        birthday: '',
        gender: ''
      }
    }
  },
  mounted() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))

    if (currentUser) {
      this.user = currentUser

      // Nếu đã có profile trước đó
      if (currentUser.profile) {
        this.profile = { ...currentUser.profile }
      }
    }
  },
  methods: {
    saveProfile() {
      const updatedUser = {
        ...this.user,
        profile: this.profile
      }

      localStorage.setItem('currentUser', JSON.stringify(updatedUser))
      this.user = updatedUser

      alert('Cập nhật hồ sơ thành công!')
    }
  }
}
</script>

<style scoped>
.profile-page {
  max-width: 700px;
  margin: 30px auto;
}

.profile-box {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

h2 {
  text-align: center;
  margin-bottom: 24px;
}

h3 {
  margin-bottom: 16px;
}

input,
textarea,
select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

input:disabled {
  background: #f3f3f3;
}

.save-btn {
  margin-top: 12px;
  padding: 10px 18px;
  background: #333;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
