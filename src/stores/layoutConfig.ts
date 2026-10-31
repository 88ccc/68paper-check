import { ref } from 'vue'
import { defineStore } from 'pinia'


interface HomeProduct {
 title: string;
 desc: string;
 products: string[];
}

interface GroupItem {
    id:string;
    name:string;
    purpose:string;
    price:string;
}

interface Group {
    items:GroupItem[];
}

export const useLayoutConfigStore = defineStore('layoutConfig', () => {
    const homeProductArray = ref(<HomeProduct[]>[]);
    const productGroup = ref(<Group[]>[]);

  return { homeProductArray,productGroup }
})