import { createRouter, createWebHistory } from 'vue-router'
import { useWebsitConfigStore } from '@/stores/websitConfig'
import { useProductConfigStore } from '@/stores/productConfig'
import { storeToRefs } from "pinia"
import { paxios } from '@/utils/paxios'
import { CompleteUrl } from '@/utils/utils'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/Index.vue'),
      children: [
        {
          path: '',
          name: 'Home',
          component: () => import('@/views/Home.vue'),

        }, {
          path: '/check',
          name: 'Check',
          component: () => import('@/views/Check.vue'),
        },
        {
          path: '/report',
          name: 'Report',
          component: () => import('@/views/Report.vue'),
        },
        {
          path: '/faq',
          name: 'FAQ',
          component: () => import('@/views/FAQ.vue'),
        }
      ]
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    // 如果有锚点，自动滚动到锚点元素
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth' // 平滑滚动（可选）
      }
    }
    // 没有锚点则回到顶部
    return { top: 0 }
  }
})


const setFavicon = (iconPath: string) => {
  // 查找现有 favicon 标签
  let link = document.querySelector<HTMLLinkElement>('link[rel*="icon"]');

  if (link) {
    // 若存在则直接修改 href
    link.href = iconPath;
  } else {
    // 若不存在则创建新标签
    link = document.createElement('link');
    link.rel = 'icon';
    link.href = iconPath;
    document.head.appendChild(link);
  }
};

router.beforeEach(async (to, from, next) => {
  const { custom, webIsInit, apiUrl, shopId } = storeToRefs(useWebsitConfigStore());
  const { wanfang, weipu, zhiwang, endtimeId } = storeToRefs(useProductConfigStore());
  try {
    if (!webIsInit.value) {
      const res = await fetch('/config.json');
      const config = await res.json();
      apiUrl.value = config.apiUrl;
      shopId.value = config.shopId;
      const conres = await paxios.get("/index/getAllConfig");
      if (conres.data.code == 0) {
        custom.value.url = CompleteUrl(conres.data.data.custom.url)
      }
      const pres = await fetch('/product.json');
      const product = await pres.json();
      if (Array.isArray(product.end_time_id) && (product.end_time_id.length > 0)) {
        for (let i = 0; i < product.end_time_id.length; i++) {
          endtimeId.value.push(product.end_time_id[i].id)
        }
      }
      if (Array.isArray(product.wanfang) && (product.wanfang.length > 0)) {
        wanfang.value = product.wanfang
      }
      if (Array.isArray(product.weipu) && (product.weipu.length > 0)) {
        weipu.value = product.weipu
      }
      if (Array.isArray(product.zhiwang) && (product.zhiwang.length > 0)) {
        zhiwang.value = product.zhiwang
      }
      const cpres = await paxios.get("/index/getAllProduct?shopid=" + shopId.value);
      if (cpres.data.code == 0) {
        let pdata = cpres.data.data;
        for (let i = 0; i < wanfang.value.length; i++) {
          for (let k = 0; i < pdata.length; k++) {
            if (wanfang.value[i].id == pdata[k].id) {
              if (pdata[k].status != 1) {
                wanfang.value.splice(i, 1);
                i--;
                break;
              }
              wanfang.value[i].price = pdata[k].price
              wanfang.value[i].unit = pdata[k].unit
              wanfang.value[i].config = pdata[k].config
              break;
            }
          }
        }
        for (let i = 0; i < weipu.value.length; i++) {
          for (let k = 0; i < pdata.length; k++) {
            if (weipu.value[i].id == pdata[k].id) {
              if (pdata[k].status != 1) {
                weipu.value.splice(i, 1);
                i--;
                break;
              }
              weipu.value[i].price = pdata[k].price
              weipu.value[i].unit = pdata[k].unit
              weipu.value[i].config = pdata[k].config
              break;
            }
          }
        }
        for (let i = 0; i < zhiwang.value.length; i++) {
          for (let k = 0; i < pdata.length; k++) {
            if (zhiwang.value[i].id == pdata[k].id) {
              if (pdata[k].status != 1) {
                zhiwang.value.splice(i, 1);
                i--;
                break;
              }
              zhiwang.value[i].price = pdata[k].price
              zhiwang.value[i].unit = pdata[k].unit
              zhiwang.value[i].config = pdata[k].config
              break;
            }
          }
        }
      } else {
        ElMessage.error("获取产品信息失败")
      }
      webIsInit.value = true;
    }
    next();
  } catch (err) {
    // 4. 配置加载失败：跳转到错误页或提示
    //next('/config-error'); 
    console.log("配置初始化失败")
    console.log(err)
    next();
  }


})


export default router
