import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useWxOpenidStore = defineStore('WxOpenid', () => {
  const openid = ref('')
  return { openid }
})