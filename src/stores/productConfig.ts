import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useProductConfigStore = defineStore('productConfig', () => {
  const productList = ref(<any[]>[]);
  const endtimeId = ref(<string[]>[]);
  return { productList, endtimeId }
})