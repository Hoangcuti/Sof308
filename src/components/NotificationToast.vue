<template>
  <transition name="toast">
    <div v-if="store.notification.show" class="toast-container" :class="store.notification.type">
      <div class="toast-content">
        <i class="fas fa-check-circle me-2"></i>
        <span>{{ store.notification.message }}</span>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { store } from '../store';
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10001;
  min-width: 250px;
  padding: 15px 20px;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  border-left: 5px solid #28a745;
}

.toast-container.success {
  border-left-color: #28a745;
}

.toast-container.error {
  border-left-color: #dc3545;
}

.toast-content {
  display: flex;
  align-items: center;
  font-family: 'Roboto Flex', sans-serif;
  color: #333;
}

.toast-content i {
  color: #28a745;
  font-size: 1.2rem;
}

/* Transitions */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s ease;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
