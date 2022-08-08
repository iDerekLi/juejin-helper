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
    growth(): void;
    seagold(): void;
    numpuzz(): void;
    bugfix(): void;
}

export { JuejinHelper as default };
