import { User } from '../../domain/models/user';

export interface UserRepositoryPort {
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    save(user: User): Promise<User>;
}