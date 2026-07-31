<script setup lang="ts">
import { onMounted, ref } from 'vue'


const activeNames = ref(['0'])
const faqList = ref(<any[]>[])

onMounted( async ()=>{
   const qres = await fetch('/question.json');
      const qdata = await qres.json();
      faqList.value = qdata.data;

})


</script>

<template>
  <div class="faq-page">


    <!-- 主要内容 -->
    <div class="main-content">
      <div class="content-wrapper">
        <div class="page-header">
          <h1 class="page-title">常见问题</h1>
          <p class="page-subtitle">为您提供全面的论文检测服务解答</p>
        </div>

        <div class="faq-container">
          <el-collapse v-model="activeNames">
            <el-collapse-item v-for="(item, index) in faqList" :key="index" :name="index.toString()">
              <template #title>
                <div class="collapse-title">
                  <span class="question-icon">❓</span>
                  <span class="question-text">{{ item.question }}</span>
                </div>
              </template>
              <div class="answer-content">{{ item.answer }}</div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.faq-page {
  min-height: calc(100vh - 188px);
  background: linear-gradient(135deg, var(--el-color-primary) 0%, var(--el-color-primary-dark-2) 100%);
  display: flex;
  flex-direction: column;
}

/* 主要内容 */
.main-content {
  flex: 1;
  padding: 40px 20px;
}

.content-wrapper {
  max-width: 900px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
  color: #fff;
}

.page-title {
  font-size: 36px;
  font-weight: 600;
  margin-bottom: 10px;
}

.page-subtitle {
  font-size: 16px;
  opacity: 0.9;
  margin: 0;
}

/* FAQ容器 */
.faq-container {
  background: #fff;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.collapse-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  font-weight: 500;
}

.question-icon {
  font-size: 20px;
}

.question-text {
  color: #333;
  font-weight: 600;
}

.answer-content {
  padding: 15px 0 5px 32px;
  line-height: 1.8;
  color: #666;
  white-space: pre-wrap;
}



/* 响应式设计 */
@media (max-width: 768px) {
  .page-title {
    font-size: 28px;
  }

  .page-subtitle {
    font-size: 14px;
  }

  .faq-container {
    padding: 20px;
  }

  .collapse-title {
    font-size: 15px;
  }

  .answer-content {
    padding: 12px 0 5px 20px;
    font-size: 14px;
  }
}
</style>
