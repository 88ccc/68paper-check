<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ResponsiveNav from '@/components/ResponsiveNav.vue'
import { useWebsitConfigStore } from '@/stores/websitConfig'
import { storeToRefs } from "pinia"


const { custom, webIsInit, apiUrl, shopId } = storeToRefs(useWebsitConfigStore());

const router = useRouter()

const activeNames = ref(['0'])

const faqList = [
  {
    question: '什么是论文查重？',
    answer: '论文查重是指通过专业的查重系统，对论文进行相似度检测，识别论文中可能存在的抄袭、复制等问题。把你的论文和库里面的论文对比，能够精准识别文本相似度，帮助作者确保论文原创性。'
  },
  {
    question: 'AIGC检测是什么？',
    answer: 'AIGC检测是专门用于检测文本是否由AI（如ChatGPT、文心一言等）生成的服务。通过先进的AI识别算法，可以有效识别AI生成的内容，保障学术诚信。'
  },
  {
    question: '论文查重准确吗？',
    answer: '论文查重就是把你的论文和库里面的论文对比，找出重复的地方。每个不同的查重系统用的库是不一样的。所以同一篇文章你用10个不同的查重系统会得到10个不一样的结果。谁是准的？谁是不准的？'
  },
  {
    question: '支持哪些文件格式？',
    answer: '目前支持上传 .doc、.docx（Word文档）和 .txt（纯文本）格式的文件。文件大小不能超过 30MB。建议使用 .docx 格式以获得最佳效果。'
  },
  {
    question: '多久能出检测结果？',
    answer: '通常情况下，你付款后，半小时内出报告。如果是毕业季，同时提交的单子太多，检测系统会比较慢，可能会超过两个小时才有结果。'
  },
  {
    question: '自建库是什么意思？',
    answer: '大家都知道 所谓的论文查重就是把你的论文和库里的论文对比。论文检测系统是由一些公司提供的。\n' +
      '比如你们学校和某个 “论文检测平台（比如 知网、维普 等等）”合作。这些论文检测平台，会提供一个机构账号给学校。\n' +
      '这个机构账号有很多功能，比如 “设置水印”，有些检测报告上面有学校名字的水印，就是这里设置的。' +
      '还有一个功能“自建库”。所谓自建库，比如你们学校有很多论文，把这些论文组成一个库，加入到对比库中。这样就成了独一无二的对比库。\n' +
      '目前已知的 知网，维普，万方，Turnitin 都有这个功能。' +
      '据我们所知 大部分高校都没有自建库。有部分学校自己创建了对比库，这样学校的学生，无论你去哪里检测，都不可能得到和学校一样的检测结果，因为你们学校有独特的、自己创建的对比库。也不必要太担心，查重的时候，是自建库加上 检测平台 提供的对比库。自建库一般不会很大。所以即使有自建库，我们的结果还是很有参考价值的。'
  },
  
  {
    question: '检测报告可以下载吗？',
    answer: '可以。检测完成后，你可以下载报告。报告仅保留7天，请及时下载。'
  },
  {
    question: '保证是正品吗',
    answer: '检测报告上有编号，可以在品牌方的官网上验证真伪，假的找商家退款'
  }
]
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
