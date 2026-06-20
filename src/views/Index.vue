<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useProductConfigStore } from '@/stores/productConfig'
import { storeToRefs } from "pinia"
import { useRouter } from 'vue-router'

const { brand } = storeToRefs(useProductConfigStore());
const router = useRouter()

onMounted(async () => {
  if (brand.value == "wanfang") {
    document.title = "万方论文查重检测系统入口-24小时自助检测";
  } else if (brand.value == "weipu") {
    document.title = "维普论文查重检测系统入口-24小时自助检测";
  } else if (brand.value == "zhiwang") {
    document.title = "知网论文查重检测系统入口-24小时自助检测";
  }
})
</script>


<template>
  <div class="index-page">
    <!-- 导航栏 -->
    <div class="navbar">
      <div class="nav-content">
        <div v-if="brand == 'mix'" class="logo">
          <span class="logo-icon">📚</span>
          <span class="logo-text">论文查重检测系统</span>
        </div>
        <div v-if="brand == 'wanfang'">
          <img class="wanfang-logo-big-1" src="/images/wanfanghome.svg">
          <img class="wanfang-logo-small-1" src="/images/wanfang.png">
        </div>
        <div v-if="brand == 'weipu'">
          <img class="weipu-logo-big-1" src="/images/weipulogo.png"></img>
          <img class="weipu-logo-small-1" src="/images/weipu_small.png"></img>
        </div>
        <ResponsiveNav />
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
  background: #fff;
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

.wanfang-logo-big-1 {
  height: 60px;
}

.weipu-logo-big-1 {
  height: 50px;
}

.wanfang-logo-small-1 {
  display: none;
}

.weipu-logo-small-1 {
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




@media (max-width: 920px) {
  .wanfang-logo-big-1 {
    display: none;
  }

  .wanfang-logo-small-1 {
    display: block;
  }

  .weipu-logo-big-1 {
    display: none;
  }

  .weipu-logo-small-1 {
    height: 40px;
    display: block;
  }
}
</style>