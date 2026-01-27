<template>
    <div class="row">
      <span>{{ label }}</span>
  
      <template v-if="edit">
        <input v-model="localValue" />
      </template>
  
      <template v-else>
        <span :class="{ empty: !value }">
          {{ value || 'Thiết lập ngay' }}
        </span>
      </template>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    label: String,
    value: String,
    edit: Boolean
  })
  
  const emit = defineEmits(['update:modelValue'])
  
  const localValue = computed({
    get: () => props.value,
    set: v => emit('update:modelValue', v)
  })
  </script>
  
  <style>
  .row {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid #eee;
  }
  .empty {
    color: #ff4d4f;
  }
  </style>
  