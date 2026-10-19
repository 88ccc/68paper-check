<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Download,
  Refresh,
  Warning,
  CircleCheck,
  CircleClose,
  Delete
} from '@element-plus/icons-vue'
import { storeToRefs } from "pinia"
import { paxios } from '@/utils/paxios'
import { useProductConfigStore } from '@/stores/productConfig'

const { productList, endtimeId } = storeToRefs(useProductConfigStore());

// ElMessage已通过unplugin-auto-import自动导入，无需手动导入

const router = useRouter()

// 订单状态枚举
enum OrderStatus {
  NOT_FOUND = 'not_found',      // 没有找到订单
  NOT_PAY = 'not_pay',      // 没有付款
  PROCESSING = 'processing',     // 正在处理中
  COMPLETED = 'completed',        // 已完成
  DELETE = 'delete',             //报告已经删除
  FAILED = 'failed',             // 失败
  REFUND = 'refund',   //已经退款
}

interface OrderInfo {
  orderNo: string
  product: string
  status: OrderStatus
  orderid: string
  version: string
  title: string
  author: string
  payTime: string
  createTime: string
  reportUrl?: string
  failReason?: string
}

const orderNo = ref('')
const orderInfo = ref<OrderInfo | null>(null)
const loading = ref(false)
const autoRefreshTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const showTips = ref(true);


function getproductName(productid: string) {

  for (let i = 0; i < productList.value.length; i++) {
    if (productList.value[i].id == productid) {
      return productList.value[i].name;
    }
  }

  return '';

}

function getstatusStr(status: number) {
  switch (status) {

    case 4:
    case 5:
    case 6:
      {
        return OrderStatus.PROCESSING;
      }
    case 7:
      {
        return OrderStatus.FAILED;
      }
    case 8: {
      return OrderStatus.COMPLETED;
    }

    case 9:
      {
        return OrderStatus.REFUND;
      }
    case 10:
      {
        return OrderStatus.DELETE;
      }
  }
  return OrderStatus.NOT_FOUND;
}

// 查询订单
const queryOrder = async () => {
  if (!orderNo.value.trim()) {
    ElMessage.warning('请输入订单号')
    return
  }
  loading.value = true
  try {
    let res = await paxios.post("/check/get_status_by_payid", { payid: orderNo.value.trim() });
    if (res.data.code != 0) {
      ElMessageBox.alert('订单不存在，请确定订单号', '错误', {
        confirmButtonText: '确定'
      });
      loading.value = false
      return;
    }
    if (res.data.data.status == 0) {
      ElMessageBox.alert('订单没有提交文章', '错误', {
        confirmButtonText: '确定'
      });
      loading.value = false
      return;
    }

    if (res.data.data.status < 4) {
      ElMessageBox.alert('订单未支付，请咨询客服', '错误', {
        confirmButtonText: '确定'
      });
      loading.value = false
      return;
    }
    showTips.value = false;

    let orderstatus = getstatusStr(res.data.data.status);
    let product = getproductName(res.data.data.product_id);

    orderInfo.value = {
      orderNo: orderNo.value.trim(),
      product: product,
      status: orderstatus,
      orderid: res.data.data.id,
      version: '',
      title: res.data.data.title,
      author: res.data.data.author,
      payTime: res.data.data.pay_time,
      createTime: res.data.data.create_time,
      reportUrl: res.data.data.report_url,
      failReason: res.data.data.remark
    }

    // 如果正在处理，启动自动刷新
    if (orderInfo.value.status === OrderStatus.PROCESSING) {
      startAutoRefresh()
    }


  } catch (err) {
    ElMessage.error("查询订单信息出错");
  }
  loading.value = false
}

// 启动自动刷新
const startAutoRefresh = () => {
  // 清除之前的定时器
  stopAutoRefresh()

  // 每分钟刷新一次
  autoRefreshTimer.value = setTimeout(async () => {
    console.log('自动刷新订单状态...')
    await queryOrder()
  }, 60000)
}

