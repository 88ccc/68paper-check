<script setup lang="ts">
import { ref, reactive, onMounted, computed, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  Warning,
  Delete
} from '@element-plus/icons-vue'
import type { Ref } from 'vue';
import ResponsiveNav from '@/components/ResponsiveNav.vue'
import { paxios } from '@/utils/paxios'
import { storeToRefs } from "pinia"
import QRCode from 'qrcode';
import { mySleepMs, getBrowserType } from '@/utils/utils'
import type { UploadFile, UploadFiles, UploadInstance } from 'element-plus'
import { useProductConfigStore } from '@/stores/productConfig'
import { useWxOpenidStore } from '@/stores/wxopenid'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { get } from 'http';

const cardFormRef: Ref<HTMLDivElement | null> = ref(null);
const { wanfang, weipu, zhiwang, endtimeId, brand } = storeToRefs(useProductConfigStore());
const { openid } = storeToRefs(useWxOpenidStore());
const payFormRef: Ref<HTMLDivElement | null> = ref(null);
const product = ref(<any>{});
const route = useRoute()
const router = useRouter()
const loading = ref(false);
const txtupload = ref(true);
const needEndTime = ref(false);
const currHasSchool = ref(false);
const currHasSchool_x = ref(false);
const currHasClassCode = ref(false);
const currHasClassType = ref(false);
let orderid = '';
let find = false;
const productico = ref('📄');
//浏览器类型
const browserType = ref('');
const qrcodeUrl = ref('')
const showPayQRCode = ref(false)
const payQRCodeTitle = ref('')
const payId = ref('')

const aliQRre = ref({
  id: "",
  qr: ""
});
const wxQRre = ref({
  id: "",
  qr: ""
});

const smallp = ref(false)

//定时器
let timer: any = null;
let timerPay: any = null;
const qrLoading = ref(false)

const payWaring = ref('')
const isSupportWechat = ref(false)
const isSupportAlipay = ref(false)
const paymentMethod = ref('')
let wechatSet: any = null;
let AliapySet: any = null;

const cardForm = reactive({
  cardid1: '',
  cardid2: ''
})

interface WPZPPARAM {
  value: string;
  name: string;
}
const wpzpSchoolId = ref<WPZPPARAM[]>([]);
const wpzpClassCode = ref<WPZPPARAM[]>([]);
const wpzpClassType = ref<WPZPPARAM[]>([]);

// 将 wpzpSchoolId 转换为 el-select-v2 需要的格式
const schoolOptions = computed(() => {
  return wpzpSchoolId.value.map(item => ({
    label: item.name,
    value: item.value
  }));
});

function getschoolbyid(id: string) {
  return wpzpSchoolId.value.find(item => item.value === id)?.name || '';
}

function getClassCodebyid(id: string) {
  return wpzpClassCode.value.find(item => item.value === id)?.name || '';
}

