export interface Route {
    method: string;
    url: string;
}

export interface MetaData {
    controller: string;
    routes: {
        [key: string]: Route;
    };
    auth?: any;
}

export interface TargetData {
    meta_data?: MetaData;
}

export const getMetaData = (target: TargetData): MetaData => {
    if (!target.meta_data) {
        target.meta_data = {
            controller: '',
            routes: {},
            auth: {}
        };
    }
    return target.meta_data;
}