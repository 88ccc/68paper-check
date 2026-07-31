import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useWebsitConfigStore = defineStore('websitConfig', () => {
  const apiUrl = ref('')
  const webIsInit = ref(false);
  const joinUrl = ref("");
  const custom = ref({
    url: "",
  })
  const webSet = ref({
    title: "",
    favicon: "",
    logo: "",
    miniLogo: "",
    themeColor: "",
    homeTitle: "",
    homeDesc: ""
  })


  return { apiUrl, custom, webIsInit, webSet, joinUrl }
})