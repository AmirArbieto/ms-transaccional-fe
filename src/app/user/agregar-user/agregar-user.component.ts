import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agregar-user',
  templateUrl: './agregar-user.component.html',
  styleUrls: ['./agregar-user.component.css']
})
export class AgregarUserComponent {
  newUser: User = {
    id: '',
    name: '',
    lastname_paternal: '',
    lastname_maternal: '',
    birthdate: '',
    document_type: '',
    document_number: '',
    email: '',
    phone: '',
    phone_optional: '',
    status: 'A' // Por defecto, el estado es 'A' de Activo
  };

  nameMessage = '';
  nameColor = '';
  lastnamePaternalMessage = '';
  lastnamePaternalColor = '';
  lastnameMaternalMessage = '';
  lastnameMaternalColor = '';
  documentTypeMessage = '';
  documentTypeColor = '';
  documentNumberMessage = '';
  documentNumberColor = '';
  emailMessage = '';
  emailColor = '';
  phoneMessage = '';
  phoneColor = '';
  phoneOptionalMessage: string = '';     
  phoneOptionalColor: string = '';
  birthdateMessage: string = '';
  birthdateColor: string = '';
  isBirthdateValid = false; // Variable para verificar si la fecha de nacimiento es válida

  constructor(private userService: UserService, private router: Router) { }

  onSubmit(form: NgForm) {
    // Validar si el formulario es válido y todos los campos están llenados correctamente
    if (form.valid && this.areFieldsValid()) {
      this.userService.postData(this.newUser).subscribe(
        () => {
          Swal.fire('Usuario agregado', 'El usuario ha sido agregado con éxito', 'success');
          form.resetForm(); // Reinicia el formulario después de enviar
          this.listarUser();
        },
        error => {
          console.error('Error al agregar usuario:', error);
          Swal.fire('Error', 'Hubo un problema al agregar el usuario', 'error');
        }
      );
    } else {
      Swal.fire('Error', 'Por favor, complete todos los campos correctamente.', 'error');
    }
  }

  areFieldsValid(): boolean {
    return (
      this.nameColor === 'green' &&
      this.lastnamePaternalColor === 'green' &&
      this.lastnameMaternalColor === 'green' &&
      this.birthdateColor === 'green' &&
      this.documentTypeColor === 'green' &&
      this.documentNumberColor === 'green' &&
      this.emailColor === 'green' &&
      this.phoneColor === 'green'
    );
  }

  listarUser() {
    this.router.navigate(['/user']);
    Swal.fire(
      'USUARIO NUEVO AGREGADO',
      `El Usuario ha sido agregado EXITOSAMENTE`,
      'success'
    );
  }

  validateName(name: string): boolean {
    return /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(name);
  }

  onNameInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const nameValue = inputElement.value.toUpperCase();

