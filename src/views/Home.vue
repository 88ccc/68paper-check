<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ResponsiveNav from '@/components/ResponsiveNav.vue'
import { useWebsitConfigStore } from '@/stores/websitConfig'
import { useProductConfigStore } from '@/stores/productConfig'
import { storeToRefs } from "pinia"
import { paxios } from '@/utils/paxios'


const { custom, webIsInit, apiUrl, shopId } = storeToRefs(useWebsitConfigStore());
const { wanfang, weipu, zhiwang } = storeToRefs(useProductConfigStore());

const router = useRouter()
const showCustomerService = ref(false)
const showWanfang = ref(false)
const showWeipu = ref(false)
const showZhiwang = ref(false)
const wanfangdes = ref("万方文献相似性查重检测服务采用科学先进的检测技术，实现海量学术文献数据全文比对，秉持客观、公正、精准、全面的服务原则，为用户提供精准详实多维度的查重检测报告。提供包括万方通用版、硕博论文版、大学生论文版、职称论文版等，查重检测结果客观、准确、详实！")
const weipudes = ref("维普论文检测系统入口提供24小时在线论文查重，可以快速准确地检测出毕业论文，博士硕士论文，期刊论文等论文中过度和不当的引用及抄袭伪造篡改等学术不端行为。 检测报告支持官网验证真伪。 维普论文查重有多个版本，维普大学生版，维普研究生版，维普职称版。满足各类人群的需要。")
const zhiwangdes = ref("")
const pinpdes = ref('');
// 跳转到检测页面
const goToCheck = (type: string) => {
  if (type.length < 2) {
    document.getElementById('myproduct')?.scrollIntoView({ behavior: 'smooth' });
    return;
  }
  router.push({ name: 'Check', query: { type } })
}

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

onMounted(() => {
  if (Array.isArray(wanfang.value) && wanfang.value.length) {
    showWanfang.value = true;
    if (pinpdes.value.length > 1) {
      pinpdes.value = pinpdes.value + "、"
    }
    pinpdes.value = pinpdes.value + "万方"
  } else {
    showWanfang.value = false;
  }
  if (Array.isArray(weipu.value) && weipu.value.length) {
    showWeipu.value = true;
    if (pinpdes.value.length > 1) {
      pinpdes.value = pinpdes.value + "、"
    }
    pinpdes.value = pinpdes.value + "维普"
  } else {
    showWeipu.value = false;
  }
  if (Array.isArray(zhiwang.value) && zhiwang.value.length) {
    showZhiwang.value = true;
    if (pinpdes.value.length > 1) {
      pinpdes.value = pinpdes.value + "、"
    }
    pinpdes.value = pinpdes.value + "知网"
  } else {
    showZhiwang.value = false;
  }

})


</script>

