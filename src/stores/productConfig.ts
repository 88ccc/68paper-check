import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useProductConfigStore = defineStore('productConfig', () => {
  const wanfang = ref(<any[]>[]);
  const weipu = ref(<any[]>[]);
  const zhiwang = ref(<any[]>[])
  const endtimeId = ref(<string[]>[]);
  const brand = ref(<'weipu' | 'wanfang' | 'zhiwang'| 'mix'>'mix');
  return { wanfang, weipu, zhiwang, endtimeId ,brand}
})