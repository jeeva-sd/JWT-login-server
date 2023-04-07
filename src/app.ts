import * as express from 'express';
import { verify } from 'jsonwebtoken';
import { combineRouter } from './router/index';
import { getMetaData, Route, unAuthorizedUser } from './utils';
const cors = require('cors');

class Application {
    private readonly app: express.Application;

    get instance(): express.Application {
        return this.app;
    }

    constructor() {
        this.app = express();
        this.app.use(cors())
        this.app.use(express.json());
        this.registerRouters();
    }

    private registerRouters() {
        this.app.get('/', (_req: express.Request, res: express.Response) => {
            res.json({ message: 'Ready for your login!' });
        });

        this.attachRouters();
        this.connectDatabase();
    }

    private connectDatabase() {
        const mongoose = require('mongoose');
        const connectionString: string = 'mongodb+srv://awsomeForm:awsomeForm@cluster0.yshhb7i.mongodb.net/?retryWrites=true&w=majority';

        mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => { console.log('Connected to MongoDB'); })
            .catch((err: any) => { console.error('Failed to connect to MongoDB:', err); });
    }

    private attachRouters() {
        combineRouter.forEach((instance: any) => {
            const controllerInstance = new instance();
            const metaData = getMetaData(controllerInstance);
            const controllerPath = metaData.controller;
            const routes = metaData.routes;
            const auth = metaData.auth;

            Object.keys(routes).forEach((methodName: string) => {
                const router: any = express.Router();
                const route: Route = routes[methodName];
                const hasAuth: Route = auth.hasOwnProperty(methodName);
                const routeMethod = route.method;

                router[routeMethod](route.url, async (req: express.Request, res: express.Response, _next: express.NextFunction) => {
                    const response = (controllerInstance as any)[methodName](req, res);
                    const authHeader = req?.headers['x-access-token'];

                    if (authHeader && hasAuth) {
                        verify(authHeader as string, 'Secret123', (err: any, _user: any) => {
                            if (err) res.status(403).send(unAuthorizedUser);
                            else {
                                if (response instanceof Promise) return response.then((data) => res.send(data));
                                else res.send(response);
                            }
                        })
                    }
                    else if (!hasAuth) return response.then((data: any) => res.send(data));
                    else res.status(403).send(unAuthorizedUser);
                });

                this.app.use(controllerPath, router);
            })
        })
    }
}

export default new Application();