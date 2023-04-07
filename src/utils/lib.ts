import { getMetaData } from './meta';

export const controller = (controller: string): ClassDecorator => {
    return (target: any) => {
        const meta = getMetaData(target.prototype);
        meta.controller = controller;
    };
}

export const methodDecorator = (method: string, path: string): MethodDecorator => {
    return (target: any, methodName: string, descriptor: PropertyDescriptor) => {
        const meta = getMetaData(target);
        meta.routes[methodName] = { method, url: path };
        return descriptor;
    }
}

export const GET = (path: string) => methodDecorator('get', path);
export const POST = (path: string) => methodDecorator('post', path);
export const PUT = (path: string) => methodDecorator('put', path);
export const DELETE = (path: string) => methodDecorator('delete', path);

export const Authenticate = () => {
    return (target: any, key: string, descriptor: PropertyDescriptor) => {
        const meta = getMetaData(target);
        meta.auth[key] = true;

        return descriptor;
    };
}