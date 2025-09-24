import { email } from "./UserEmail";

//esta es una clase que contiene una entidad de dominio
export class User {
    id: string;
    email: email; // ---value object(funge como una propiedad atomica)
    password: string; 
    username?: string;

    constructor(id: string, email: email, password: string, username?: string){
        this.id = id;
        this.email = email;
        this.password = password;
        this.username = username;

    }

    
}