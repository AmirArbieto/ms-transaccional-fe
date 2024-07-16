import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContactFormService } from 'src/app/services/formulario.service';
import { UserService } from 'src/app/services/user.service';
import { formulario } from 'src/app/interfaces/formulario';
import { User } from 'src/app/interfaces/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-formulario',
  templateUrl: './agregar-formulario.component.html',
  styleUrls: ['./agregar-formulario.component.css']
})
export class AgregarFormularioComponent implements OnInit {
  contactForm: formulario = new formulario();
  users: User[] = [];

  userIdMessage: string = '';
  userIdColor: string = '';
  descriptionMessage: string = '';
  descriptionColor: string = '';
  studyProgramIdMessage: string = '';
  studyProgramIdColor: string = '';
  statusMessage: string = '';
  statusColor: string = '';

  inappropriateWords: string[] = ['carajo', '', 'huavada', 'tonteria', 'pendejada', 'pendejo', 'basura', 'xd', '...', 'no sirve', 'no funciona', 'no vale', 'no recomendado', 'no recomendable', 'no lo recomiendo', 'no lo recomendaría', 'no lo recomendaria'];

  constructor(
    private contactFormService: ContactFormService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userService.getActiveUsers().subscribe(data => {
      this.users = data;
    }, error => console.log(error));
  }

  listarFormularios() {
    this.router.navigate(['/formulario']);
    Swal.fire('Formulario creado', `El formulario ha sido creado con éxito`, 'success');
  }

  cancelar() {
    this.router.navigate(['/formulario']);
  }

  onSubmit() {
    if (this.areFieldsEmpty()) {
      Swal.fire('Error', 'Formulario no válido. Por favor, complete todos los campos correctamente', 'error');
    } else {
      const invalidWord = this.isDescriptionValid(this.contactForm.description);
      if (invalidWord) {
        Swal.fire('Error', `La descripción contiene una palabra no aceptada: "${invalidWord}". Cámbiela a una que tenga relación al CETPRO`, 'error');
      } else {
        this.contactFormService.createContactForm(this.contactForm).subscribe(dato => {
          this.listarFormularios();
        }, error => console.log(error));
      }
    }
  }

  areFieldsEmpty(): boolean {
    return (
      !this.contactForm.userId ||
      !this.contactForm.description ||
      !this.contactForm.studyProgramId
    );
  }

  validateField(value: string): boolean {
    return value.trim().length > 0;
  }

  onUserIdChange(event: Event) {
    const inputElement = event.target as HTMLSelectElement;
    const userIdValue = inputElement.value;

    if (this.validateField(userIdValue)) {
      this.userIdMessage = 'Usuario válido';
      this.userIdColor = 'green';
    } else {
      this.userIdMessage = 'Seleccione un usuario válido';
      this.userIdColor = 'red';
    }
    this.contactForm.userId = userIdValue;
  }

  onDescriptionChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const descriptionValue = inputElement.value;

    if (!this.validateField(descriptionValue)) {
      this.descriptionMessage = 'La descripción no puede estar vacía';
      this.descriptionColor = 'red';
    } else {
      const invalidWord = this.isDescriptionValid(descriptionValue);
      if (!invalidWord) {
        this.descriptionMessage = 'Descripción válida';
        this.descriptionColor = 'green';
      } else {
        this.descriptionMessage = `La descripción contiene una palabra no aceptada: "${invalidWord}". Cámbiela a una que tenga relación al CETPRO`;
        this.descriptionColor = 'red';
      }
    }
    this.contactForm.description = descriptionValue;
  }

  isDescriptionValid(description: string): string | null {
    for (let word of this.inappropriateWords) {
      if (description.toLowerCase().includes(word.toLowerCase())) {
        return word;
      }
    }
    return null;
  }

  onStudyProgramIdChange(event: Event) {
    const inputElement = event.target as HTMLSelectElement;
    const studyProgramIdValue = inputElement.value;

    if (this.validateField(studyProgramIdValue)) {
      this.studyProgramIdMessage = 'Programa de estudio válido';
      this.studyProgramIdColor = 'green';
    } else {
      this.studyProgramIdMessage = 'Ingrese un programa de estudio válido';
      this.studyProgramIdColor = 'red';
    }
    this.contactForm.studyProgramId = studyProgramIdValue;
  }

  onStatusChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const statusValue = inputElement.value;

    if (this.validateField(statusValue)) {
      this.statusMessage = 'Estado válido';
      this.statusColor = 'green';
    } else {
      this.statusMessage = 'Ingrese un estado válido';
      this.statusColor = 'red';
    }
    this.contactForm.status = statusValue;
  }
}
