export class formulario {
    id: string;
    userId: string;
    description: string;
    studyProgramId: string;
    status = "A";

    constructor() {
        this.id = '';
        this.userId = '';
        this.description = '';
        this.studyProgramId = '';
        this.status = 'A';
    }
}