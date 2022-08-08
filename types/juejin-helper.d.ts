import * as axios from 'axios';

declare class Cookie {
    cookie: string;
    stack: Map<string, unknown>;
    constructor(cookie?: string);
    setCookieValue(cookie?: string): void;
    get(key: string): unknown;
    has(key: string): boolean;
    set(key: string, value: unknown): Map<string, unknown>;
    entries(): IterableIterator<[string, unknown]>;
    clear(): void;
    toString(): string;
}

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
declare type jsonstring = string;
interface SDKEvent {
    event: string;
    local_time_ms: number;
    params: jsonstring;
    ab_sdk_version?: string;
    is_bav?: number;
    session_id?: string;
}
interface SDKListResult {
    e: number;
}
/**
 * SDK
 */
declare class Sdk {
    juejin: JuejinHelper;
    sdk_type: string;
    sdk_lib: string;
    sdk_version: string;
    constructor(juejin: JuejinHelper);
    slardarSDKSetting(): Promise<SDKSetting>;
    list(events?: SDKEvent[]): Promise<SDKListResult>;
    mockTrackGrowthEvent(): Promise<SDKListResult>;
    mockTrackOnloadEvent(): Promise<SDKListResult>;
}

declare class Growth {
    constructor(juejin: JuejinHelper);
    /**
     * 获取统计签到天数
     * @returns {Promise<*>}
     * {
     *   cont_count 连续签到天数
     *   sum_count 累计签到天数
     * }
     */
    getCounts(): Promise<axios.AxiosResponse<any, any>>;
    /**
     * 获取当前矿石数
     * @returns {Promise<*>}
     * number 当前矿石数
     */
    getCurrentPoint(): Promise<axios.AxiosResponse<any, any>>;
    /**
     * 获取今日签到状态
     * @returns {Promise<*>}
     * boolean 是否签到
     */
    getTodayStatus(): Promise<axios.AxiosResponse<any, any>>;
    /**
     * 获取月签到日历
     * @returns {Promise<*>}
     * [
     *   {
     *     date: timestamp(格式1646150400)
     *     point: number增加矿石数
     *     status: enum(1 今日, 4 未签到, 3 已签到)
     *   }
     * ]
     */
    getByMonth(): Promise<axios.AxiosResponse<any, any>>;
    getLotteryConfig(): Promise<axios.AxiosResponse<any, any>>;
    drawLottery(): Promise<axios.AxiosResponse<any, any>>;
    checkIn(): Promise<axios.AxiosResponse<any, any>>;
    getLotteriesLuckyUsers({ page_no, page_size }?: {
        page_no?: number | undefined;
        page_size?: number | undefined;
    }): Promise<axios.AxiosResponse<any, any>>;
    dipLucky(lottery_history_id: any): Promise<axios.AxiosResponse<any, any>>;
    getMyLucky(): Promise<axios.AxiosResponse<any, any>>;
}

declare type JuejinUserProps = {
    user_id: string;
    user_name: string;
    [prop: string]: any;
} | null;
declare type JuejinCookieTokens = {
    aid: string;
    uuid: string;
    user_unique_id: string;
    web_id: string;
} | null;
declare class JuejinHelper {
    cookie: Cookie;
    cookieTokens: JuejinCookieTokens;
    user: JuejinUserProps;
    login(cookie: string): Promise<void>;
    logout(): Promise<void>;
    getCookie(): string;
    getCookieTokens(): JuejinCookieTokens;
    getUser(): JuejinUserProps;
    makeToken(): Promise<string>;
    sdk(): Sdk;
    growth(): Growth;
    seagold(): void;
    numpuzz(): void;
    bugfix(): void;
}

export { JuejinHelper as default };
