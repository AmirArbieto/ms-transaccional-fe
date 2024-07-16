export class User {
    id: string;
    name: string;
    lastname_maternal: string;
    lastname_paternal: string;
    birthdate: string;
    document_type: string;
    document_number: string;
    email: string;
    phone: string;
    phone_optional: string;
    status = "A";

    constructor() {
        this.id = '';
        this.name = '';
        this.lastname_maternal = '';
        this.lastname_paternal = '';
        this.birthdate = '';
        this.document_type = '';
        this.document_number = '';
        this.email = '';
        this.phone = '';
        this.phone_optional = '';
        this.status = 'A';
    }
}
