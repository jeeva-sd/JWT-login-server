import { messages } from './messages';

export interface ApiResult {
    status?: string,
    code: number,
    message: string,
    data: any
}

const defaultOptions: any = {
    code: null,
    message: null,
    params: {},
    status: 'success'
}

export const unAuthorizedUser: ApiResult = {
    code: 403,
    message: 'Unauthorized user',
    data: null
}

const messageFormat = (message: string, values: any) => {
    if (!values) return message;
    return message.replace(/\{(\w+)}/g, function (txt: string, key: string) {
        if (values.hasOwnProperty(key)) return values[key];
        return txt;
    }.bind(this));
};

export const createResult = (code: number, data: any, options?: any): ApiResult => {
    options = { ...defaultOptions, ...(options ? options : {}) };

    const messageList: any = messages;
    let message: string = null;
    if (messages.hasOwnProperty(code)) {
        message = messageList[code].message;
    };
    if (options.message) message = options.message;
    if (message && options.params) message = messageFormat(message, options.params);

    const result: ApiResult = {
        code,
        message,
        data: data ? data : null
    }

    return result;
}

export const take = (code: number, data?: any, params?: any): ApiResult => {
    return createResult(code, data, { params });
}

export const exception = (error: string | any, data?: any): ApiResult => {
    const message = (typeof error === "string") ? error : (error.message ? error.message : error);
    return createResult(500, data, { message });
}

export const dataFound = (data: any): ApiResult => {
    return createResult(200, data);
}

export const dataNotFound = (data: any = []): ApiResult => {
    return createResult(101, data);
}

export const dataList = (data: any): ApiResult => {
    return (data && data.length > 0) ? dataFound(data) : dataNotFound([]);
}