<template>
  <div class="home-page">
    <!-- 导航栏 -->
    <div class="navbar">
      <div class="nav-content">
        <div class="logo">
          <span class="logo-icon">📚</span>
          <span class="logo-text">论文查重检测系统</span>
        </div>
        <ResponsiveNav :customer-service-action="() => showCustomerService = true" />
      </div>
    </div>

    <!-- Hero区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">

            <span class="gradient-text">论文检测系统</span>
          </h1>
          <p class="hero-desc">
            专业、安全、快速的论文查重与AIGC检测服务
            <br>
            帮助您轻松通过论文检测，学术之路更顺畅
          </p>
          <p class="pinp-desc">
            我们提供多个权威品牌<span class="pinp-list">{{ pinpdes }}</span>
          </p>
          <p class="baoz-desc">
            报告支持官网验证真伪
          </p>

          <div class="trust-tags">
            <el-tag type="success">正版报告</el-tag>
            <el-tag type="primary">数据安全</el-tag>
            <el-tag type="warning">快速检测</el-tag>
            <el-tag type="info">24小时服务</el-tag>
          </div>
        </div>
        <div class="hero-image">
          <div class="illustration-container">
            <div class="illustration-bg">
              <div class="circle circle-1"></div>
              <div class="circle circle-2"></div>
              <div class="circle circle-3"></div>
            </div>
            <div class="illustration-content">
              <div class="document-card">
                <div class="document-lines">
                  <div class="line line-1"></div>
                  <div class="line line-2"></div>
                  <div class="line line-3"></div>
                  <div class="line line-4"></div>
                </div>
                <div class="document-badge">
                  <span class="badge-icon">✓</span>
                </div>
              </div>
              <div class="floating-icons">
                <div class="float-icon icon-1">🎯</div>
                <div class="float-icon icon-2">⚡</div>
                <div class="float-icon icon-3">📊</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 产品介绍 -->
    <div id="myproduct" class="products-section">
      <div class="section-title">
        <h2>权威检测产品</h2>
        <p>满足不同学术场景的检测需求</p>
      </div>
      <!--产品列表-->
      <div v-if="showWanfang">
        <el-alert :title="wanfangdes" type="info" effect="dark" :closable="false"></el-alert>
        <el-row>
          <el-col v-for="item in wanfang" :key="item.id" :xs="24" :sm="12" :md="12" :lg="6" :xl="6">

            <div class="checkitem">
              <div style="text-align: center;margin-top: 10px">
                <img :src="item.img">
              </div>
              <hr />
              <h4>{{ item.name }}</h4>
              <div style="padding: 5px 15px; min-height: 110px;">
                <p>{{ item.description }}</p>
              </div>
              <h5>{{ (item.price / 100).toFixed(2) }}/{{ convertNumberToUnit(item.unit) }}</h5>
              <div style="text-align: center">
                <el-button type="primary" @click="goToCheck(item.id)">去检测</el-button>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-if="showWeipu">
        <el-alert :title="weipudes" type="info" effect="dark" :closable="false"></el-alert>
        <el-row>
          <el-col v-for="item in weipu" :key="item.id" :xs="24" :sm="12" :md="12" :lg="6" :xl="6">

            <div class="checkitem">
              <div style="text-align: center;margin-top: 10px">
                <img :src="item.img">
              </div>
              <hr />
              <h4>{{ item.name }}</h4>
              <div style="padding: 5px 15px; min-height: 110px;">
                <p>{{ item.description }}</p>
              </div>
              <h5>{{ (item.price / 100).toFixed(2) }}/{{ convertNumberToUnit(item.unit) }}</h5>
              <div style="text-align: center">
                <el-button type="primary" @click="goToCheck(item.id)">去检测</el-button>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-if="showZhiwang">
        <el-alert :title="zhiwangdes" type="info" effect="dark" :closable="false"></el-alert>
        <el-row>
          <el-col v-for="item in zhiwang" :key="item.id" :xs="24" :sm="12" :md="12" :lg="6" :xl="6">

            <div class="checkitem">
              <div style="text-align: center;margin-top: 10px">
                <img :src="item.img">
              </div>
              <hr />
              <h4>{{ item.name }}</h4>
              <div style="padding: 5px 15px; min-height: 110px;">
                <p>{{ item.description }}</p>
              </div>
              <h5>{{ (item.price / 100).toFixed(2) }}/{{ convertNumberToUnit(item.unit) }}</h5>
              <div style="text-align: center">
                <el-button type="primary" @click="goToCheck(item.id)">去检测</el-button>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>


    </div>

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
          <p>多个权威品牌官方授权合作伙伴</p>
        </div>
      </div>
    </div>

    <!-- 客服二维码弹窗 -->
    <el-dialog v-model="showCustomerService" title="扫码添加客服微信" width="360px" center>
      <div class="qr-dialog-content">
        <div class="qr-image-container">
          <img :src="custom.url" alt="客服二维码" class="qr-code-image" />
        </div>
        <p class="qr-tip">使用微信扫描上方二维码添加客服</p>
        <p class="qr-tip-sub">工作日 9:00-21:00 在线服务</p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showCustomerService = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.home-page {
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

.nav-menu {
  display: flex;
  gap: 16px;
  align-items: center;
}

/* Hero区域 */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 80px 20px;
}

