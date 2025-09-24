// propiedad atomica
export class email {
    value: string
    constructor(value: string) {
        this.value = this.EmailValidation(value);
    }

    private EmailValidation(email: string): string {
        const emailFilter = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailFilter.test(email)) {
            throw new Error("Correo electrónico inválido");
        }
        return email;
    }
}