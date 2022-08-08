import * as axios from 'axios';
import { AxiosInstance } from 'axios';

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
    http: AxiosInstance;
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
    getLotteriesLuckyUsers(data: {
        page_no: number;
        page_size: number;
    }): Promise<axios.AxiosResponse<any, any>>;
    dipLucky(lottery_history_id: number): Promise<axios.AxiosResponse<any, any>>;
    getMyLucky(): Promise<axios.AxiosResponse<any, any>>;
}

declare class Seagold {
    juejin: JuejinHelper;
    http: AxiosInstance;
    constructor(juejin: JuejinHelper);
    setToken(token: string): void;
    gameLogin(): Promise<axios.AxiosResponse<any, any>>;
    gameInfo(): Promise<axios.AxiosResponse<any, any>>;
    gameStart(data: {
        roleId: 1 | 2 | 3;
    }): Promise<axios.AxiosResponse<any, any>>;
    gameOver(data: {
        isButton: number;
    }): Promise<axios.AxiosResponse<any, any>>;
    gameCommand(gameId: number, command?: never[]): Promise<axios.AxiosResponse<any, any>>;
}

/**
 * 数字拼图
 * 游戏地址: https://juejin.cn/game/shuzimiti/
 */
declare class NumPuzz {
    juejin: JuejinHelper;
    http: AxiosInstance;
    constructor(juejin: JuejinHelper);
    setToken(token: string): void;
    /**
     * 游戏登录
     * @returns {Promise<*>}
     */
    gameLogin(): Promise<axios.AxiosResponse<any, any>>;
    /**
     * 获取主页信息
     * @returns {Promise<*>}
     * bug: 0
     * diamond: 200
     * originality: 0
     * showToast: false
     */
    gameInfo(): Promise<axios.AxiosResponse<any, any>>;
    /**
     * 开始游戏
     * @param level Number [1|2|3] 简单|中等|困难
     * @returns {Promise<*>}
     * guide: 0
     * level: 游戏等级
     * map: 游戏地图
     * round: 关卡
     * target: 目标结果
     */
    gameStart(data: {
        level: number;
    }): Promise<axios.AxiosResponse<any, any>>;
    /**
     * 跳过游戏
     * @description 结构同开始游戏
     * @param level
     * @returns {Promise<*>}
     */
    gameSkip(data: {
        level: number;
    }): Promise<axios.AxiosResponse<any, any>>;
    /**
     * 游戏完成
     * @param level Array<[x, y, direction]>, direction["u", "d", "l", "r"]
     * @param command
     * @returns {Promise<*>}
     */
    gameComplete(data: {
        level: number;
        command: [number, number, "u" | "d" | "l" | "r"];
    }): Promise<axios.AxiosResponse<any, any>>;
}

interface Bug {
    bug_type: number;
    bug_time: number;
    bug_show_type: number;
    is_first: boolean;
}
declare class Bugfix {
    http: AxiosInstance;
    constructor(juejin: JuejinHelper);
    /**
     * 获取竞赛信息
     * @returns {Promise<*>}
     */
    getCompetition(): Promise<axios.AxiosResponse<any, any>>;
    /**
     * 获取用户信息
     * @param competition_id
     * @returns {Promise<*>}
     */
    getUser(data: {
        competition_id: number;
    }): Promise<axios.AxiosResponse<any, any>>;
    /**
     * 获取未收集的Bug
     * @returns {Promise<*>}
     *  [
     *   {
     *     bug_type: number 类型位置
     *     bug_time: number 时间戳
     *     bug_show_type: 1 显示类型
     *     is_first: boolean 是否第一次
     *   }
     * ]
     *
     */
    getNotCollectBugList(): Promise<Bug[]>;
    /**
     * 收集Bug
     * @param bug_time
     * @param bug_type
     * @returns {Promise<*>}
     */
    collectBug(data: Bug): Promise<axios.AxiosResponse<any, any>>;
    /**
     * 批量收集Bug
     * @param buglist
     * @returns {Promise<boolean|*>}
     */
    collectBugBatch(buglist?: Bug[]): Promise<boolean | unknown>;
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
    seagold(): Seagold;
    numpuzz(): NumPuzz;
    bugfix(): Bugfix;
}

export { JuejinHelper as default };
