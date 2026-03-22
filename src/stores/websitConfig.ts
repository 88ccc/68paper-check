import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useWebsitConfigStore = defineStore('websitConfig', () => {
  const apiUrl = ref('')
  const shopId = ref('')
  const webIsInit = ref(false);
  const custom = ref({
    url: "",
  })


  return { apiUrl, shopId, custom, webIsInit }
})