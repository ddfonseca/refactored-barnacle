import { User, UserModel } from './user.model';

export interface IUserRepository {
    findByUsername(username: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    create(username: string, password: string): Promise<User>;
    updateRefreshToken(userId: string, refreshToken: string | undefined): Promise<User | null>;
}

export class MongoDBUserRepository implements IUserRepository {
    async findByUsername(username: string): Promise<User | null> {
        return UserModel.findOne({ username });
    }

    async findById(id: string): Promise<User | null> {
        return UserModel.findById(id);
    }

    async create(username: string, password: string): Promise<User> {
        const user = new UserModel({ username, password });
        return user.save();
    }

    async updateRefreshToken(userId: string, refreshToken: string | undefined): Promise<User | null> {
        const user = await UserModel.findById(userId);
        if (!user) {
            return null;
        }

        user.refreshToken = refreshToken;
        return user.save();
    }
}
