import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-actualizar-user',
  templateUrl: './actualizar-user.component.html',
  styleUrls: ['./actualizar-user.component.css']
})
export class ActualizarUserComponent implements OnInit {

  id: string = ''; 
  euser: User = new User();
  
  nameMessage: string = '';
  nameColor: string = '';
  lastnamePaternalMessage: string = '';
  lastnamePaternalColor: string = '';
  lastnameMaternalMessage: string = '';
  lastnameMaternalColor: string = '';
  documentTypeMessage: string = '';
  documentTypeColor: string = '';
  documentNumberMessage: string = '';
  documentNumberColor: string = '';
  emailMessage: string = '';
  emailColor: string = '';
  phoneMessage: string = '';
  phoneColor: string = '';
  phoneOptionalMessage: string = '';
  phoneOptionalColor: string = '';
  birthdateMessage: string = '';
  birthdateColor: string = '';
  isBirthdateValid: boolean = false;

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.userService.obtenerUserPorId(this.id).subscribe(dato => {
      this.euser = dato;
    }, error => console.log(error));
  }

  listarUser() {
    this.router.navigate(['/user']);
    Swal.fire('Usuario actualizado', `El usuario ${this.euser.name} ha sido actualizado con éxito`, 'success');
  }

  cancelar() {
    this.router.navigate(['/user']);
  }

  onSubmit() {
    if (this.areFieldsEmpty() || !this.isBirthdateValid) {
      Swal.fire('Error', 'Formulario no válido. Por favor, complete todos los campos correctamente', 'error');
    } else {
      this.userService.actualizarUser(this.id, this.euser).subscribe(dato => {
        this.euser.name = this.euser.name.toUpperCase();
        this.euser.lastname_paternal = this.euser.lastname_paternal.toUpperCase();
        this.euser.lastname_maternal = this.euser.lastname_maternal.toUpperCase();
        this.listarUser();
      }, error => console.log(error));
    }
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
    this.euser.name = nameValue;
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
    this.euser.lastname_paternal = lastnamePaternalValue;
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
    this.euser.lastname_maternal = lastnameMaternalValue;
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

  onDocumentNumberChange(documentNumber: string) {
    if (this.euser.document_type === 'DNI') {
      if (/^\d{8}$/.test(documentNumber)) {
        this.documentNumberMessage = 'Número de DNI válido';
        this.documentNumberColor = 'green';
      } else {
        this.documentNumberMessage = 'Ingrese 8 números para DNI';
        this.documentNumberColor = 'red';
      }
    } else if (this.euser.document_type === 'CNE') {
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
  }

  onEmailChange(email: string) {
    const validEmails = ['@gmail.com', '@yahoo.com', '@hotmail.com', '@outlook.com', '@vallegrande.edu.pe'];
    const validEmail = validEmails.some(ending => email.includes(ending));

    if (validEmail) {
      this.emailMessage = 'Email aceptado';
      this.emailColor = 'green';
    } else {
      this.emailMessage = 'Coloque un email válido';
      this.emailColor = 'red';
    }
  }

  onPhoneChange(phone: string) {
    if (/^9\d{8}$/.test(phone)) {
      this.phoneMessage = 'Número de teléfono válido';
      this.phoneColor = 'green';
    } else {
      this.phoneMessage = 'Ingrese un número de teléfono válido (debe comenzar con 9 y tener 9 dígitos)';
      this.phoneColor = 'red';
    }
  }

  onphoneOptionalChange(phone_optional: string) {
    if (/^9\d{8}$/.test(phone_optional)) {
      this.phoneOptionalMessage = 'Número de teléfono válido';
      this.phoneOptionalColor = 'green';
    } else {
      this.phoneOptionalMessage = 'Ingrese un número de teléfono válido (debe comenzar con 9 y tener 9 dígitos)';
      this.phoneOptionalColor = 'red';
    }
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
      this.isBirthdateValid = true;
    } else {
      this.birthdateMessage = 'LO SENTIMOS USTED AÚN NO TIENE LA EDAD MÍNIMA QUE ES 14, [NO SE PREOCUPE APENAS LA CUMPLA NOSOTROS NOS CONTACTAMOS]';
      this.birthdateColor = 'red';
      this.isBirthdateValid = false;
    }
    this.euser.birthdate = birthdate;
  }

  areFieldsEmpty(): boolean {
    return (
      !this.euser.name ||
      !this.euser.lastname_paternal ||
      !this.euser.lastname_maternal ||
      !this.euser.birthdate ||
      !this.euser.document_type ||
      !this.euser.document_number ||
      !this.euser.email ||
      !this.euser.phone
    );
  }
}
