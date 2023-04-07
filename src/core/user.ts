import { sign } from 'jsonwebtoken';
import { compare } from 'bcrypt';
import { dataList, exception, take } from '../utils';
import UserModal from '../database/userModal';
import { loginParams } from '../types/user';

class User {
    public async register(data: loginParams) {
        try {
            const { userName, password } = data;
            if (!userName || !password) return take(1003);

            const user = await UserModal.findOne({ userName });
            if (user) return take(1001);

            const newUser = new UserModal({ userName, password });
            await newUser.save()

            return take(1000);
        } catch (error) {
            return exception(error);
        }
    }

    public async login(data: loginParams) {
        try {
            const { userName, password } = data;
            if (!userName || !password) return take(1003);

            const user = await UserModal.findOne({ userName });
            if (!user) return take(1003);

            const isPasswordValid = await compare(password, user.password);
            const token = sign({ userName, userId: user._id }, 'Secret123', { expiresIn: '1m' });

            if (!isPasswordValid) return take(1003);
            return this.signInResult(user, token);
        } catch (error) {
            return exception(error);
        }
    }

    public async id(id: string) {
        try {
            const user = await UserModal.findById(id, 'userName');
            return !user ? take(404) : dataList([user]);
        } catch (error) {
            return take(404)
        }
    }

    private async signInResult(user: any, token: string) {
        try {
            const signInRes: any = {
                user_id: user._id,
                user_name: user.userName,
                access_token: token,
            };

            return take(1002, signInRes);
        } catch (ex) {
            return exception(ex);
        }
    }
}

export default User;