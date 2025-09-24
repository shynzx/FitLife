import { User } from "./User";

export interface UserRepository{
    create(user: User): Promise<void>;
    getAll(): Promise<User[]>;
    getOneById(userId: number): Promise<User> //tambien se pueden utilizar propiedades atomicas como parametros de una funcion
    edit(user: User): Promise<void>
    delete(userId: number): Promise<void>
}