import { generateUUID, randomRangeNumber } from "./utils/index";
import JuejinHelper from "./index";
import snssdk from "./services/snssdk";
import axios from "axios";

interface SDKSetting {
  cookieid: string;
  reportDomain: string;
  bid: string;
  plugins: {
    [prop: string]: any;
  };
  last_modify_time: string;
  heatmap: {
    [prop: string]: any;
  };
  setting: {
    [prop: string]: any;
  };
  whitelist: any[];
}

type jsonstring = string;

interface SDKEvent {
  event: string;
  local_time_ms: number;
  params: jsonstring;
  ab_sdk_version?: string;
  is_bav?: number;
  session_id?: string;
}

interface SDKListResult {
  e: 0 | -1 | -3; // 0 = ok
}

/**
 * SDK
 */
class Sdk {
  juejin: JuejinHelper;
  sdk_type: string = "npm";
  sdk_lib: string = "js";
  sdk_version: string = "4.2.9";

  constructor(juejin: JuejinHelper) {
    this.juejin = juejin;
  }

  async slardarSDKSetting(): Promise<SDKSetting> {
    return snssdk.get("https://i.snssdk.com/slardar/sdk_setting", {
      params: {
        bid: "juejin_web"
      },
      headers: {
        cookie: `MONITOR_WEB_ID=${this.juejin.cookie.get("MONITOR_WEB_ID")}`
      }
    });
  }

  async list(events: SDKEvent[] = []): Promise<SDKListResult> {
    const cookieTokens = this.juejin.getCookieTokens();
    const userInfo = this.juejin.getUser();
    const userIsLogin = !!userInfo;

    const data = [
      {
        events,
        header: {
          app_id: Number(cookieTokens?.aid),
          browser: "Chrome",
          browser_version: "99.0.4844.51",
          custom: JSON.stringify(
            userIsLogin
              ? {
                  student_verify_status: userInfo.student_status ? "student" : "not_student",
                  user_level: userInfo.level
                }
              : {}
          ),
          device_model: "Windows NT 10.0",
          os_name: "windows",
          os_version: "10",
          resolution: "1920x1080",
          screen_width: 1920,
          screen_height: 1080,
          width: 1920,
          height: 1080,
          language: "zh-CN",
          platform: "Web",
          referrer: "",
          referrer_host: "",
          sdk_lib: this.sdk_lib,
          sdk_version: this.sdk_version,
          timezone: 8,
          tz_offset: -28800,
          utm_campaign: "ad",
          utm_medium: "user_center"
        },
        local_time: (Date.now() / 1000) >> 0,
        user: {
          user_id: this.juejin.getUser()?.user_id || "",
          user_is_login: userIsLogin,
          user_unique_id: cookieTokens?.user_unique_id || "",
          web_id: cookieTokens?.web_id || ""
        }
      }
    ];

    return snssdk.post("https://mcs.snssdk.com/list", data, {
      headers: {
        host: "mcs.snssdk.com"
      }
    });
  }

  // 模拟成长API事件埋点
  async mockTrackGrowthEvent() {
    const sessionid = generateUUID();
    const localtime = Date.now();
    const eventindex = localtime + randomRangeNumber(4000, 10000);

    return this.list([
      {
        ab_sdk_version: "90000611,90001195",
        event: "task_center_sign_in_visit",
        is_bav: 0,
        local_time_ms: localtime + 1,
        params: JSON.stringify({
          event_index: eventindex + 1,
          _staging_flag: 0
        }),
        session_id: sessionid
      },
      {
        ab_sdk_version: "90000611,90001195",
        event: "predefine_pageview",
        is_bav: 0,
        local_time_ms: localtime,
        params: JSON.stringify({
          $is_first_time: "false",
          event_index: eventindex,
          referrer: "",
          time: localtime,
          title: "每日签到 - 掘金",
          url: "https://juejin.cn/user/center/signin",
          url_path: "/user/center/signin",
          _staging_flag: 0
        }),
        session_id: sessionid
      }
    ]);
  }

  // 模拟OnLoad事件埋点
  async mockTrackOnloadEvent() {
    const cookieTokens = this.juejin.getCookieTokens();
    const localtime = Date.now();

    return this.list([
      {
        event: "onload",
        local_time_ms: localtime,
        params: JSON.stringify({
          app_id: Number(cookieTokens?.aid),
          app_name: "",
          sdk_version: this.sdk_version,
          sdk_type: this.sdk_type,
          sdk_config: {
            app_id: Number(cookieTokens?.aid),
            channel: "cn",
            log: false,
            enable_ab_test: true,
            ab_channel_domain: "https://abtestvm.bytedance.com",
            cross_subdomain: true,
            cookie_expire: 94608000000,
            cookie_domain: "juejin.cn",
            enable_stay_duration: true,
            maxDuration: 1200000
          }
        })
      }
    ]);
  }
}

export default Sdk;