function getClassTypebyid(id: string) {

  return wpzpClassType.value.find(item => item.value === id)?.name || '';

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


//解析支付方式
const parsePaymentMethod = function (payset: any) {
  if (browserType.value == 'pc') {
    payWaring.value = "当前环境不支持支付，请用手机浏览器访问网站,或者在微信中打开网站";
  } else if (browserType.value == 'mobile') {
    payWaring.value = "当前环境不支持支付，请用电脑浏览器访问网站,或者在微信中打开网站";
  } else if (browserType.value == 'wechat') {
    payWaring.value = "当前环境不支持支付，请用电脑浏览器访问网站,或者手机浏览器访问网站";
  }
  //判断payset是否是数组
  if (Array.isArray(payset)) {
    //遍历数组
    for (let i = 0; i < payset.length; i++) {
      let isMatch = false;
      if ((browserType.value == 'pc') && (payset[i].scene == 'pc')) {
        isMatch = true;
      } else if ((browserType.value == 'mobile') && (payset[i].scene == 'h5')) {
        isMatch = true;
      } else if ((browserType.value == 'wechat') && (payset[i].scene == 'wxh5')) {
        isMatch = true;
      }
      if (isMatch) {
        if ((payset[i].type == 'wxpay') && (payset[i].status == 1)) {
          isSupportWechat.value = true;
          wechatSet = payset[i];
          if (wechatSet.prefer == 1) {
            paymentMethod.value = 'wechat';
          }
        } else if ((payset[i].type == 'alipay') && (payset[i].status == 1)) {
          isSupportAlipay.value = true;
          AliapySet = payset[i];
          if (AliapySet.prefer == 1) {
            paymentMethod.value = 'alipay';
          }
        }
      }
    }
  } else {
    console.log("payset不是数组");
    ElMessage.error("获取支付方式错误");
  }
};

const cardRules = reactive({
  cardid1: [
    { required: true, message: '请输入卡号', trigger: 'blur' },
    { min: 3, max: 32, message: '请输入3-32位卡号', trigger: 'blur' },
  ],
  cardid2: [
    { min: 3, max: 32, message: '请输入3-32位卡号', trigger: 'blur' },
  ]
})

// 表单数据
const formData = reactive({
  title: '',
  endTime: '',
  author: '',
  school_id: "",
  class_code: "",
  class_type: "",
  uploadType: 'file',
  file: null as File | null,
  text: '',
  wordCount: 0,
  piece: 0,
  unit_price: 0,
  total_price: 0,
  fileName: ''
})

// 步骤
const currentStep = ref(1)
const uploadRef = ref<UploadInstance>()

const handleResize = () => {
  if (window.innerWidth < 768) {
    smallp.value = true;
  } else {
    smallp.value = false;

  }
};

// 初始化
onMounted(async () => {
  handleResize();
  window.addEventListener('resize', handleResize);
  const productid = route.query.type as string

  if (find == false) {
    for (let i = 0; i < wanfang.value.length; i++) {
      if (wanfang.value[i].id == productid) {
        product.value = wanfang.value[i];
        find = true;
        break;
      }
    }
  }
  if (find == false) {
    for (let i = 0; i < weipu.value.length; i++) {
      if (weipu.value[i].id == productid) {
        product.value = weipu.value[i];
        find = true;
        break;
      }
    }
  }
  if (find == false) {
    for (let i = 0; i < zhiwang.value.length; i++) {
      if (zhiwang.value[i].id == productid) {
        product.value = zhiwang.value[i];
        find = true;
        break;
      }
    }
  }
  if (find == false) {
    ElMessage.error("没有找到该检测系统");
    return;
  }

  for (let i = 0; i < endtimeId.value.length; i++) {
    if (endtimeId.value[i] == productid) {
      needEndTime.value = true;
      break;
    }
  }
  browserType.value = getBrowserType();

  if (isFileFormatSupported(product.value.config.file_types, "txt")) {
    txtupload.value = true;
  } else {
    txtupload.value = false;
  }

  try {
    loading.value = true;
    let res = await paxios.get("/index/getPaySet");
    if (res.data.code == 0) {
      parsePaymentMethod(res.data.data);
    } else {
      ElMessage.error(res.data.msg);
    }

  } catch (err) {
    ElMessage.error("获取产品信息出错");
  } finally {
    loading.value = false;
  }

  //获取参数
  let res1j = await fetch('/wpzp_param.json');
  let res1 = await res1j.json();
  if (res1.data.code === 0) {
    wpzpSchoolId.value = res1.data.school;
    wpzpClassCode.value = res1.data.classcode;
    wpzpClassType.value = res1.data.classtype;
  }

  if (productid == "cqvipzpdxs") {
    currHasSchool_x.value = true;
  } else {
    currHasSchool_x.value = false;
  }
  if (productid == "cqvipzpyjs") {
    currHasSchool.value = true;
    currHasClassCode.value = true;
  } else {
    currHasClassCode.value = false;
    currHasSchool.value = false;
  }

  if (productid == "cqvipzpqk") {
    currHasClassType.value = true;
  } else {
    currHasClassType.value = false;
  }

})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  if (timerPay) {
    clearTimeout(timerPay);
    timerPay = null;
  }
})

function handleExceed() {
  ElMessageBox.alert('只能上传一个文件，你可以删除原有文件后再重新上传新文件，或者刷新网页后重试', '错误', {
    confirmButtonText: '确定'
  });
}


function isFileFormatSupported(supportFormats: string, fileName: string) {
  // 边界处理：如果支持格式为空或文件名为空，直接返回false
  if (!supportFormats || !fileName) {
    return false;
  }

  // 1. 处理支持的格式列表：转小写、去空格、转成Set（方便快速查找）
  const formatSet = new Set(
    supportFormats.split(',').map(format => format.trim().toLowerCase())
  );

  // 2. 提取文件名的后缀：找到最后一个"."的位置
  const lastDotIndex = fileName.lastIndexOf('.');
  // 没有后缀（无点）或点在最后（如"文件名."），返回false
  if (lastDotIndex === -1 || lastDotIndex === fileName.length - 1) {
    return false;
  }

  // 3. 提取后缀并转小写，判断是否在支持列表中
  const fileExt = fileName.slice(lastDotIndex + 1).toLowerCase();
  return formatSet.has(fileExt);
}

