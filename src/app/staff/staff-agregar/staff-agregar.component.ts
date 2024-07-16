import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ubigeoLista } from 'src/app/interfaces/ubigeoLista';
import { StaffService } from 'src/app/services/institucional-staff.service';
import { UbigeoService } from 'src/app/services/ubigeo.service';


@Component({
  selector: 'app-staff-agregar',
  templateUrl: './staff-agregar.component.html',
  styleUrls: ['./staff-agregar.component.css']
})
export class StaffAgregarComponent implements OnInit {
  ubigeoList: ubigeoLista[] = [];
  documentTypeMaxLength: number = 8;
  isInvalid: boolean = false;
  isValid: boolean = false;
  isCountryValid: boolean = false;
  isCountryInvalid: boolean = false;
  isUbigeoValid: boolean = false;
  isUbigeoInvalid: boolean = false;
  isCivil_statusValid: boolean = false;
  isCivil_statusInvalid: boolean = false;
  isNative_languageValid: boolean = false;
  isNative_languageInvalid: boolean = false;
  isNameValid: boolean = false;
  isNameInvalid: boolean = false;
  isFather_lastnameValid: boolean = false;
  isFather_lastnameInvalid: boolean = false;
  isMother_lastnameValid: boolean = false;
  isMother_lastnameInvalid: boolean = false;
  isSexValid: boolean = false;
  isSexInvalid: boolean = false;
  isPhoneValid: boolean = false;
  isPhoneInvalid: boolean = false;
  isEmailValid: boolean = false;
  isEmailInvalid: boolean = false;
  isAddressValid: boolean = false;
  isAddressInvalid: boolean = false;
  isInstruction_gradeValid: boolean = false;
  isInstruction_gradeInvalid: boolean = false;
  isDisability_typeValid: boolean = false;
  isDisability_typeInvalid: boolean = false;
  isDisabilityValid: boolean = false;
  isDisabilityInvalid: boolean = false;
  isWork_conditionValid: boolean = false;
  isWork_conditionInvalid: boolean = false;
  isOccupationValid: boolean = false;
  isOccupationInvalid: boolean = false;

  showSuccessAlert: boolean = false;
  showErrorAlert: boolean = false;
  showEmptyFieldsAlert: boolean = false;
  showCreateSuccessAlert: boolean = false;

  newStaff: any = {
    father_lastname: '',
    mother_lastname: '',
    name: '',
    document_type: '',
    document_number: '',
    sex: '',
    country: '',
    ubigeo: { id: '' },
    email: '',
    phone: '',
    civil_status: '',
    instruction_grade: '',
    disability_type: '',
    disability: '',
    work_condition: '',
    occupation: '',
    native_language: '',
    state: 'A',
    address: ''
  };

  constructor(
    private staffService: StaffService,
    private ubigeoService: UbigeoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUbigeoList();
  }

  createStaff() {
    // Convertir el objeto this.newStaff a JSON y mostrarlo en la consola
    console.log('Datos a enviar:', JSON.stringify(this.newStaff, null, 2));
    console.log('REQUIRED:', this.areRequiredFieldsEmpty());

    if (this.areRequiredFieldsEmpty()) {
      this.showEmptyFieldsAlert = true;
      this.showSuccessAlert = false;
      this.showErrorAlert = false;
      return;
    }

    this.staffService.create(this.newStaff).subscribe(
      response => {
        console.log('Personal creado:', response);
        this.showSuccessAlert = true;
        this.showErrorAlert = false;
        this.showEmptyFieldsAlert = false;
        this.showCreateSuccessAlert = true; // Mostrar la alerta de creación exitosa
        // Mostrar la alerta de éxito por 5 segundos antes de redirigir
          setTimeout(() => {
            this.router.navigate(['/staff']); // Redirige a la lista de personal después de la actualización
          }, 3000); // 5000 milisegundos = 5 segundos
      },
      error => {
        console.error('Error al crear personal:', error);
        this.showSuccessAlert = false;
        this.showErrorAlert = true;
        this.showEmptyFieldsAlert = false;
      }
    );
  }


  areRequiredFieldsEmpty(): boolean {
    return !this.newStaff.father_lastname || !this.newStaff.mother_lastname || !this.newStaff.name ||
      !this.newStaff.document_type || !this.newStaff.document_number || !this.newStaff.sex ||
      !this.newStaff.country || !this.newStaff.ubigeo.id || !this.newStaff.email ||
      !this.newStaff.phone || !this.newStaff.civil_status || !this.newStaff.instruction_grade ||
      !this.newStaff.disability || !this.newStaff.work_condition ||
      !this.newStaff.native_language || !this.newStaff.address;
  }