// 停止自动刷新
const stopAutoRefresh = () => {
  if (autoRefreshTimer.value) {
    clearTimeout(autoRefreshTimer.value)
    autoRefreshTimer.value = null
  }
}

// 手动刷新
const handleRefresh = () => {
  queryOrder()
}

// 下载报告
const downloadReport = () => {
  if (orderInfo.value?.reportUrl) {
    // 模拟下载
    ElMessage.success('开始下载报告...')
    window.open(orderInfo.value.reportUrl, '_blank')
  } else {
    ElMessage.error('报告不存在')
  }
}

const deleteReport = () => {
  ElMessageBox.confirm(
    '请注意删除报告后无法找回，请确认是否删除报告',
    '警告',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      try {
        let res = await paxios.post("/check/delete_report", { orderid: orderInfo.value?.orderid })
        if (res.data.code == 0) {
          if (orderInfo.value) {
            orderInfo.value.status = OrderStatus.DELETE;
          }
        } else {
          ElMessage.error("删除失败," + res.data.msg);
        }
      } catch (err) {
        ElMessage.error("删除失败");
      }

    })
    .catch(() => {

    })
}



// 返回首页
const goBack = () => {
  router.push('/')
}

// 组件挂载时
onMounted(() => {
  // 如果URL中有订单号参数，自动查询
  const urlOrderNo = router.currentRoute.value.query.orderNo as string
  if (urlOrderNo) {
    orderNo.value = urlOrderNo
    queryOrder()
  }
})

// 组件卸载时清除定时器
onUnmounted(() => {
  stopAutoRefresh()
})

const handleRefund = async () => {
  try {
    let res = await paxios.post("/check/self_refund", { orderid: orderInfo.value?.orderid });
    if (res.data.code == 0) {
      ElMessageBox.alert('钱将原路返回', '提示', {
        confirmButtonText: '确认',
      })
      if (orderInfo.value) {
        orderInfo.value.status = OrderStatus.REFUND;
      }
    } else {
      ElMessage.error("申请退款失败," + res.data.msg + ",有任何疑问请联系客服");
    }
  } catch (err) {
    ElMessage.error("申请退款失败，请联系客服退款");
  }
}

</script>

