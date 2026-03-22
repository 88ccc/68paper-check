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
    question: '论文查重准确吗？',
    answer: '论文查重就是把你的论文和库里面的论文对比，找出重复的地方。每个不同的查重系统用的库是不一样的。所以同一篇文章你用10个不同的查重系统会得到10个不一样的结果。谁是准的？谁是不准的？'
  },
  {
    question: '支持哪些文件格式？',
    answer: '目前支持上传 .doc、.docx（Word文档）和 .txt（纯文本）格式的文件。文件大小不能超过 30MB。建议使用 .docx 格式以获得最佳检测效果。'
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
    question: 'AIGC检测是什么？',
    answer: 'AIGC检测是专门用于检测文本是否由AI（如ChatGPT、文心一言等）生成的服务。通过先进的AI识别算法，可以有效识别AI生成的内容，保障学术诚信。'
  },
  {
    question: '检测报告可以下载吗？',
    answer: '可以。检测完成后，你可以下载报告。报告仅保留7天，请及时下载。'
  },
  {
    question: '如何获取订单号？',
    answer: '付款成功后，订单号会显示在支付完成页面。如果错过了，可以通过以下方式获取：\n• 微信付款：进入微信 > 我 > 服务 > 钱包 > 账单 > 点击对应的支付记录\n• 支付宝付款：进入支付宝 > 我的 > 账单 > 点击对应的支付记录'
  },
  {
    question: '保证是正品吗',
    answer: '检测报告上有编号，可以在品牌方的官网上验证真伪，假的找我退款'
  },
  
  {
    question: '支持发票吗？',
    answer: '支持。如需开具发票，请联系客服并提供订单号和开票信息（发票抬头、税号等）。'
  }
]

const showCustomerService = ref(false)
</script>

<template>
  <div class="faq-page">
    <!-- 顶部导航 -->
    <div class="header">
      <div class="header-content">
        <div class="logo" @click="router.push('/')">
          <span class="logo-icon">📚</span>
          <span class="logo-text">论文查重检测系统</span>
        </div>
        <ResponsiveNav :customer-service-action="() => showCustomerService = true" />
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="main-content">
      <div class="content-wrapper">
        <div class="page-header">
          <h1 class="page-title">常见问题</h1>
          <p class="page-subtitle">为您提供全面的论文查重服务解答</p>
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

        <!-- 温馨提示 -->
        <div class="tips-box">
          <div class="tips-header">
            <span class="tips-icon">💡</span>
            <span class="tips-title">温馨提示</span>
          </div>
          <p class="tips-text">
            如果您的问题没有在上述列表中找到答案，请点击右上角"咨询客服"按钮，
            我们的专业客服团队会为您提供一对一的解答服务。
          </p>
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

    <!-- 底部 -->
    <div class="footer">
      <div class="footer-content">
        <p>© 2026 论文查重检测系统 版权所有</p>
        <p>多个权威品牌官方授权合作伙伴</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.faq-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
}

/* 顶部导航 */
.header {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: transform 0.3s;
}

.logo:hover {
  transform: scale(1.02);
}

.logo-icon {
  font-size: 32px;
}

.logo-text {
  font-size: 20px;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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

/* 温馨提示 */
.tips-box {
  margin-top: 30px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.tips-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.tips-icon {
  font-size: 24px;
}

.tips-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.tips-text {
  margin: 0;
  line-height: 1.8;
  color: #666;
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
  padding: 30px 20px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.footer-content p {
  color: #999;
  margin: 8px 0;
  font-size: 14px;
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

  .tips-box {
    padding: 20px;
  }
}
</style>
