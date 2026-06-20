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

const { wanfang, weipu, zhiwang, endtimeId, brand } = storeToRefs(useProductConfigStore());

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
const autoRefreshTimer = ref<number | null>(null)


function getproductName(productid: string) {

  for (let i = 0; i < wanfang.value.length; i++) {
    if (wanfang.value[i].id == productid) {
      return wanfang.value[i].name;
    }
  }


  for (let i = 0; i < weipu.value.length; i++) {
    if (weipu.value[i].id == productid) {
      return weipu.value[i].name;
    }
  }


  for (let i = 0; i < zhiwang.value.length; i++) {
    if (zhiwang.value[i].id == productid) {
      return zhiwang.value[i].name;
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
  autoRefreshTimer.value = window.setInterval(async () => {
    console.log('自动刷新订单状态...')
    await queryOrder()
  }, 60000)
}

// 停止自动刷新
const stopAutoRefresh = () => {
  if (autoRefreshTimer.value) {
    clearInterval(autoRefreshTimer.value)
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
              <el-input v-model="orderNo" placeholder="请输入卡号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="queryOrder">查询</el-button>
            </el-form-item>
          </el-form>
          <el-alert type="primary" :closable="false">
            <template #default>
              填写检测时的“卡号”，查询报告。如果一次检测用了多个卡号，任意一个卡号即可查询报告。<span style="color:red">报告仅保留7天，请及时下载报告。</span>
            </template>
          </el-alert>
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
            <el-icon color="#e6a23c" :size="18">
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
            <el-icon color="#e6a23c" :size="18">
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
          <div class="tip-box">
            <el-alert title="预计半小时左右出报告" type="primary" :closable="false" />
          </div>

          <div class="tip-box info">
            <el-icon color="#409eff" :size="18">
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
:deep(.el-form--inline .el-form-item) {
  margin-right: 8px !important;
}

:deep(.el-form--inline .el-input__wrapper) {
  min-width: 200px;
  width: auto;
}

.search-box :deep(.el-input__wrapper) {
  min-width: 280px;
  transition: min-width 0.3s ease;
}

@media (max-width: 768px) {
  .search-box :deep(.el-input__wrapper) {
    min-width: 200px;
  }
}

@media (max-width: 480px) {
  .search-box :deep(.el-input__wrapper) {
    min-width: 160px;
  }
}

.queryhr {
  margin-top: 10px;
  margin-bottom: 10px;
}

.pppoprefimg {
  width: 21px;
  vertical-align: middle;
  margin-right: 5px;
}

.querypopover {
  margin-left: 25px;
}

.querypopover .popimg {
  max-width: 100%;
}

.popover-content {
  padding: 8px;
}

.popover-content p {
  margin: 6px 0;
  line-height: 1.6;
  color: #606266;
  font-size: 13px;
}

.report-page {
  min-height: calc(100vh - 188px);
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

.main-container {
  flex: 1;
  max-width: 900px;
  margin: 40px auto;
  padding: 0 20px;
  width: 100%;
}

.page-header {
  text-align: center;
  margin-bottom: 10px;
}

.page-header h1 {
  font-size: 32px;
  color: #333;
  margin-bottom: 12px;
}

.header-desc {
  font-size: 15px;
  color: #666;
  line-height: 1.8;
}

.help-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.help-text {
  color: #666;
  line-height: 1.8;
  font-size: 14px;
  margin: 0;
}

.help-text strong {
  color: #333;
}



/* 搜索区域 */
.search-section {
  margin-bottom: 40px;
}

.search-box {
  max-width: 600px;
  margin: 0 auto;
}

/* 结果区域 */
.result-section {
  margin-bottom: 40px;
}

.result-card {
  background: #fff;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.status-wrapper {
  text-align: center;
  margin-bottom: 30px;
}

.status-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 20px;
}

.status-icon.warning {
  background: #fef0f0;
  color: #e6a23c;
}

.status-icon.processing {
  background: #ecf5ff;
  color: #409eff;
}

.status-icon.success {
  background: #f0f9ff;
  color: #67c23a;
}

.status-icon.error {
  background: #fef0f0;
  color: #f56c6c;
}

.status-title {
  font-size: 24px;
  color: #333;
  margin-bottom: 8px;
}

.status-desc {
  font-size: 16px;
  color: #666;
  margin: 0;
}

/* 订单信息 */
.order-info {
  background: #f5f7fa;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.info-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e4e7ed;
}

.info-product {
  font-size: 14px;
  font-weight: 400;
  color: blue;
  margin-right: 10px;
}

.info-details {
  padding: 0;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 20px;
}

.detail-spacer {
  flex: 1;
}

.detail-label {
  color: #666;
  font-size: 14px;
}

.detail-value {
  color: #333;
  font-size: 14px;
}

/* 提示框 */
.tip-box {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.tip-box.info {
  background: #ecf5ff;
  border: 1px solid #d9ecff;
}

.tip-box.warning {
  background: #fef0f0;
  border: 2px solid #f56c6c;
}

.tip-box p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
}

.tip-box.warning p strong {
  color: #f56c6c;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.action-buttons .el-button {
  padding: 12px 32px;
  font-size: 16px;
}

/* 加载状态 */
.loading-container {
  text-align: center;
  padding: 80px 20px;
  color: #667eea;
}

.loading-container .el-icon {
  margin-bottom: 20px;
}

.loading-container p {
  font-size: 18px;
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



@media (max-width: 768px) {
  .page-header h1 {
    font-size: 26px;
  }

  .header-desc {
    font-size: 14px;
  }

  .result-card {
    padding: 30px 20px;
  }

  .detail-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .detail-spacer {
    display: none;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-buttons .el-button {
    width: 100%;
  }

  .status-title {
    font-size: 20px;
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
}
</style>