  closeAlert(): void {
    this.showSuccessAlert = false;
    this.showErrorAlert = false;
    this.showEmptyFieldsAlert = false;
  }

  loadUbigeoList(): void {
    this.ubigeoService.getAllUbigeos().subscribe(
      (data: ubigeoLista[]) => {
        this.ubigeoList = data;
      },
      error => {
        console.error('Error al cargar los ubigeos', error);
      }
    );
  }

  onDocumentTypeChange(): void {
    if (this.newStaff.document_type === 'DNI') {
      this.documentTypeMaxLength = 8;
    } else if (this.newStaff.document_type === 'CNE') {
      this.documentTypeMaxLength = 11;
    }
    this.newStaff.document_number = '';
    this.isInvalid = false;
    this.isValid = false;
  }

  onDocumentNumberInput(): void {
    const docNumber = this.newStaff.document_number;
    if (this.newStaff.document_type === 'DNI' && docNumber.length === 8) {
      this.isValid = true;
      this.isInvalid = false;
    } else if (this.newStaff.document_type === 'CNE' && docNumber.length === 11) {
      this.isValid = true;
      this.isInvalid = false;
    } else {
      this.isInvalid = true;
      this.isValid = false;
    }
  }

  preventNonNumeric(event: KeyboardEvent): void {
    if (event.key < '0' || event.key > '9') {
      if (event.key !== 'Backspace' && event.key !== 'Delete' && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
        event.preventDefault();
      }
    }
  }

  onCountryChange(): void {
    if (this.newStaff.country) {
      this.isCountryValid = true;
      this.isCountryInvalid = false;
    } else {
      this.isCountryValid = false;
      this.isCountryInvalid = true;
    }
  }

  onUbigeoChange(): void {
    if (this.newStaff.ubigeo) {
      this.isUbigeoValid = true;
      this.isUbigeoInvalid = false;
    } else {
      this.isUbigeoValid = false;
      this.isUbigeoInvalid = true;
    }
  }

  onCivil_statusChange(): void {
    if (this.newStaff.civil_status) {
      this.isCivil_statusValid = true;
      this.isCivil_statusInvalid = false;
    } else {
      this.isCivil_statusValid = false;
      this.isCivil_statusInvalid = true;
    }
  }

  onNative_languageChange(): void {
    if (this.newStaff.native_language) {
      this.isNative_languageValid = true;
      this.isNative_languageInvalid = false;
    } else {
      this.isNative_languageValid = false;
      this.isNative_languageInvalid = true;
    }
  }

  capitalizeWords(str: string): string {
    return str.replace(/\b\w/g, char => char.toUpperCase());
  }

