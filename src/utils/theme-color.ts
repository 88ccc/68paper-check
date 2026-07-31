import tinycolor from 'tinycolor2'

export type ColorGroup = {
    base: string
    light3: string
    light5: string
    light7: string
    light8: string
    light9: string
    dark2: string
}

export type ThemeColors = {
    primary: ColorGroup
    success: ColorGroup
    warning: ColorGroup
    danger: ColorGroup
    info: ColorGroup
}

// 多套预设主题（支付宝、微信、紫色、橙色、默认）
export const themeList: Record<string, { name: string; colors: ThemeColors }> = {
    // 1. Element官方默认蓝
    default: {
        name: '默认商务蓝',
        colors: {
            primary: { base: '#409EFF', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            success: { base: '#67C23A', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            warning: { base: '#E6A23C', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            danger: { base: '#F56C6C', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            info: { base: '#909399', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' }
        }
    },
    wechat: {
        name: '微信绿',
        colors: {
            primary: { base: '#07C160', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            success: { base: '#00B42A', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            warning: { base: '#FF7D00', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            danger: { base: '#F56C6C', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            info: { base: '#86909C', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' }
        }
    },

    purple: {
        name: '典雅紫',
        colors: {
            primary: { base: '#722ED1', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            success: { base: '#52C41A', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            warning: { base: '#FAAD14', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            danger: { base: '#F5222D', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            info: { base: '#8C8C8C', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' }
        }
    },

    orange: {
        name: '活力橙',
        colors: {
            primary: { base: '#FF7D00', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            success: { base: '#00B42A', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            warning: { base: '#FFB100', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            danger: { base: '#F53F3F', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            info: { base: '#86909C', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' }
        }
    },

    darkBlue: {
        name: '企业深蓝',
        colors: {
            primary: { base: '#0F42CC', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            success: { base: '#009F57', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            warning: { base: '#E68900', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            danger: { base: '#D92121', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            info: { base: '#6B7794', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' }
        }
    },

    lakeBlue: {
        name: '清新湖蓝',
        colors: {
            primary: { base: '#00B5D8', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            success: { base: '#00B42A', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            warning: { base: '#FF9500', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            danger: { base: '#F04438', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            info: { base: '#748A99', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' }
        }
    },

    mintGreen: {
        name: '薄荷青绿',
        colors: {
            primary: { base: '#00B490', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            success: { base: '#00A86B', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            warning: { base: '#FF9F43', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            danger: { base: '#E53E3E', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            info: { base: '#6E9991', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' }
        }
    },

    forestGreen: {
        name: '森林深绿',
        colors: {
            primary: { base: '#2E7D32', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            success: { base: '#4CAF50', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            warning: { base: '#F57C00', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            danger: { base: '#D32F2F', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            info: { base: '#708C72', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' }
        }
    },

    roseRed: {
        name: '轻奢玫瑰红',
        colors: {
            primary: { base: '#F52273', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            success: { base: '#00B42A', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            warning: { base: '#FF7D00', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            danger: { base: '#CF1322', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            info: { base: '#947A86', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' }
        }
    },

    wineRed: {
        name: '复古酒红',
        colors: {
            primary: { base: '#9E2B25', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            success: { base: '#2A9D8F', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            warning: { base: '#E9C46A', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            danger: { base: '#E76F51', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            info: { base: '#8C6B69', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' }
        }
    },

    caramelOrange: {
        name: '焦糖暖橙',
        colors: {
            primary: { base: '#E66425', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            success: { base: '#38A169', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            warning: { base: '#D69E2E', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            danger: { base: '#C53030', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            info: { base: '#997059', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' }
        }
    },

    lightViolet: {
        name: '浅芋紫',
        colors: {
            primary: { base: '#9C6ADE', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            success: { base: '#36D399', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            warning: { base: '#FBBD23', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            danger: { base: '#F87272', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            info: { base: '#9180A8', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' }
        }
    },

    indigo: {
        name: '沉静靛蓝',
        colors: {
            primary: { base: '#3F51B5', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            success: { base: '#4CAF50', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            warning: { base: '#FFC107', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            danger: { base: '#F44336', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            info: { base: '#737CA1', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' }
        }
    },

    cyanGray: {
        name: '极简青灰',
        colors: {
            primary: { base: '#457B9D', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            success: { base: '#52B788', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            warning: { base: '#F4A261', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            danger: { base: '#E76F51', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            info: { base: '#8299A8', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' }
        }
    },

    darkGray: {
        name: '高级黑金灰',
        colors: {
            primary: { base: '#2C3E50', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            success: { base: '#27AE60', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            warning: { base: '#F39C12', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            danger: { base: '#E74C3C', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' },
            info: { base: '#7F8C8D', light3: '', light5: '', light7: '', light8: '', light9: '', dark2: '' }
        }
    }
}

export type ThemeKey = keyof typeof themeList
export let activeThemeKey: ThemeKey = 'default'

/**
 * 修复版生成梯度色，不会发白，贴合Element Plus官方渐变逻辑
 */
function generateColorGroup(baseHex: string): ColorGroup {
    const baseColor = tinycolor(baseHex)
    const hsl = baseColor.toHsl()

    // 固定提亮梯度，逐级提升亮度、降低饱和度，限制亮度最大 0.96
    const genLight = (addLight: number, satReduce: number) => {
        let newL = hsl.l + addLight
        // 亮度封顶0.96，防止变白
        if (newL > 0.96) newL = 0.96
        let newS = hsl.s - satReduce
        if (newS < 0) newS = 0
        return tinycolor({ h: hsl.h, s: newS, l: newL }).toHexString()
    }

    // 加深dark2
    const dark2 = tinycolor(baseHex)
        .darken(12)
        .toHexString()

    return {
        base: baseHex,
        light3: genLight(0.18, 0.08),
        light5: genLight(0.32, 0.16),
        light7: genLight(0.46, 0.26),
        light8: genLight(0.56, 0.34),
        light9: genLight(0.64, 0.42),
        dark2
    }
}

// 批量生成整套5类色梯度
function generateThemeColors(raw: ThemeColors): ThemeColors {
    return {
        primary: generateColorGroup(raw.primary.base),
        success: generateColorGroup(raw.success.base),
        warning: generateColorGroup(raw.warning.base),
        danger: generateColorGroup(raw.danger.base),
        info: generateColorGroup(raw.info.base)
    }
}

// 批量设置全部CSS变量
export function setTheme(key: ThemeKey) {
    const root = document.documentElement
    activeThemeKey = key
    const rawTheme = themeList[key]
    if (!rawTheme) return
    const colorSet = generateThemeColors(rawTheme.colors)

    const setGroup = (prefix: string, g: ColorGroup) => {
        root.style.setProperty(`--el-color-${prefix}`, g.base)
        root.style.setProperty(`--el-color-${prefix}-light-3`, g.light3)
        root.style.setProperty(`--el-color-${prefix}-light-5`, g.light5)
        root.style.setProperty(`--el-color-${prefix}-light-7`, g.light7)
        root.style.setProperty(`--el-color-${prefix}-light-8`, g.light8)
        root.style.setProperty(`--el-color-${prefix}-light-9`, g.light9)
        root.style.setProperty(`--el-color-${prefix}-dark-2`, g.dark2)
    }

    setGroup('primary', colorSet.primary)
    setGroup('success', colorSet.success)
    setGroup('warning', colorSet.warning)
    setGroup('danger', colorSet.danger)
    setGroup('info', colorSet.info)

    localStorage.setItem('theme-active-key', key)
}

// 初始化读取本地缓存主题
export function initLoadTheme() {
    const cache = localStorage.getItem('theme-active-key') as ThemeKey
    if (cache && themeList[cache]) {
        setTheme(cache)
    }
}