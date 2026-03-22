<template>
    <RouterView />
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { getBrowserType } from '@/utils/utils'
import { paxios } from '@/utils/paxios'
import { storeToRefs } from "pinia"
import { useWxOpenidStore } from '@/stores/wxopenid'
const route = useRoute();
const { openid } = storeToRefs(useWxOpenidStore());

onMounted(async ()=>{
    const browserType = getBrowserType();
    if (browserType == 'wechat') {
      let currentUrl = window.location.href;
      const code = route.query.code;
      if (code) {
        // 微信授权
        let res = await paxios.post("/index/getWechatAuthUserInfo", { code: code });
        if (res.data.code == 0) {
          //判断是否登录成功
          openid.value = res.data.data.openid;
          localStorage.setItem('openid', openid.value);
         
        } else {
          let localtopenid = localStorage.getItem('openid');
          if (localtopenid) {
            openid.value = localtopenid;
          } else {
            ElMessage.error(res.data.msg)
          }
        }
        console.log(res.data);
      } else {
        let res = await paxios.post("/index/getWechatAuthUrl", { url: currentUrl });
        if (res.data.code == 0) {
          window.location.href = res.data.data.url;
        } else {
          console.log(res.data.msg);
        }
      }

    }
})
</script>