  preventNonAlphabetic(event: KeyboardEvent): void {
    if (!/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]*$/.test(event.key)) {
      event.preventDefault();
    }
  }

  onNameInput(): void {
    this.newStaff.name = this.capitalizeWords(this.newStaff.name);
    if (this.newStaff.name.length > 0) {
      this.isNameValid = true;
      this.isNameInvalid = false;
    } else {
      this.isNameValid = false;
      this.isNameInvalid = true;
    }
  }

  onFather_lastnameInput(): void {
    this.newStaff.father_lastname = this.capitalizeWords(this.newStaff.father_lastname.replace(/\s+/g, ''));
    if (this.newStaff.father_lastname.length > 0) {
      this.isFather_lastnameValid = true;
      this.isFather_lastnameInvalid = false;
    } else {
      this.isFather_lastnameValid = false;
      this.isFather_lastnameInvalid = true;
    }
  }

  onMother_lastnameInput(): void {
    this.newStaff.mother_lastname = this.capitalizeWords(this.newStaff.mother_lastname.replace(/\s+/g, ''));
    if (this.newStaff.mother_lastname.length > 0) {
      this.isMother_lastnameValid = true;
      this.isMother_lastnameInvalid = false;
    } else {
      this.isMother_lastnameValid = false;
      this.isMother_lastnameInvalid = true;
    }
  }

  onSexChange(): void {
    if (this.newStaff.sex) {
      this.isSexValid = true;
      this.isSexInvalid = false;
    } else {
      this.isSexValid = false;
      this.isSexInvalid = true;
    }
  }

  preventInvalidPhoneInput(event: KeyboardEvent): void {
    const firstChar = this.newStaff.phone.charAt(0);
    if (event.key < '0' || event.key > '9') {
      if (event.key !== 'Backspace' && event.key !== 'Delete' && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
        event.preventDefault();
      }
    }
    if (this.newStaff.phone.length === 0 && event.key !== '9') {
      event.preventDefault();
    }
  }

  onPhoneInput(): void {
    const phone = this.newStaff.phone;
    if (phone.length === 9 && phone.charAt(0) === '9') {
      this.isPhoneValid = true;
      this.isPhoneInvalid = false;
    } else {
      this.isPhoneInvalid = true;
      this.isPhoneValid = false;
    }
  }

  onEmailInput(): void {
    const email = this.newStaff.email.trim(); // Obtener el valor del email y quitar espacios al inicio y final

    if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      this.isEmailValid = true;
      this.isEmailInvalid = false;
    } else {
      this.isEmailValid = false;
      this.isEmailInvalid = true;
    }
  }

  onAddressInput(): void {
    const address = this.newStaff.address.trim(); // Obtener el valor de la dirección y quitar espacios al inicio y final

    // Validar la primera letra en mayúscula
    if (address.length > 0) {
      const firstChar = address.charAt(0);
      if (firstChar !== firstChar.toUpperCase()) {
        // Convertir la primera letra a mayúscula si no lo está
        this.newStaff.address = firstChar.toUpperCase() + address.slice(1);
      }
    }

    // Validar la presencia de @ en la dirección
    if (address.includes('@')) {
      this.isAddressValid = false;
      this.isAddressInvalid = true;
    } else {
      this.isAddressValid = true;
      this.isAddressInvalid = false;
    }
  }

  onInstruction_gradeChange(): void {
    if (this.newStaff.instruction_grade) {
      this.isInstruction_gradeValid = true;
      this.isInstruction_gradeInvalid = false;
    } else {
      this.isInstruction_gradeValid = false;
      this.isInstruction_gradeInvalid = true;
    }
  }

  //¿TIENE DISCAPACIDAD? ---------------------------
  onDisabilityInput(): void {

    if (this.newStaff.disability) {
      this.isDisabilityValid = true;
      this.isDisabilityInvalid = false;
    } else {
      this.isDisabilityValid = false;
      this.isDisabilityInvalid = true;
    }
  }

  //TIPO DE DISCAPACIDAD -----------------------------
  onDisability_typeChange(): void {
    
    const disability_type = this.newStaff.disability_type.trim(); // Obtener el valor de la dirección y quitar espacios al inicio y final

    // Validar la primera letra en mayúscula
    if (disability_type.length > 0) {
      const firstChar = disability_type.charAt(0);
      if (firstChar !== firstChar.toUpperCase()) {
        // Convertir la primera letra a mayúscula si no lo está
        this.newStaff.disability_type = firstChar.toUpperCase() + disability_type.slice(1);
      }
    }

    // Validar la presencia de @ en la dirección
    if (disability_type.includes('@')) {
      this.isDisability_typeValid = false;
      this.isDisability_typeInvalid = true;
    } else {
      this.isDisability_typeValid = true;
      this.isDisability_typeInvalid = false;
    }
  }

  onWork_conditionChange(): void {
    if (this.newStaff.work_condition) {
      this.isWork_conditionValid = true;
      this.isWork_conditionInvalid = false;
    } else {
      this.isWork_conditionValid = false;
      this.isWork_conditionInvalid = true;
    }
  }

  onOccupationInput(): void {
    const occupation = this.newStaff.occupation.trim(); // Obtener el valor de la dirección y quitar espacios al inicio y final

    // Validar la primera letra en mayúscula
    if (occupation.length > 0) {
      const firstChar = occupation.charAt(0);
      if (firstChar !== firstChar.toUpperCase()) {
        // Convertir la primera letra a mayúscula si no lo está
        this.newStaff.occupation = firstChar.toUpperCase() + occupation.slice(1);
      }
    }

    // Validar la presencia de @ en la dirección
    if (occupation.includes('@')) {
      this.isOccupationValid = false;
      this.isOccupationInvalid = true;
    } else {
      this.isOccupationValid = true;
      this.isOccupationInvalid = false;
    }
  }
}