    if (this.validateName(nameValue)) {
      this.nameMessage = 'Nombre válido';
      this.nameColor = 'green';
    } else {
      this.nameMessage = 'El nombre es inválido';
      this.nameColor = 'red';
    }
    this.newUser.name = nameValue;
  }

  onLastnamePaternalInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const lastnamePaternalValue = inputElement.value.toUpperCase();

    if (this.validateName(lastnamePaternalValue)) {
      this.lastnamePaternalMessage = 'Apellido paterno válido';
      this.lastnamePaternalColor = 'green';
    } else {
      this.lastnamePaternalMessage = 'El apellido paterno es inválido';
      this.lastnamePaternalColor = 'red';
    }
    this.newUser.lastname_paternal = lastnamePaternalValue;
  }

  onLastnameMaternalInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const lastnameMaternalValue = inputElement.value.toUpperCase();

    if (this.validateName(lastnameMaternalValue)) {
      this.lastnameMaternalMessage = 'Apellido materno válido';
      this.lastnameMaternalColor = 'green';
    } else {
      this.lastnameMaternalMessage = 'El apellido materno es inválido';
      this.lastnameMaternalColor = 'red';
    }
    this.newUser.lastname_maternal = lastnameMaternalValue;
  }

  onDocumentTypeChange(documentType: string) {
    if (documentType === 'DNI' || documentType === 'CNE') {
      this.documentTypeMessage = `Tipo de documento elegido: ${documentType}`;
      this.documentTypeColor = 'green';
    } else {
      this.documentTypeMessage = 'Seleccione un tipo de documento válido';
      this.documentTypeColor = 'red';
    }
  }

  onDocumentNumberChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const documentNumber = inputElement.value;

    if (this.newUser.document_type === 'DNI') {
      if (/^\d{8}$/.test(documentNumber)) {
        this.documentNumberMessage = 'Número de DNI válido';
        this.documentNumberColor = 'green';
      } else {
        this.documentNumberMessage = 'Ingrese 8 números para DNI';
        this.documentNumberColor = 'red';
      }
    } else if (this.newUser.document_type === 'CNE') {
      if (/^\d{15}$/.test(documentNumber)) {
        this.documentNumberMessage = 'Número de CNE válido';
        this.documentNumberColor = 'green';
      } else {
        this.documentNumberMessage = 'Ingrese 15 números para CNE';
        this.documentNumberColor = 'red';
      }
    } else {
      this.documentNumberMessage = 'Seleccione un tipo de documento válido';
      this.documentNumberColor = 'red';
    }
    this.newUser.document_number = documentNumber;
  }

  onEmailChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const email = inputElement.value;

    const validEmails = ['@gmail.com', '@yahoo.com', '@hotmail.com', '@outlook.com', '@vallegrande.edu.pe']; // Terminaciones válidas
    const validEmail = validEmails.some(ending => email.includes(ending));

    if (validEmail) {
      this.emailMessage = 'Email aceptado';
      this.emailColor = 'green';
    } else {
      this.emailMessage = 'Coloque un email válido';
      this.emailColor = 'red';
    }
    this.newUser.email = email;
  }

  onPhoneChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const phone = inputElement.value;

    if (/^9\d{8}$/.test(phone)) {
      this.phoneMessage = 'Número de teléfono válido';
      this.phoneColor = 'green';
    } else {
      this.phoneMessage = 'Ingrese un número de teléfono válido (debe comenzar con 9 y tener 9 dígitos)';
      this.phoneColor = 'red';
    }
    this.newUser.phone = phone;
  }

  onphoneOptionalChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const phoneOptional = inputElement.value;

    if (/^9\d{8}$/.test(phoneOptional)) {
      this.phoneOptionalMessage = 'Número de teléfono válido';
      this.phoneOptionalColor = 'green';
    } else {
      this.phoneOptionalMessage = 'Ingrese un número de teléfono válido (debe comenzar con 9 y tener 9 dígitos)';
      this.phoneOptionalColor = 'red';
    }
    this.newUser.phone_optional = phoneOptional;
  }

  onBirthdateChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const birthdate = inputElement.value;
    const currentDate = new Date();
    const birthdateDate = new Date(birthdate);
    let age = currentDate.getFullYear() - birthdateDate.getFullYear();
    const monthDiff = currentDate.getMonth() - birthdateDate.getMonth();
    const dayDiff = currentDate.getDate() - birthdateDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    if (age >= 14) {
      this.birthdateMessage = 'Fecha de nacimiento válida';
      this.birthdateColor = 'green';
    } else {
      this.birthdateMessage = 'LO SENTIMOS USTED AÚN NO TIENE LA MÍNIMA QUE ES 14, [NO SE PREOCUPE APENAS LA CUMPLA NOSOTROS NOS CONTACTAMOS]';
      this.birthdateColor = 'red';
    }
    this.newUser.birthdate = birthdate;
  }
  cancelar() {
    this.router.navigate(['/user']);
  }


  areFieldsEmpty(): boolean {
    return (
      !this.newUser.name ||
      !this.newUser.lastname_paternal ||
      !this.newUser.lastname_maternal ||
      !this.newUser.birthdate ||
      !this.newUser.document_type ||
      !this.newUser.document_number ||
      !this.newUser.email ||
      !this.newUser.phone 
    );
  }
}