<template>
  <div class="report-page">


    <!-- 主内容 -->
    <div class="main-container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1>报告查询</h1>
      </div>
      <hr class="queryhr" />

      <div class="search-section">
        <div class="search-box">
          <el-form :inline="true" class="queryform" label-width="20px">
            <el-form-item>
              <el-input v-model="orderNo" placeholder="请输入订单号或卡号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="queryOrder">查询</el-button>
            </el-form-item>
          </el-form>
          <div v-show="showTips">
             <el-tooltip content="<span style='font-size: 16px;'>支付宝付款记录中的“商户订单号”就是订单号</span><br/><br/><img src='/images/zfbpayid.png'>" raw-content>
            <span>支付宝订单号？</span>
          </el-tooltip>
          <el-tooltip  content="<span style='font-size: 16px;'>微信付款记录中的“商户单号”就是订单号</span><br/><br/><img src='/images/wxpayid.png'>" raw-content>
            <span style="margin-left: 20px;font-size: 14px;">微信订单号？</span>
          </el-tooltip>
          <el-alert type="primary" :closable="false">
            <template #default>
              填写检测时的"卡号"或“订单号"，查询报告。如果一次检测用了多个卡号，任意一个卡号即可查询报告。<span
                style="color: var(--el-color-danger);">报告仅保留7天，请及时下载报告。</span>
            </template>
          </el-alert>
          </div>
         
        </div>
      </div>



      <!-- 查询结果 -->
      <div v-if="orderInfo && !loading" class="result-section">
        <!-- 未找到订单 -->
        <div v-if="orderInfo.status === OrderStatus.NOT_FOUND" class="result-card not-found">
          <div class="status-wrapper">
            <div class="status-icon warning">
              <el-icon :size="60">
                <Warning />
              </el-icon>
            </div>
            <h3 class="status-title">没有查询出报告！</h3>
          </div>

          <div class="tip-box">
            <el-icon color="var(--el-color-warning)" :size="18">
              <Warning />
            </el-icon>
            <p>温馨提示：请确认输入订单编号正确或已成功提交检测，如有疑问请联系在线客服。</p>
          </div>

          <div class="action-buttons">
            <el-button type="primary" @click="goBack">去提交检测</el-button>
          </div>
        </div>

        <!-- 未支付订单 -->
        <div v-else-if="orderInfo.status === OrderStatus.NOT_PAY" class="result-card not-found">
          <div class="status-wrapper">
            <div class="status-icon warning">
              <el-icon :size="60">
                <Warning />
              </el-icon>
            </div>
            <h3 class="status-title">该订单未支付</h3>
          </div>

          <div class="tip-box">
            <el-icon color="var(--el-color-warning)" :size="18">
              <Warning />
            </el-icon>
            <p>温馨提示：请确认输入订单编号正确或已成功提交检测，如有疑问请联系在线客服。</p>
          </div>

          <div class="action-buttons">
            <el-button type="primary" @click="goBack">去提交检测</el-button>
          </div>
        </div>

        <!-- 订单处理中 -->
        <div v-else-if="orderInfo.status === OrderStatus.PROCESSING" class="result-card processing">
          <div class="status-wrapper">
            <div class="status-icon processing">
              <el-icon class="is-loading" :size="60">
                <Refresh />
              </el-icon>
            </div>
            <h3 class="status-title">正在检测</h3>
          </div>

          <div class="order-info">
            <div class="info-title"><span class="info-product">{{ orderInfo.product }}</span>{{ orderInfo.title }}</div>
            <div class="info-details">
              <div class="detail-row">
                <span class="detail-label">作者：</span>
                <span class="detail-value">{{ orderInfo.author }}</span>
                <span class="detail-spacer"></span>
                <span class="detail-label">付款时间：</span>
                <span class="detail-value">{{ orderInfo.payTime }}</span>
              </div>
            </div>
          </div>
          <div class="tip-box info">
            <el-icon color="var(--el-color-primary)" :size="18">
              <Refresh />
            </el-icon>
            <p>系统每分钟自动刷新订单状态，请耐心等待检测完成...</p>
          </div>

          <div class="action-buttons">
            <el-button type="primary" @click="handleRefresh" :icon="Refresh">
              刷新状态
            </el-button>
          </div>
        </div>

        <!-- 订单已完成 -->
        <div v-else-if="orderInfo.status === OrderStatus.COMPLETED" class="result-card completed">
          <div class="status-wrapper">
            <div class="status-icon success">
              <el-icon :size="60">
                <CircleCheck />
              </el-icon>
            </div>
            <h3 class="status-title">检测成功</h3>
          </div>

          <div class="order-info">
            <div class="info-title"><span class="info-product">{{ orderInfo.product }}</span>{{ orderInfo.title }}</div>
            <div class="info-details">
              <div class="detail-row">
                <span class="detail-label">作者：</span>
                <span class="detail-value">{{ orderInfo.author }}</span>
                <span class="detail-spacer"></span>
                <span class="detail-label">付款时间：</span>
                <span class="detail-value">{{ orderInfo.payTime }}</span>
              </div>
            </div>
          </div>
          <div class="action-buttons">
            <el-button type="primary" size="large" @click="downloadReport" :icon="Download">
              下载报告
            </el-button>
            <el-button type="warning" size="large" @click="deleteReport" :icon="Delete">
              删除报告
            </el-button>
          </div>
        </div>
        <!-- 报告已删除 -->
        <div v-else-if="orderInfo.status === OrderStatus.DELETE" class="result-card failed">
          <div class="status-wrapper">
            <div class="status-icon error">
              <el-icon :size="60">
                <Delete />
              </el-icon>
            </div>
            <h3 class="status-title">报告已被删除</h3>
          </div>

          <div class="order-info">
            <div class="info-title"><span class="info-product">{{ orderInfo.product }}</span>{{ orderInfo.title }}</div>
            <div class="info-details">
              <div class="detail-row">
                <span class="detail-label">作者：</span>
                <span class="detail-value">{{ orderInfo.author }}</span>
                <span class="detail-spacer"></span>
                <span class="detail-label">付款时间：</span>
                <span class="detail-value">{{ orderInfo.payTime }}</span>
              </div>
            </div>
          </div>
        </div>


        <!-- 订单失败 -->
        <div v-else-if="orderInfo.status === OrderStatus.FAILED" class="result-card failed">
          <div class="status-wrapper">
            <div class="status-icon error">
              <el-icon :size="60">
                <CircleClose />
              </el-icon>
            </div>
            <h3 class="status-title">检测失败，{{ orderInfo.failReason }}</h3>
          </div>

          <div class="order-info">
            <div class="info-title"><span class="info-product">{{ orderInfo.product }}</span>{{ orderInfo.title }}</div>
            <div class="info-details">
              <div class="detail-row">
                <span class="detail-label">作者：</span>
                <span class="detail-value">{{ orderInfo.author }}</span>
                <span class="detail-spacer"></span>
                <span class="detail-label">付款时间：</span>
                <span class="detail-value">{{ orderInfo.payTime }}</span>
              </div>
            </div>
          </div>
          <div class="action-buttons">
            <el-button type="danger" @click="handleRefund">
              申请退款
            </el-button>
            <!-- <el-button @click="handleCustomerServiceDialog">联系客服</el-button> -->
          </div>
        </div>

        <!-- 订单退款 -->
        <div v-else-if="orderInfo.status === OrderStatus.REFUND" class="result-card failed">
          <div class="status-wrapper">
            <div class="status-icon warning">
              <el-icon :size="60">
                <RefreshLeft />
              </el-icon>
            </div>
            <h3 class="status-title">订单已经退款</h3>
          </div>

          <div class="order-info">
            <div class="info-title"><span class="info-product">{{ orderInfo.product }}</span>{{ orderInfo.title }}</div>
            <div class="info-details">
              <div class="detail-row">
                <span class="detail-label">作者：</span>
                <span class="detail-value">{{ orderInfo.author }}</span>
                <span class="detail-spacer"></span>
                <span class="detail-label">付款时间：</span>
                <span class="detail-value">{{ orderInfo.payTime }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <el-icon class="is-loading" :size="60">
          <Loading />
        </el-icon>
        <p>查询中...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ---------- 查询表单 ---------- */
:deep(.el-form--inline .el-form-item) {
  margin-right: 12px !important;
  margin-bottom: 0 !important;
}

:deep(.el-form--inline .el-input__wrapper) {
  width: auto;
  min-width: 200px;
}

.search-box :deep(.el-input__wrapper) {
  width: 100%;
  min-width: 240px;
  height: 44px;
  padding-left: 20px;
  border-radius: 22px;
  box-shadow: 0 0 0 1px var(--el-color-primary-light-7) inset;
  transition: box-shadow 0.25s ease;
}

.search-box :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px var(--el-color-primary-light-5) inset;
}

