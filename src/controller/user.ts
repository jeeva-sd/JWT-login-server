import { Request } from 'express';
import User from '../core/user';
import { controller, POST } from '../utils';
import { Authenticate, GET } from '../utils/lib';

@controller('/user')
class UserController {
    private user: User;

    constructor() {
        this.user = this.userInstance();
    }

    @POST('/login')
    public login(req: Request) {
        return this.user.login(req.body);
    }

    @GET('/:id')
    @Authenticate()
    public userById(req: Request) {
        return this.user.id(req.params.id);
    }

    @POST('/register')
    public register(req: Request) {
        return this.user.register(req.body);
    }

    private userInstance(): User {
        if (!this.user) this.user = new User();
        return this.user;
    }
}

export default UserController;