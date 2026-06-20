<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductConfigStore } from '@/stores/productConfig'
import { storeToRefs } from "pinia"

const { wanfang, weipu, zhiwang, brand } = storeToRefs(useProductConfigStore());

const router = useRouter()
const showWanfang = ref(false)
const showWeipu = ref(false)
const showZhiwang = ref(false)
const wanfangdes = ref("万方文献相似性查重检测服务采用科学先进的检测技术，实现海量学术文献数据全文比对，秉持客观、公正、精准、全面的服务原则，为用户提供精准详实多维度的查重检测报告。提供包括万方通用版、硕博论文版、大学生论文版、职称论文版等，查重检测结果客观、准确、详实！")
const weipudes = ref("维普论文检测系统入口提供24小时在线论文查重，可以快速准确地检测出毕业论文，博士硕士论文，期刊论文等论文中过度和不当的引用及抄袭伪造篡改等学术不端行为。 检测报告支持官网验证真伪。 维普论文查重有多个版本，维普大学生版，维普研究生版，维普职称版。满足各类人群的需要。")
const zhiwangdes = ref("")
const pinpdes = ref('');
const systemtitle = ref('论文查重检测系统');
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
  if(brand.value == 'wanfang'){
    systemtitle.value = '万方论文检测系统'
  }else if(brand.value == 'weipu'){
    systemtitle.value = '维普论文检测系统'
  }else if(brand.value == 'zhiwang'){
    systemtitle.value = '知网论文检测系统'
  }
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
    <!-- Hero区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">

            <span class="gradient-text">{{ systemtitle }}</span>
          </h1>
          <p class="hero-desc">
            专业、安全、快速的论文查重与AIGC检测服务
            <br>
            帮助您轻松通过论文检测，学术之路更顺畅
          </p>
          <p v-if="brand == 'mix'" class="pinp-desc">
            我们提供多个权威品牌<span class="pinp-list">{{ pinpdes }}</span>
          </p>
          <p class="baoz-desc">
            报告支持验证真伪
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
        <h2>选择产品</h2>
        <p>满足不同学术场景的检测需求</p>
      </div>
      <!--产品列表-->
      <div v-if="showWanfang">
        <el-alert v-if="brand == 'mix'" :title="wanfangdes" type="info" effect="dark" :closable="false"></el-alert>
        <el-row>
          <el-col v-for="item in wanfang" :key="item.id" :xs="24" :sm="12" :md="12" :lg="6" :xl="6">

            <div class="checkitem">
              <div style="text-align: center;margin-top: 10px">
                <img :src="item.img">
              </div>
              <hr />
              <h4>{{ item.name }}</h4>
              <div style="padding: 5px 15px; min-height: 80px;">
                <p>{{ item.description }}</p>
              </div>
              <h5>{{ (item.price / 100).toFixed(2) }}元/{{ convertNumberToUnit(item.unit) }}</h5>
              <div style="text-align: center">
                <el-button type="primary" @click="goToCheck(item.id)">去检测</el-button>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-if="showWeipu">
        <el-row>
          <el-col v-for="item in weipu" :key="item.id" :xs="24" :sm="12" :md="12" :lg="6" :xl="6">

           <div class="checkitem">
              <div style="text-align: center;margin-top: 10px">
                <img :src="item.img">
              </div>
              <hr />
              <h4>{{ item.name }}</h4>
              <div style="padding: 5px 15px; min-height: 80px;">
                <p>{{ item.description }}</p>
              </div>
              <h5>{{ (item.price / 100).toFixed(2) }}元/{{ convertNumberToUnit(item.unit) }}</h5>
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
              <div style="padding: 5px 15px; min-height: 80px;">
                <p>{{ item.description }}</p>
              </div>
              <h5>{{ (item.price / 100).toFixed(2) }}元/{{ convertNumberToUnit(item.unit) }}</h5>
              <div style="text-align: center">
                <el-button type="primary" @click="goToCheck(item.id)">去检测</el-button>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>


    </div>


  </div>
</template>

<style scoped>
.home-page{
  min-height: calc(100vh - 188px);
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

@media (max-width: 560px) {
  .wanfang-logo-big {
    display: none;
  }

  .wanfang-logo-small {
    display: block;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 40px 16px;
  }

}

/**产品列表 */
.checkitem {
  margin: 15px 10px;
  padding: 20px;
  background: linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%);
  border: 1px solid #e8ecf4;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.checkitem::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.checkitem:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.18);
  border-color: #667eea;
  background: #abf7be;
}

.checkitem:hover::before {
  opacity: 1;
}

.checkitem img {
  transition: transform 0.3s ease;
  max-width: 100%;
}

.checkitem:hover img {
  transform: scale(1.05);
}

.checkitem hr {
  border: none;
  height: 1px;
  background: linear-gradient(90deg, transparent, #e0e4ee, transparent);
  margin: 15px 0;
}

.checkitem h4 {
  font-weight: 600;
  font-size: 18px;
  color: #2c3e50;
  margin-top: 5px;
  margin-bottom: 10px;
  text-align: center;
  line-height: 1.4;
}

.checkitem p {
  font-size: 14px;
  color: #6b7c93;
  line-height: 1.7;
  text-align: justify;
}

.checkitem h5 {
  font-weight: 600;
  color: #e74c3c;
  text-align: center;
  font-size: 20px;
  margin: 15px 0;
  padding: 8px 0;
  background: linear-gradient(135deg, #fff5f5 0%, #fff 100%);
  border-radius: 8px;
  border: 1px dashed #fadbd8;
}

.checkitem :deep(.el-button) {
  width: 100%;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 500;
  border-radius: 25px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.checkitem :deep(.el-button:hover) {
  background: linear-gradient(135deg, #5a6fd6 0%, #6a4190 100%);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  transform: scale(1.02);
}
</style>