.search-box :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--el-color-primary) inset,
    0 0 0 3px var(--el-color-primary-light-8);
}

/* 标题装饰线 */
.queryhr {
  width: 64px;
  height: 4px;
  border: none;
  border-radius: 2px;
  margin: 0 auto 28px;
  background: linear-gradient(90deg, var(--el-color-primary) 0%,
      var(--el-color-primary-light-5) 100%);
}

/* ---------- 页面容器 ---------- */
.report-page {
  min-height: calc(100vh - 188px);
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, var(--el-color-primary-light-9) 0%,
      var(--el-color-primary-light-8) 100%);
}

.main-container {
  flex: 1;
  max-width: 900px;
  margin: 44px auto;
  padding: 0 20px;
  width: 100%;
}

.page-header {
  text-align: center;
  margin-bottom: 14px;
}

.page-header h1 {
  font-size: 34px;
  font-weight: 600;
  letter-spacing: 1px;
  color: #303133;
  margin: 0;
}

/* ---------- 搜索区域 ---------- */
.search-section {
  margin-bottom: 32px;
}

.search-box {
  max-width: 640px;
  margin: 0 auto;
  padding: 28px 28px 22px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.search-box :deep(.el-form) {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.search-box :deep(.el-button) {
  height: 44px;
  padding: 0 28px;
  border-radius: 22px;
  font-size: 15px;
  font-weight: 500;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.search-box :deep(.el-button:hover) {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px var(--el-color-primary-light-7);
}

/* 订单号提示 */
.search-box :deep(.el-tooltip__trigger) {
  display: inline-block;
  margin-top: 16px;
}

.search-box :deep(.el-tooltip__trigger) span {
  display: inline-flex;
  align-items: center;
  font-size: 13px;
  color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
  border: 1px solid var(--el-color-primary-light-8);
  border-radius: 14px;
  padding: 4px 12px;
  cursor: help;
  transition: all 0.25s ease;
}

.search-box :deep(.el-tooltip__trigger:hover) span {
  color: #fff;
  background: var(--el-color-primary);
  border-color: var(--el-color-primary);
}

.search-box :deep(.el-alert) {
  margin-top: 16px;
  padding: 12px 16px;
  border-radius: 12px;
  background: var(--el-color-primary-light-9);
  border: 1px solid var(--el-color-primary-light-8);
}

.search-box :deep(.el-alert__content) {
  text-align: left;
  font-size: 13px;
  line-height: 1.8;
  color: #606266;
}

/* ---------- 结果区域 ---------- */
.result-section {
  margin-bottom: 40px;
  animation: fade-up 0.35s ease both;
}

.result-card {
  background: #fff;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border-top: 4px solid var(--el-color-primary);
  transition: box-shadow 0.3s ease;
}

.result-card:hover {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.result-card.not-found {
  border-top-color: var(--el-color-warning);
}

.result-card.processing {
  border-top-color: var(--el-color-primary);
}

.result-card.completed {
  border-top-color: var(--el-color-success);
}

.result-card.failed {
  border-top-color: var(--el-color-danger);
}

.status-wrapper {
  text-align: center;
  margin-bottom: 28px;
}

.status-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 104px;
  height: 104px;
  border-radius: 50%;
  margin-bottom: 18px;
}

.status-icon.warning {
  background: var(--el-color-warning-light-9);
  color: var(--el-color-warning);
  box-shadow: 0 0 0 8px var(--el-color-warning-light-8);
}

.status-icon.processing {
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  box-shadow: 0 0 0 8px var(--el-color-primary-light-8);
  animation: breathe 2s ease-in-out infinite;
}

.status-icon.success {
  background: var(--el-color-success-light-9);
  color: var(--el-color-success);
  box-shadow: 0 0 0 8px var(--el-color-success-light-8);
}

.status-icon.error {
  background: var(--el-color-danger-light-9);
  color: var(--el-color-danger);
  box-shadow: 0 0 0 8px var(--el-color-danger-light-8);
}

.status-title {
  font-size: 23px;
  font-weight: 600;
  color: #303133;
  margin: 0;
  line-height: 1.5;
}

.status-desc {
  font-size: 15px;
  color: #909399;
  margin: 8px 0 0;
}

/* ---------- 订单信息 ---------- */
.order-info {
  background: linear-gradient(180deg, #f7f9fc 0%, #fff 100%);
  border: 1px solid var(--el-border-color-lighter);
  border-left: 4px solid var(--el-color-primary);
  border-radius: 12px;
  padding: 22px 24px;
  margin-bottom: 24px;
}

.info-title {
  font-size: 17px;
  font-weight: 600;
  color: #303133;
  line-height: 1.6;
  margin-bottom: 16px;
  padding-bottom: 14px;
  border-bottom: 1px dashed var(--el-border-color-lighter);
}

.info-product {
  display: inline-block;
  vertical-align: middle;
  font-size: 12px;
  font-weight: 500;
  color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
  border: 1px solid var(--el-color-primary-light-8);
  border-radius: 10px;
  padding: 2px 10px;
  margin-right: 8px;
}

.info-details {
  padding: 0;
}

.detail-row {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 12px 18px;
}

.detail-spacer {
  display: none;
}

.detail-label {
  color: #909399;
  font-size: 14px;
  white-space: nowrap;
}

.detail-value {
  color: #303133;
  font-size: 14px;
  font-weight: 500;
  word-break: break-all;
}

/* ---------- 提示框 ---------- */
.tip-box {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 14px 16px;
  border-radius: 10px;
  margin-bottom: 20px;
  background: var(--el-color-warning-light-9);
  border-left: 4px solid var(--el-color-warning);
}

.tip-box.info {
  background: var(--el-color-primary-light-9);
  border-left-color: var(--el-color-primary);
}

.tip-box.warning {
  background: var(--el-color-danger-light-9);
  border-left-color: var(--el-color-danger);
}

.tip-box p {
  margin: 0;
  font-size: 14px;
  line-height: 1.7;
  color: #606266;
}

.tip-box.warning p strong {
  color: var(--el-color-danger);
}

.tip-box :deep(.el-alert) {
  flex: 1;
  padding: 0;
  background: transparent;
  border: none;
}

.tip-box :deep(.el-alert__title) {
  font-size: 14px;
  line-height: 1.7;
  color: #606266;
}

/* ---------- 操作按钮 ---------- */
.action-buttons {
  display: flex;
  gap: 14px;
  justify-content: center;
  flex-wrap: wrap;
}

.action-buttons .el-button {
  padding: 12px 32px;
  font-size: 15px;
  font-weight: 500;
  border-radius: 24px;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.action-buttons .el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.12);
}

/* ---------- 加载状态 ---------- */
.loading-container {
  text-align: center;
  padding: 70px 20px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  color: var(--el-color-primary);
}

.loading-container .el-icon {
  margin-bottom: 20px;
}

.loading-container p {
  font-size: 16px;
  color: #909399;
  margin: 0;
}

/* ---------- 动画 ---------- */
@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(12px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes breathe {
  0%,
  100% {
    box-shadow: 0 0 0 8px var(--el-color-primary-light-8);
  }

  50% {
    box-shadow: 0 0 0 14px var(--el-color-primary-light-9);
  }
}

/* ---------- 响应式 ---------- */
@media (max-width: 768px) {
  .main-container {
    margin: 28px auto;
  }

  .page-header h1 {
    font-size: 26px;
  }

  .search-box {
    padding: 22px 18px 18px;
  }

  .search-box :deep(.el-input__wrapper) {
    min-width: 180px;
  }

  .result-card {
    padding: 30px 20px;
  }

  .detail-row {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-buttons .el-button {
    width: 100%;
    margin-left: 0 !important;
  }

  .status-title {
    font-size: 20px;
  }

  .status-icon {
    width: 88px;
    height: 88px;
  }
}

@media (max-width: 480px) {
  .main-container {
    padding: 0 12px;
    margin: 20px auto;
  }

  .result-card {
    padding: 24px 16px;
  }

  .order-info {
    padding: 16px;
  }

  .status-icon {
    width: 76px;
    height: 76px;
  }
}
</style>