.hero-content {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.hero-title {
  font-size: 48px;
  color: #fff;
  margin-bottom: 24px;
  line-height: 1.4;
}

.gradient-text {
  background: linear-gradient(90deg, #ffd700 0%, #ffec8b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-desc {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 10px;
  line-height: 1.8;
}

.pinp-desc {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 10px;
  line-height: 1.8;
}

.baoz-desc {
  font-size: 20px;
  color: #EE82EE;
  margin-bottom: 25px;
  line-height: 1.8;
}

.pinp-list {
  color: #00FF00;
  font-weight: 700;
  margin-left: 5px;
}

.hero-buttons {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.hero-buttons .el-button {
  font-size: 16px;
  padding: 16px 32px;
  height: auto;
}

.trust-tags {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.trust-tags .el-tag {
  font-size: 14px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  color: #fff;
}

/* 插画容器 */
.illustration-container {
  position: relative;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.illustration-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  overflow: hidden;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
}

.circle-1 {
  width: 200px;
  height: 200px;
  top: -50px;
  right: -50px;
}

.circle-2 {
  width: 150px;
  height: 150px;
  bottom: -30px;
  left: -20px;
}

.circle-3 {
  width: 100px;
  height: 100px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.illustration-content {
  position: relative;
  z-index: 2;
}

.document-card {
  width: 220px;
  height: 280px;
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  transform: rotate(-5deg);
  transition: transform 0.3s;
}

.document-card:hover {
  transform: rotate(0deg) scale(1.05);
}

.document-lines {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.line {
  height: 12px;
  background: linear-gradient(90deg, #e4e7ed 0%, #f5f7fa 100%);
  border-radius: 6px;
}

.line-1 {
  width: 70%;
}

.line-2 {
  width: 90%;
}

.line-3 {
  width: 60%;
}

.line-4 {
  width: 85%;
}

.document-badge {
  position: absolute;
  top: -15px;
  right: -15px;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(103, 194, 58, 0.4);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }
}

.badge-icon {
  color: #fff;
  font-size: 24px;
  font-weight: 700;
}

.floating-icons {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.float-icon {
  position: absolute;
  width: 60px;
  height: 60px;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  animation: float 3s ease-in-out infinite;
}

.icon-1 {
  top: 30px;
  right: 0;
  animation-delay: 0s;
}

.icon-2 {
  bottom: 40px;
  left: 20px;
  animation-delay: 1s;
}

.icon-3 {
  top: 60%;
  right: -30px;
  animation-delay: 2s;
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-15px);
  }
}

/* 通用区块 */
.section-title {
  text-align: center;
  padding: 60px 0 40px;
}

.section-title h2 {
  font-size: 36px;
  color: #333;
  margin-bottom: 12px;
}

.section-title p {
  font-size: 18px;
  color: #666;
}

/* 产品介绍 */
.products-section {
  background: #fff;
  padding: 0 20px;
}







/* 二维码弹窗 */
.qr-dialog-content {
  text-align: center;
  padding: 20px 0;
}

.qr-image-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.qr-code-image {
  width: 250px;
  height: 250px;
  border-radius: 12px;
  border: 2px solid #e4e7ed;
}

.qr-tip {
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
  font-weight: 500;
}

.qr-tip-sub {
  font-size: 14px;
  color: #999;
  margin: 0;
}

/* 底部 */
.footer {
  background: #333;
  padding: 40px 20px;
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

/* 响应式设计 */
@media (max-width: 1024px) {
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .hero-buttons {
    justify-content: center;
  }

  .hero-image {
    display: none;
  }

  .trust-tags {
    justify-content: center;
  }



}

@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }

  .hero-title {
    font-size: 32px;
  }

  .hero-desc {
    font-size: 16px;
  }

  .pinp-desc {
    font-size: 16px;
  }

  .baoz-desc {
    font-size: 16px;
  }

  .hero-buttons .el-button {
    width: 100%;
  }

  .image-placeholder {
    display: none;
  }




}

@media (max-width: 480px) {
  .hero-section {
    padding: 40px 16px;
  }
}

/**产品列表 */
.checkitem {
  margin: 10px 10px 10px 10px;
  padding: 5px;
  background-color: #F8F8FF;
  border: 1px solid darkslategray;
  border-radius: 10px;
}

.checkitem h4 {
  font-weight: bold;
  font-size: 24px;
  color: black;
  margin-top: 3px;
  margin-bottom: 8px;
  margin-left: 2px;
}

.checkitem h5 {
  font-weight: bold;
  color: red;
  text-align: center;
  font-size: 18px;
  margin-top: 3px;
  margin-bottom: 8px;
  margin-left: 2px;
}
</style>
