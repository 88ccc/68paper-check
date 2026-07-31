import { createRouter, createWebHistory } from 'vue-router'
import { useWebsitConfigStore } from '@/stores/websitConfig'
import { useProductConfigStore } from '@/stores/productConfig'
import { storeToRefs } from "pinia"
import { paxios } from '@/utils/paxios'

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
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
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

router.beforeEach(async (to, from, next) => {
  const { webIsInit, apiUrl, webSet, joinUrl } = storeToRefs(useWebsitConfigStore());
  const { productList, endtimeId } = storeToRefs(useProductConfigStore());
  try {
    if (!webIsInit.value) {
      const res = await fetch('/config.json');
      const config = await res.json();
      apiUrl.value = config.apiUrl;
      const pres = await fetch('/product.json');
      const product = await pres.json();
      if (product.web) {
        webSet.value.title = product.web.title;
        webSet.value.favicon = product.web.favicon;
        webSet.value.logo = product.web.logo;
        webSet.value.miniLogo = product.web.miniLogo;
        webSet.value.themeColor = product.web.themeColor;
        webSet.value.homeTitle = product.web.homeTitle;
        webSet.value.homeDesc = product.web.homeDesc;
      }
      if (Array.isArray(product.end_time_id) && (product.end_time_id.length > 0)) {
        for (let i = 0; i < product.end_time_id.length; i++) {
          endtimeId.value.push(product.end_time_id[i].id)
        }
      }

      if (Array.isArray(product.products) && (product.products.length > 0)) {
        productList.value = product.products
      }

      const cpres = await paxios.get("/check/product_info");
      if (cpres.data.code == 0) {
        let pdata = cpres.data.data;
        for (let i = 0; i < productList.value.length; i++) {
          for (let k = 0; k < pdata.length; k++) {
            if (productList.value[i].id == pdata[k].id) {
              if (pdata[k].status != 1) {
                productList.value.splice(i, 1);
                i--;
                break;
              }
              productList.value[i].price = pdata[k].price
              productList.value[i].unit = pdata[k].unit
              productList.value[i].config = pdata[k].config
              break;
            }
          }
        }
        for (let i = 0; i < productList.value.length; i++) {
          if (productList.value[i].price == 0) {
            productList.value.splice(i, 1);
            i--;
          }
        }
      } else {
        ElMessage.error("获取产品信息失败")
      }
      const jres = await paxios.get("/check/get_join_url");
      if (jres.data.code == 0) {
        joinUrl.value = jres.data.data.join_url;
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
