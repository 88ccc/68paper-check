<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Menu, Close } from '@element-plus/icons-vue'

const props = withDefaults(defineProps<{
  customerServiceAction?: () => void
}>(), {
  customerServiceAction: () => {}
})

const router = useRouter()
const mobileMenuOpen = ref(false)

const navItems = [
  { label: '首页', path: '/' },
  { label: '论文检测', path: '/#myproduct' },
  { label: '下载报告', path: '/report' },
  { label: '常见问题', path: '/faq' }
]

const handleNav = (path: string) => {
  mobileMenuOpen.value = false
  router.push(path)
}

const handleCustomerService = () => {
  mobileMenuOpen.value = false
  props.customerServiceAction?.()
}
</script>

<template>
  <div class="responsive-nav">
    <!-- 桌面端菜单 -->
    <div class="nav-menu desktop">
      <el-button
        v-for="item in navItems"
        :key="item.label"
        text
        @click="handleNav(item.path)"
      >
        {{ item.label }}
      </el-button>
      <el-button
        type="success"
        @click="handleCustomerService"
      >
        客服咨询
      </el-button>
    </div>

    <!-- 移动端菜单按钮 -->
    <div class="mobile-menu-btn" @click="mobileMenuOpen = !mobileMenuOpen">
      <el-icon :size="24">
        <Menu v-if="!mobileMenuOpen" />
        <Close v-else />
      </el-icon>
    </div>

    <!-- 移动端下拉菜单 -->
    <transition name="slide-down">
      <div v-show="mobileMenuOpen" class="mobile-menu">
        <div
          v-for="item in navItems"
          :key="item.label"
          class="mobile-menu-item"
          @click="handleNav(item.path)"
        >
          {{ item.label }}
        </div>
        <div
          class="mobile-menu-item success"
          @click="handleCustomerService"
        >
          客服咨询
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.responsive-nav {
  display: flex;
  align-items: center;
}

.nav-menu {
  display: flex;
  gap: 12px;
  align-items: center;
}

.nav-menu.desktop {
  display: flex;
}

.mobile-menu-btn {
  display: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.3s;
}

.mobile-menu-btn:hover {
  background: #f5f7fa;
}

.mobile-menu {
  display: none;
  background: #fff;
  border-top: 1px solid #e4e7ed;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.mobile-menu-item {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background 0.3s;
  font-size: 15px;
}

.mobile-menu-item:hover {
  background: #f5f7fa;
}

.mobile-menu-item.primary {
  background: #667eea;
  color: #fff;
  font-weight: 600;
}

.mobile-menu-item.success {
  background: #67c23a;
  color: #fff;
  font-weight: 600;
}

/* 下拉动画 */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
}

.slide-down-enter-to,
.slide-down-leave-from {
  max-height: 400px;
  opacity: 1;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-menu.desktop {
    display: none;
  }

  .mobile-menu-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mobile-menu {
    display: block;
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    z-index: 999;
  }
}
</style>