async function toUploadFile(file: File) {

  try {
    loading.value = true;
    let res = await paxios.post("/check/get_upload_param", { product_id: product.value.id })
    if (res.data.code != 0) {
      ElMessage.error(res.data.msg);
      loading.value = false;
      return;
    }
    const formDataObj = new FormData()
    formDataObj.append('user_id', res.data.data.user_id);
    formDataObj.append('timestamp', res.data.data.timestamp);
    formDataObj.append('product_id', res.data.data.product_id);
    formDataObj.append('notify', res.data.data.notify);
    formDataObj.append('sign', res.data.data.sign);
    if (file) {
      formDataObj.append('file', file)
    }
    const res1 = await paxios.post('https://ck.88xuezi.cn/api/upload_file', formDataObj, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    if (res1.data.code == 0) {
      orderid = res1.data.data.id;
    } else {
      ElMessage.error(res1.data.msg);
      loading.value = false;
      return;
    }
    const res2 = await paxios.post("/check/create_check_order", { orderid: orderid, product_id: product.value.id });
    if (res2.data.code != 0) {
      ElMessage.error(res2.data.msg);
      loading.value = false;
      return;
    }

  } catch (err) {
    ElMessage.error("上传文件出错");
  } finally {
    loading.value = false;
  }

}


async function fileChange(file: UploadFile, uploadFiles: UploadFiles) {
  const rawFile = file.raw
  if (!rawFile) return

  // 检查文件类型
  if (!isFileFormatSupported(product.value.config.file_types, rawFile.name)) {
    ElMessage.error('仅支持 ' + product.value.config.file_types + '格式的文件')
    formData.file = null
    uploadRef.value?.clearFiles();
    return
  }

  const maxSize = product.value.config.file_max * 1024 * 1024
  if (rawFile.size > maxSize) {
    ElMessage.error('文件大小不能超过 ' + product.value.config.file_max + 'MB')
    formData.file = null
    uploadRef.value?.clearFiles();
    return
  }
  formData.file = rawFile
  formData.fileName = rawFile.name
  await toUploadFile(rawFile);
  if (orderid.length < 3) {
    ElMessage.error('上传文件出错')
    uploadRef.value?.clearFiles();
    formData.file = null
    formData.fileName = ''
    formData.wordCount = 0
    formData.piece = 0
    formData.unit_price = 0
    formData.total_price = 0
    orderid = '';
    return;
  }

}

function deleteFile() {
  uploadRef.value?.clearFiles();
  formData.file = null
  formData.fileName = ''
  formData.wordCount = 0
  formData.piece = 0
  formData.unit_price = 0
  formData.total_price = 0
  orderid = '';
}

function createTxtFile(content: string, fileName = "upload.txt") {
  const txtFile = new File([content], fileName, {
    type: "text/plain;charset=utf-8"
  });

  return txtFile;
}

async function report_info() {
  if (!find) {
    ElMessage.error("该产品不可用");
    return;
  }
  if (!formData.title) {
    ElMessage.warning('请输入标题')
    return
  }
  if (formData.title.length > product.value.config.title_max) {
    ElMessage.error("标题长度超过限制" + product.value.config.title_max)
    return
  }
  if (!formData.author) {
    ElMessage.warning('请输入作者')
    return
  }
  if (formData.author.length > product.value.config.author_max) {
    ElMessage.error("作者长度超过限制" + product.value.config.author_max)
    return
  }
  if (needEndTime.value) {
    //endTime
    if (!formData.endTime) {
      ElMessage.warning('请选择发表时间')
      return
    }
  }
  loading.value = true;
  try {
    const res = await paxios.post("/check/report_info", {
      order_id: orderid,
      title: formData.title,
      author: formData.author,
      end_date: formData.endTime,
      school_id: formData.school_id,
      class_code: formData.class_code,
      class_type: formData.class_type
    });

    if (res.data.code != 0) {
      ElMessage.error(res.data.msg);
      loading.value = false;
      return false;
    }

  } catch (err) {

    ElMessage.error("上报信息出错");
    loading.value = false;
    return false;

  }
  loading.value = false;
  return true;
}

const analyzeFile = async () => {
  if (!find) {
    ElMessage.error("该产品不可用");
    return false;
  }
  if (formData.uploadType === 'file') {
    if (orderid.length < 5) {
      ElMessage.warning('请先上传文件')
      return false
    }
  } else if (formData.uploadType === 'text') {
    const text = formData.text.trim();
    if (text.length < product.value.config.min_words) {
      ElMessage.warning('文本内容不能少于' + product.value.config.min_words + '字')
      return false
    }
    if (text.length > product.value.config.max_words) {
      ElMessage.warning('文本内容不能超过' + product.value.config.max_words + '字')
      return false
    }
    let file = createTxtFile(text);
    await toUploadFile(file);
    if (orderid.length < 3) {
      ElMessage.error('上传文件出错')
      return false;
    }
  }
  //查状态
  loading.value = true;
  let try_count = 1;
  while (true) {
    try {
      const res = await paxios.post("/check/get_order_status", { orderid: orderid });
      if (res.data.code == 0) {
        if (res.data.data.status == 2) {
          //解析完成
          formData.wordCount = res.data.data.word_count;
          formData.piece = res.data.data.piece; //件数
          formData.unit_price = res.data.data.unit_price;//单价
          formData.total_price = res.data.data.total_price;//总价
          break;
        } else if (res.data.data.status == 3) {
          ElMessage.error("解析失败");
          break;
        }
      }
    } catch (err) {
      console.error('获取订单状态失败:', err);
    }

    await mySleepMs(3000);
    try_count = try_count + 1;

    if (try_count > 10) {
      ElMessage.error("解析超时");
      break;
    }
  }
  loading.value = false;
  if (try_count > 10) {
    return false;
  }
  if (formData.piece == 0) {
    return false;
  }
  return true;
}

const nextStep = async () => {
  if (currentStep.value === 1) {
    if (!find) {
      ElMessage.error("该产品不可用");
      return;
    }
    if (!formData.title) {
      ElMessage.warning('请输入标题')
      return
    }
    if (formData.title.length > product.value.config.title_max) {
      ElMessage.error("标题长度超过限制" + product.value.config.title_max)
      return
    }
    if (!formData.author) {
      ElMessage.warning('请输入作者')
      return
    }
    if (formData.author.length > product.value.config.author_max) {
      ElMessage.error("作者长度超过限制" + product.value.config.author_max)
      return
    }
    if (needEndTime.value) {
      //endTime
      if (!formData.endTime) {
        ElMessage.warning('请选择发表时间')
        return
      }
    }
    if (formData.uploadType === 'file' && !formData.file) {
      ElMessage.warning('请上传文件')
      return
    }
    if (formData.uploadType === 'text' && !formData.text.trim()) {
      ElMessage.warning('请输入文本内容')
      return
    }
    const success = await analyzeFile()
    if (success) {
      const ret = await report_info();
      if (ret) {
        cardForm.cardid1 = "";
        cardForm.cardid2 = "";
        currentStep.value = 2
      }

    }
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const resetUpload = () => {
  router.push("/#myproduct")
}

const submitOrder = () => {
  // 跳转到报告下载页面
  setTimeout(() => {
    router.push({
      name: 'Report',
      query: { orderNo: payId.value }
    })
  }, 500)
}


function handleWeChatPay() {
  paymentMethod.value = 'wechat';
  payQRCodeTitle.value = '微信扫码支付'
  confirmPayment();
}
function handleAlipayPay() {
  paymentMethod.value = 'alipay';
  payQRCodeTitle.value = '支付宝扫码支付'
  confirmPayment();
}

function closeQRCodeDialog() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

const confirmPayment = () => {

  qrcodeUrl.value = "";

  // 根据浏览器类型决定支付方式
  if (browserType.value === 'pc') {
    // PC端显示二维码
    showPayQRcode();
  } else if (browserType.value === 'mobile') {
    // 移动端调用H5支付
    processH5Payment();
  } else if (browserType.value === 'wechat') {
    // 微信内只支持微信支付
    processWechatPayment();
  }
};

async function showPayQRcode() {
  showPayQRCode.value = true;
  qrcodeUrl.value = "/images/loading.gif";
  let modeid = wechatSet?.modeid;
  if (paymentMethod.value == 'alipay') {
    modeid = AliapySet?.modeid;
  }
  if (!modeid) {
    ElMessage.error('支付方式未配置');
    return;
  }
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  if (timerPay) {
    clearTimeout(timerPay);
    timerPay = null;
  }
  let qrcode = "";
  if (paymentMethod.value == 'alipay') {
    qrcode = aliQRre.value.qr;
    payId.value = aliQRre.value.id;
  } else if (paymentMethod.value == "wechat") {
    qrcode = wxQRre.value.qr;
    payId.value = wxQRre.value.id;
  }
  if (qrcode.length < 3) {
    try {
      let res = await paxios.post("/index/getPayQRcode", { type: paymentMethod.value, amount: formData.total_price/100, modeid: modeid, orderid: orderid });
      if (res.data.code == 0) {
        if (paymentMethod.value == 'alipay') {
          aliQRre.value.qr = res.data.data.qr;
          aliQRre.value.id = res.data.data.payid;
        } else if (paymentMethod.value == "wechat") {
          wxQRre.value.qr = res.data.data.qr;
          wxQRre.value.id = res.data.data.payid;
        }
        qrcode = res.data.data.qr;
        payId.value = res.data.data.payid;

      } else {
        ElMessage.error(res.data.msg);
      }

    } catch (error) {

      ElMessage.error('获取支付二维码失败');

      console.error('获取支付二维码错误:', error);

    }
  }
  if (qrcode.length > 3) {
    // 调用 qrcode.toDataURL 生成二维码的 base64 格式图片
    // 配置参数：宽度 200，容错级别 high
    const base64Url = await QRCode.toDataURL(qrcode, {
      width: 200,
      errorCorrectionLevel: 'high'
    });
    qrcodeUrl.value = base64Url; // 赋值给图片地址
    qrLoading.value = false;

    timerPay = setTimeout(() => { showPayQRCode.value = false }, 30000);
    timer = setInterval(async () => {
      try {
        let ret = await paxios.post("/index/payquery", { payid: payId.value });
        if (ret.data.code == 0) {
          if (ret.data.data.status == 1) {
            //支付成功
            showPayQRCode.value = false;
            submitOrder();
          }
        }
      } catch (error) {
        console.error('查询订单状态错误：', error);
      }
    }, 5000);
  }

}

async function processH5Payment() {
  let modeid = wechatSet?.modeid;
  if (paymentMethod.value == 'alipay') {
    modeid = AliapySet?.modeid;
  }
  if (!modeid) {
    ElMessage.error('支付方式未配置');
    return;
  }
  const currentDomain = window.location.origin;
  // 拼接 /report 路径
  const reportUrl = currentDomain + "/report?orderNo=";
  try {
    let res = await paxios.post("/index/getH5Pay", { type: paymentMethod.value, orderid: orderid, amount: formData.total_price/100, modeid: modeid, returnUrl: reportUrl });
    if (res.data.code == 0) {
      payId.value = res.data.data.payid;
      if (paymentMethod.value == 'alipay') {
        if (payFormRef.value) {
          payFormRef.value.innerHTML = res.data.data.pay_form;
          const payForm = payFormRef.value.querySelector('form');
          if (payForm) {
            if (timer) {
              clearInterval(timer);
            }
            // 支付成功，轮询查询订单状态确认支付结果
            timer = setInterval(async () => {
              try {
                let ret = await paxios.post("/index/payquery", { payid: payId.value });
                if (ret.data.code == 0) {
                  if (ret.data.data.status == 1) {
                    //支付成功
                    submitOrder();
                  }
                }
              } catch (error) {
                console.error('查询订单状态错误：', error);
              }
            }, 5000);
            payForm.submit();
          } else {
            ElMessage.error('支付表单解析失败');
          }
        }
      } else if (paymentMethod.value == 'wechat') {
        window.open(res.data.data.pay_url, '_blank');
      }

    } else {
      ElMessage.error(res.data.msg);
    }

  } catch (error) {
    console.error('H5支付处理错误:', error);
    ElMessage.error('支付处理失败');
  }
}

async function processWechatPayment() {
  //判断openid是否是空的
  if (openid.value == '') {
    ElMessage.error('不支持在微信内支付，请用浏览器打开');
    return;
  }
  let modeid = wechatSet?.modeid;
  if (paymentMethod.value == 'alipay') {
    modeid = AliapySet?.modeid;
  }
  if (!modeid) {
    ElMessage.error('支付方式未配置');
    return;
  }
  let res = await paxios.post("/index/getMPpay", { type: paymentMethod.value, orderid: orderid, amount: formData.total_price/100, modeid: modeid, openid: openid.value })
  if (res.data.code == 0) {
    payId.value = res.data.data.payid;
    let param = {
      "appId": res.data.data.appId,     //公众号ID，由商户传入     
      "timeStamp": res.data.data.timeStamp,    //时间戳，自1970年以来的秒数     
      "nonceStr": res.data.data.nonceStr,      //随机串     
      "package": res.data.data.package,
      "signType": res.data.data.signType,     //微信签名方式：     
      "paySign": res.data.data.paySign, //微信签名 
    };
    onBridgeReady(param);
    if (timer) {
      clearInterval(timer);
    }
    // 支付成功，轮询查询订单状态确认支付结果
    timer = setInterval(async () => {
      try {
        let ret = await paxios.post("/index/payquery", { payid: payId.value });
        if (ret.data.code == 0) {
          if (ret.data.data.status == 1) {
            //支付成功
            submitOrder();
          }
        }
      } catch (error) {
        console.error('查询订单状态错误：', error);
      }
    }, 5000);
  } else {
    ElMessage.error(res.data.msg);
  }

}

function onBridgeReady(data: any) {
  // 使用 window 访问 WeixinJSBridge，避免 TypeScript 类型错误
  if (typeof (window as any).WeixinJSBridge === "undefined") {
    ElMessage.error('不支持的支付方式');
  } else {
    (window as any).WeixinJSBridge.invoke('getBrandWCPayRequest', data,
      function (res: any) {
        if (res.err_msg == "get_brand_wcpay_request:ok") {
          if (timer) {
            clearInterval(timer);
          }
          // 支付成功，轮询查询订单状态确认支付结果
          timer = setInterval(async () => {
            try {
              let ret = await paxios.post("/index/payquery", { payid: payId.value });
              if (ret.data.code == 0) {
                if (ret.data.data.status == 1) {
                  //支付成功
                  submitOrder();
                }
              }
            } catch (error) {
              console.error('查询订单状态错误：', error);
            }
          }, 5000);
        } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
          ElMessage.info('支付已取消');
        } else {
          ElMessage.error('支付失败');
        }
      });
  }
}



</script>

<template>
  <el-config-provider :locale="zhCn">
    <div class="check-page">


      <!-- 主内容 -->
      <div v-loading="loading" element-loading-text="正在处理……" class="main-container">


        <!-- 步骤内容 -->
        <div class="step-content">

          <div v-show="currentStep === 1" class="step-2">
            <!-- 已选产品展示 -->
            <div class="selected-product-bar">
              <div class="product-info">
                <div v-if="!smallp">
                  <span v-if="brand == 'mix'" class="product-icon-mini">
                    {{ productico }}
                  </span>
                  <span v-if="brand == 'wanfang'" class="wanfang-logo">
                    <img style="width: 100%;" src="/images/wanfang_c.png">
                  </span>
                  <span v-if="brand == 'weipu'" class="wanfang-logo">
                    <img style="width: 100%;" src="/images/weipu_c.png">
                  </span>
                </div>

                <div class="product-details">
                  <div class="product-name-mini">
                    <span class="version-badge">{{ product.name }}</span>
                    <span class="version-badge">{{ (product.price / 100) }}元/{{ convertNumberToUnit(product.unit)
                    }}</span>
                  </div>
                  <div class="product-description">
                    {{ product.description }}
                  </div>
                </div>
              </div>
              <el-button link type="primary" @click="resetUpload">
                重新选择
              </el-button>
            </div>

            <div class="form-container">
              <el-form label-position="top" size="large">
                <el-form-item label="标题">
                  <el-input v-model="formData.title" placeholder="请输入论文标题" :maxlength="product.config?.title_max"
                    show-word-limit />
                </el-form-item>

                <el-form-item label="作者">
                  <el-input v-model="formData.author" placeholder="请输入作者姓名" :maxlength="product.config?.author_max"
                    show-word-limit />
                </el-form-item>
                <el-form-item v-show="needEndTime" label="发表日期">
                  <el-date-picker v-model="formData.endTime" type="date" format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD" />
                </el-form-item>
                <el-form-item v-if="currHasSchool" label="学校" prop="school_id">
                  <el-select-v2 v-model="formData.school_id" filterable :options="schoolOptions" placeholder="请选择学校"
                    clearable />
                </el-form-item>
                <el-form-item v-if="currHasSchool_x" label="学校">
                  <el-select-v2 v-model="formData.school_id" filterable :options="schoolOptions"
                    placeholder="请选择学校,可以不填" clearable />
                </el-form-item>
                <el-form-item v-if="currHasClassCode" label="学科" prop="class_code">
                  <el-select v-model="formData.class_code" placeholder="请选择学科" clearable>
                    <el-option v-for="item in wpzpClassCode" :key="item.value" :label="item.name" :value="item.value" />
                  </el-select>
                </el-form-item>
                <el-form-item v-if="currHasClassType" label="类型" prop="class_type">
                  <el-select v-model="formData.class_type" placeholder="请选择类型" clearable>
                    <el-option v-for="item in wpzpClassType" :key="item.value" :label="item.name" :value="item.value" />
                  </el-select>
                </el-form-item>


                <el-form-item label="上传方式">
                  <el-radio-group v-model="formData.uploadType">
                    <el-radio value="file">上传文件</el-radio>
                    <el-radio v-show="txtupload" value="text">粘贴文本</el-radio>
                  </el-radio-group>
                </el-form-item>

                <el-form-item v-if="formData.uploadType === 'file'" label="上传文件">
                  <el-upload :multiple="false" style="width: 100%;" ref="uploadRef" :show-file-list="false" :limit="1"
                    drag action="#" :auto-upload="false" :on-exceed="handleExceed" :on-change="fileChange">
                    <el-row style="height: 100%;">
                      <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                        <div class="el-upload__text">
                          <span v-show="formData.fileName == ''">将文件拖到此处，或<em>点击上传</em></span>
                          <span v-show="formData.fileName != ''">{{ formData.fileName }}&ensp;&ensp;<el-button
                              type="danger" :icon="Delete" size="small" @click.stop="deleteFile()" circle /></span>

                        </div>
                      </el-col>
                      <el-col class="hidden-xs-only file_tips_col" style="height: 100%;border-left: 1px dotted #AAAAAA;"
                        :sm="12" :md="12" :lg="12" :xl="12">
                        <div style="text-align: start;">
                          <ul>
                            <section>
                              <li>支持的格式：{{ product.config?.file_types }}</li>
                              <li v-show="product.config?.file_types.search('pdf') != -1"><span
                                  style="color: red">pdf格式不稳定，容易乱码，请确认后再提交</span>
                              </li>
                              <li>文档中不得包含批注</li>
                            </section>
                            <li>文档大小不超过{{ product.config?.file_max }}MB</li>
                          </ul>
                        </div>
                      </el-col>
                    </el-row>
                  </el-upload>
                </el-form-item>

                <el-form-item v-if="formData.uploadType === 'text'" label="文本内容">
                  <el-input v-model="formData.text" type="textarea" :rows="15" placeholder="请粘贴您的论文内容..."
                    :minlength="product.config?.min_words" :maxlength="product.config?.max_words" show-word-limit />
                </el-form-item>
                <div v-show="product.tips != ''">
                  <el-alert title="注意事项" type="warning" :closable="false">
                    <span v-html="product.tips"></span>
                  </el-alert>
                </div>
              </el-form>
            </div>
          </div>

          <!-- 步骤3 -->
          <div v-show="currentStep === 2" class="step-3">


            <div class="confirm-container">
              <el-alert title="请仔细核对以下信息" type="info" :closable="false" show-icon class="confirm-alert">
                <template #icon>
                  <Warning />
                </template>
              </el-alert>
              <el-descriptions :column="2" border class="info-descriptions">
                <el-descriptions-item :span="2" label="检测系统"><span style="color: blue;">{{ product.name
                }}</span></el-descriptions-item>
                <el-descriptions-item label="论文标题">{{ formData.title }}</el-descriptions-item>
                <el-descriptions-item label="作者">{{ formData.author }}</el-descriptions-item>
                <el-descriptions-item v-if="formData.endTime != ''" label="发表日期">{{ formData.endTime
                }}</el-descriptions-item>
                <el-descriptions-item v-if="formData.fileName" label="文件名">{{ formData.fileName
                }}</el-descriptions-item>
                <el-descriptions-item v-if="formData.school_id" label="学校">{{ getschoolbyid(formData.school_id)
                }}</el-descriptions-item>
                <el-descriptions-item v-if="formData.class_code" label="学科">{{ getClassCodebyid(formData.class_code)
                }}</el-descriptions-item>
                <el-descriptions-item v-if="formData.class_type" label="类型">{{ getClassTypebyid(formData.class_type)
                }}</el-descriptions-item>
                <el-descriptions-item v-if="formData.wordCount" label="字数">{{ formData.wordCount.toLocaleString() }}
                  字</el-descriptions-item>
                <el-descriptions-item label="件数">
                  <span>{{ formData.piece }}件</span>
                </el-descriptions-item>
                <el-descriptions-item label="单价">
                  <span>{{ formData.unit_price / 100 }}元</span>
                </el-descriptions-item>
                <el-descriptions-item label="总价">
                  <span class="price-text">{{ formData.total_price / 100 }}元</span>
                </el-descriptions-item>
              </el-descriptions>

              <el-alert title="请选择支付方式" type="success" :closable="false" show-icon class="payment-alert">
                <template #icon>
                  <CreditCard />
                </template>
              </el-alert>
              <div>
                <el-button v-show="isSupportWechat" @click="handleWeChatPay" type="success">微信支付</el-button><span
                  v-show="isSupportWechat">&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <el-button v-show="isSupportAlipay" @click="handleAlipayPay" type="primary">支付宝支付</el-button>
              </div>
              <div ref="payFormRef" class="pay-form-container" style="display: none;"></div>
              <div v-if="(!isSupportAlipay) && (!isSupportWechat)">
                <el-alert :title="payWaring" type="warning" />
              </div>

            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <el-button v-if="currentStep > 1" @click="prevStep">
            上一步
          </el-button>
          <el-button v-if="currentStep < 2" type="primary" @click="nextStep">
            下一步
          </el-button>
          <el-button v-if="currentStep === 2" @click="resetUpload">
            重新上传
          </el-button>
        </div>
      </div>

    </div>
    <el-dialog @close="closeQRCodeDialog" v-model="showPayQRCode" :title="payQRCodeTitle" width="360px" center>
      <div class="qr-dialog-content">
        <div class="qr-image-container">
          <img :src="qrcodeUrl" alt="支付二维码" class="qr-code-image" />
        </div>
        <div>订单号：{{ payId }}</div>
        <div class="qrcode-amount">支付金额: ¥{{ (formData.total_price/100).toFixed(2) }}元</div>
        <div><el-button @click="submitOrder" type="success">已经完成支付</el-button></div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showPayQRCode = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </el-config-provider>
</template>

<style scoped>
.price-text {
  font-size: 24px;
  font-weight: 600;
  color: #f56c6c;
}

.info-descriptions {
  margin: 20px 0;
  border-radius: 8px;
}

.info-descriptions :deep(.el-descriptions__label) {
  font-weight: 500;
  background-color: #f5f7fa;
  width: 120px;
}

.info-descriptions :deep(.el-descriptions__content) {
  color: #303133;
}

.qrcode-amount {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.file_tips_col {
  border-left: 1px dotted #B0B0B0;
  height: 100%;
}

.check-page {
  min-height: calc(100vh - 188px);
  display: flex;
  flex-direction: column;
}



.main-container {
  flex: 1;
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
  width: 100%;
}

.step-content {
  background: #fff;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  min-height: 400px;
}

.form-container {
  max-width: 700px;
  margin: 0 auto;
}

/* 已选产品条 */
.selected-product-bar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px 30px;
  border-radius: 12px;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.product-icon-mini {
  font-size: 48px;
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wanfang-logo {
  width: 50px;
  height: 75px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.product-name-mini {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 8px;
}

.version-badge {
  background: rgba(255, 255, 255, 0.959);
  padding: 4px 12px;
  color: blue;
  border-radius: 12px;
  font-size: 14px;
  font-weight: normal;
}

.product-description {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
}

.selected-product-bar .el-button {
  color: #fff;
  font-size: 15px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  padding: 8px 20px;
  backdrop-filter: blur(4px);
  transition: all 0.3s ease;
}

.selected-product-bar .el-button:hover {
  color: #ffd700;
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 215, 0, 0.5);
  transform: scale(1.05);
}

.confirm-alert {
  margin-bottom: 20px;
}

.payment-alert {
  margin-top: 20px;
  margin-bottom: 20px;
}

.qr-tip {
  margin-bottom: 20px;
  color: #666;
}

.action-buttons {
  margin-top: 30px;
  display: flex;
  gap: 12px;
  justify-content: center;
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

  .selected-product-bar {
    padding: 10px 10px;
  }

  .price-text {
    font-size: 20px;
  }

  .info-descriptions {
    margin: 15px 0;
  }

  .step-content {
    padding: 20px;
  }

  .product-info {
    gap: 12px;
  }

  .product-icon-mini {
    font-size: 40px;
    width: 50px;
    height: 50px;
  }

  .product-name-mini {
    font-size: 16px;
  }

  .product-price-mini {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .info-descriptions :deep(.el-descriptions__label) {
    width: 90px;
    font-size: 13px;
  }

  .main-container {
    padding: 0 12px;
    margin: 20px auto;
  }

  .step-content {
    padding: 16px;
  }

}
</style>
