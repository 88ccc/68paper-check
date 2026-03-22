import { useWebsitConfigStore } from '@/stores/websitConfig';


export function CompleteUrl(url: string) {
    let websitConfigStore = useWebsitConfigStore()
    const { apiUrl } = websitConfigStore
    if (url == "") {
        return "";
    }
    if (url == undefined || url == null || (typeof url !== "string")) {
        return "";
    }
    if (url.startsWith("http://") || url.startsWith("https://)")) {
        return url;
    } else {
        console.log("apiUrl", apiUrl);
        return apiUrl + url;
    }
}

export function mySleepMs(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


/**
 * 判断当前浏览器环境类型
 * @returns 'pc' | 'mobile' | 'wechat' 分别表示电脑浏览器、手机浏览器、微信内置浏览器
 */
export const getBrowserType = (): 'pc' | 'mobile' | 'wechat' => {
    // 获取用户代理字符串
    const userAgent = navigator.userAgent.toLowerCase()

    // 先判断是否为微信内置浏览器
    if (/MicroMessenger/i.test(userAgent)) {
        return 'wechat'
    }
    //判断是否为平板
    const ua = navigator.userAgent.toLowerCase();
    const isTablet = /ipad|android(?!.*mobile)|tablet|kindle|silk/i.test(ua);
    if (isTablet) {
        // 把平板视为PC因为尺寸比较大
        return 'pc';
    }

    // 判断是否为移动设备浏览器
    const isMobile = /mobile|android|iphone|ipod|ipad|ios|phone|blackberry|iemobile|opera mini/i.test(userAgent)

    return isMobile ? 'mobile' : 'pc'
}