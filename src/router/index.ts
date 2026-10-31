import { createRouter, createWebHistory } from 'vue-router'
import { useWebsitConfigStore } from '@/stores/websitConfig'
import { useProductConfigStore } from '@/stores/productConfig'
import { storeToRefs } from "pinia"
import { paxios } from '@/utils/paxios'
import { useLayoutConfigStore } from '@/stores/layoutConfig'

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
          path: '/zpcheck',
          name: 'ZPCheck',
          component: () => import('@/views/ZPCheck.vue'),
        },
        {
          path: '/rewrite',
          name: 'rewrite',
          component: () => import('@/views/ReWrite.vue'),
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

function convertNumberToUnit(num: number) {
  // 转为有效数字
  const number = Number(num);
  if (isNaN(number)) return '';

  // 0 特殊处理
  if (number === 0) return '篇';

  // 1️⃣ 整万倍数（最高优先级）
  if (number % 10000 === 0) {
    const val = number / 10000;
    return val === 1 ? '万字符' : `${val}万字符`;
  }

  // 2️⃣ 整千倍数
  if (number % 1000 === 0) {
    const val = number / 1000;
    return val === 1 ? '千字符' : `${val}千字符`;
  }

  // 3️⃣ 整百倍数
  if (number % 100 === 0) {
    const val = number / 100;
    return val === 1 ? '百字符' : `${val}百字符`;
  }

  // 都不满足，原样返回
  return String(number) + '字符';
}


router.beforeEach(async (to, from, next) => {
  const { webIsInit, apiUrl, webSet, joinUrl } = storeToRefs(useWebsitConfigStore());
  const { productList, endtimeId } = storeToRefs(useProductConfigStore());
  const { homeProductArray,productGroup } = storeToRefs(useLayoutConfigStore());
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
      try {
        const layoutRes = await fetch('/layout.json');
        const layoutConfig = await layoutRes.json();
        let homeProductList = null;
              if (layoutConfig.home && layoutConfig.home.data) {
        homeProductList = layoutConfig.home.data;
      }
      if (homeProductList) {
        for (let i = 0; i < homeProductList.length; i++) {
          if (homeProductList[i].products.length > 0) {
            //字符串分割成数组
            let products = homeProductList[i].products.split(',');
            for (let j = 0; j < products.length; j++) {
              products[j] = products[j].trim();
              let find = false;
              for (let m = 0; m < productList.value.length; m++) {
                if (productList.value[m].id == products[j]) {
                  products[j] = productList.value[m].id;
                  find = true;
                  break;
                }
              }
              if (!find) {
                products.splice(j, 1);
                j--;
              }
            }
            if (products.length > 0) {
              homeProductArray.value.push({
                title: homeProductList[i].title,
                desc: homeProductList[i].desc,
                products: products
              })
            }

          } else {
            continue;
          }
        }
      }
      if (layoutConfig.group) {
        for (let i = 0; i < layoutConfig.group.length; i++) {
          let items = layoutConfig.group[i].data;
          let gp = [];
          for (let j = 0; j < items.length; j++) {
            let find = false;
            for (let m = 0; m < productList.value.length; m++) {
              if (productList.value[m].id == items[j].id) {
                gp.push({
                  id: productList.value[m].id,
                  name: productList.value[m].name,
                  purpose: items[j].purpose,
                  price: "" + (productList.value[m].price / 100).toFixed(2) + "元/" + convertNumberToUnit(productList.value[m].unit)
                })
                find = true;
                break;
              }
            }
          }
          productGroup.value.push({
            items: gp
          })
        }
      }
      } catch (err) {
        console.log(err)
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
