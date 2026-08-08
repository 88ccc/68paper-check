<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterView } from 'vue-router'
import { storeToRefs } from "pinia"
import { useRouter, useRoute } from 'vue-router'
import { useWebsitConfigStore } from '@/stores/websitConfig'
import { setTheme } from '@/utils/theme-color'

const { webSet, joinUrl } = storeToRefs(useWebsitConfigStore());
const router = useRouter()
const route = useRoute();
const navRef = ref();


function changeFavicon(src: string) {
  const existingLink = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null;
  if (existingLink) {
    existingLink.href = src;
    return;
  }
  const link = document.createElement('link');
  link.type = 'image/x-icon';
  link.rel = 'icon';
  link.href = src;
  document.head.appendChild(link);
}

onMounted(async () => {
  setTheme(webSet.value.themeColor);
  document.title = webSet.value.title;
  changeFavicon(webSet.value.favicon);
})

function showCS() {
  navRef.value.showCS();
}

</script>


<template>
  <div class="index-page">
    <!-- 导航栏 -->
    <div class="navbar">
      <div class="nav-content">

        <div>
          <img class="logo-big-1" :src="webSet.logo">
          <img class="logo-small-1" :src="webSet.miniLogo">
        </div>

        <ResponsiveNav ref="navRef" />
      </div>
    </div>

    <RouterView />

    <!-- 底部 -->
    <div class="footer">
      <div class="footer-content">
        <div class="footer-links">
          <el-link @click="router.push('/')">首页</el-link>
          <el-link @click="router.push('/#myproduct')">论文查重</el-link>
          <el-link @click="router.push('/report')">报告下载</el-link>
          <el-link @click="router.push('/faq')">常见问题</el-link>
          <el-link @click="showCS()">联系客服</el-link>
          <el-link v-if="joinUrl" :href="joinUrl" target="_blank">加盟代理</el-link>
        </div>
        <div class="footer-copy">
          <p>© 2026 论文查重检测系统 版权所有</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.index-page {
  min-height: 100vh;
  background: #f5f7fa;
}

/* 导航栏 */
.navbar {
  background: var(--el-color-primary-light-8);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-big-1 {
  height: 55px;
}

.logo-small-1 {
  display: none;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  font-size: 36px;
}

.logo-text {
  font-size: 22px;
  font-weight: 600;
  color: #333;
}





/* 底部 */
.footer {
  background: #333;
  padding: 20px 20px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.footer-links {
  margin-bottom: 24px;
}

.footer-links .el-link {
  color: #999;
  margin: 0 16px;
  font-size: 15px;
}

.footer-links .el-link:hover {
  color: #fff;
}

.footer-copy p {
  color: #999;
  margin: 8px 0;
  font-size: 14px;
}




@media (max-width: 980px) {
  .logo-big-1 {
    display: none;
  }

  .logo-small-1 {
    max-height: 40px;
    display: block;
  }

}
</style>