import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InstitucionalStaff } from 'src/app/interfaces/InstitucionalStaff';
import { ubigeoLista } from 'src/app/interfaces/ubigeoLista';
import { StaffService } from 'src/app/services/institucional-staff.service';
import { UbigeoService } from 'src/app/services/ubigeo.service';

@Component({
  selector: 'app-staff-editar',
  templateUrl: './staff-editar.component.html',
  styleUrls: ['./staff-editar.component.css']
})
export class StaffEditarComponent implements OnInit {
  editStaff: InstitucionalStaff = {} as InstitucionalStaff;
  ubigeoList: any[] = [];
  documentTypeMaxLength: number = 8;
  isInvalid: boolean = false;
  isValid: boolean = true;
  isCountryValid: boolean = true;
  isCountryInvalid: boolean = false;
  isUbigeoValid: boolean = true;
  isUbigeoInvalid: boolean = false;
  isCivil_statusValid: boolean = true;
  isCivil_statusInvalid: boolean = false;
  isNative_languageValid: boolean = true;
  isNative_languageInvalid: boolean = false;
  isNameValid: boolean = true;
  isNameInvalid: boolean = false;
  isFather_lastnameValid: boolean = true;
  isFather_lastnameInvalid: boolean = false;
  isMother_lastnameValid: boolean = true;
  isMother_lastnameInvalid: boolean = false;
  isSexValid: boolean = true;
  isSexInvalid: boolean = false;
  isPhoneValid: boolean = true;
  isPhoneInvalid: boolean = false;
  isEmailValid: boolean = true;
  isEmailInvalid: boolean = false;
  isAddressValid: boolean = true;
  isAddressInvalid: boolean = false;
  isInstruction_gradeValid: boolean = true;
  isInstruction_gradeInvalid: boolean = false;
  isDisability_typeValid: boolean = true;
  isDisability_typeInvalid: boolean = false;
  isDisabilityValid: boolean = true;
  isDisabilityInvalid: boolean = false;
  isWork_conditionValid: boolean = true;
  isWork_conditionInvalid: boolean = false;
  isOccupationValid: boolean = true;
  isOccupationInvalid: boolean = false;

  showSuccessAlert: boolean = false;
  showErrorAlert: boolean = false;
  showEmptyFieldsAlert: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private staffService: StaffService,
    private ubigeoService: UbigeoService
  ) { }

  ngOnInit(): void {
    const staffId = this.route.snapshot.paramMap.get('id');
    if (staffId) {
      this.loadStaff(staffId);
    }
    this.loadUbigeoList(); // Cargar la lista de ubigeos al inicializar el componente
  }

  loadStaff(id: string): void {
    this.staffService.getById(id).subscribe(
      (staff: InstitucionalStaff) => {
        this.editStaff = staff; // Asignar el objeto recibido del servicio a editStaff
      },
      (error) => {
        console.error('Error al cargar el personal', error);
      }
    );
  }

  loadUbigeoList(): void {
    this.ubigeoService.getAllUbigeos().subscribe(
      (ubigeos: any[]) => {
        this.ubigeoList = ubigeos;
      },
      (error) => {
        console.error('Error al cargar los ubigeos', error);
      }
    );
  }

  onSaveChanges(form: NgForm): void {
    console.log('Estado del formulario:', form.valid); // Verifica si el formulario es válido antes de hacer la llamada

    if (this.areRequiredFieldsEmpty()) {
      this.showEmptyFieldsAlert = true;
      this.showSuccessAlert = false;
      this.showErrorAlert = false;
      return;
    }

    if (form.valid) {
      // Continúa con el código para enviar los datos
      const updateObject = {
        ...this.editStaff,
        ubigeo: { id: this.editStaff.ubigeo.id }
      };
      delete updateObject.id_institucional_staff;

      console.log('Datos a enviar:', JSON.stringify(updateObject, null, 2));

      // Llama al servicio para crear o actualizar el personal
      this.staffService.update(this.editStaff.id_institucional_staff!, updateObject).subscribe(
        (response) => {
          console.log('Personal actualizado exitosamente', response);
          this.showSuccessAlert = true;
          this.showErrorAlert = false;
          this.showEmptyFieldsAlert = false;

          // Mostrar la alerta de éxito por 5 segundos antes de redirigir
          setTimeout(() => {
            this.router.navigate(['/staff']); // Redirige a la lista de personal después de la actualización
          }, 3000); // 5000 milisegundos = 5 segundos
        },
        (error) => {
          console.error('Error al actualizar el personal', error);
          this.showSuccessAlert = false;
          this.showErrorAlert = true;
          this.showEmptyFieldsAlert = false;
        }
      );

    } else {
      console.error('El formulario no es válido');
    }
  }

  areRequiredFieldsEmpty(): boolean {
    return !this.editStaff.father_lastname || !this.editStaff.mother_lastname || !this.editStaff.name ||
      !this.editStaff.document_type || !this.editStaff.document_number || !this.editStaff.sex ||
      !this.editStaff.country || !this.editStaff.ubigeo.id || !this.editStaff.email ||
      !this.editStaff.phone || !this.editStaff.civil_status || !this.editStaff.instruction_grade ||
      !this.editStaff.disability || !this.editStaff.work_condition ||
      !this.editStaff.native_language || !this.editStaff.address;
  }

  closeAlert(): void {
    this.showSuccessAlert = false;
    this.showErrorAlert = false;
    this.showEmptyFieldsAlert = false;
  }

  onDocumentTypeChange(): void {
    if (this.editStaff.document_type === 'DNI') {
      this.documentTypeMaxLength = 8;
    } else if (this.editStaff.document_type === 'CNE') {
      this.documentTypeMaxLength = 11;
    }
    this.editStaff.document_number = '';
    this.isInvalid = false;
    this.isValid = false;
  }

  onDocumentNumberInput(): void {
    const docNumber = this.editStaff.document_number;
    if (this.editStaff.document_type === 'DNI' && docNumber.length === 8) {
      this.isValid = true;
      this.isInvalid = false;
    } else if (this.editStaff.document_type === 'CNE' && docNumber.length === 11) {
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
    if (this.editStaff.country) {
      this.isCountryValid = true;
      this.isCountryInvalid = false;
    } else {
      this.isCountryValid = false;
      this.isCountryInvalid = true;
    }
  }

  onUbigeoChange(): void {
    if (this.editStaff.ubigeo) {
      this.isUbigeoValid = true;
      this.isUbigeoInvalid = false;
    } else {
      this.isUbigeoValid = false;
      this.isUbigeoInvalid = true;
    }
  }


  onCivil_statusChange(): void {
    if (this.editStaff.civil_status) {
      this.isCivil_statusValid = true;
      this.isCivil_statusInvalid = false;
    } else {
      this.isCivil_statusValid = false;
      this.isCivil_statusInvalid = true;
    }
  }

  onNative_languageChange(): void {
    if (this.editStaff.native_language) {
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
    this.editStaff.name = this.capitalizeWords(this.editStaff.name);
    if (this.editStaff.name.length > 0) {
      this.isNameValid = true;
      this.isNameInvalid = false;
    } else {
      this.isNameValid = false;
      this.isNameInvalid = true;
    }
  }

  onFather_lastnameInput(): void {
    this.editStaff.father_lastname = this.capitalizeWords(this.editStaff.father_lastname.replace(/\s+/g, ''));
    if (this.editStaff.father_lastname.length > 0) {
      this.isFather_lastnameValid = true;
      this.isFather_lastnameInvalid = false;
    } else {
      this.isFather_lastnameValid = false;
      this.isFather_lastnameInvalid = true;
    }
  }

  onMother_lastnameInput(): void {
    this.editStaff.mother_lastname = this.capitalizeWords(this.editStaff.mother_lastname.replace(/\s+/g, ''));
    if (this.editStaff.mother_lastname.length > 0) {
      this.isMother_lastnameValid = true;
      this.isMother_lastnameInvalid = false;
    } else {
      this.isMother_lastnameValid = false;
      this.isMother_lastnameInvalid = true;
    }
  }

  onSexChange(): void {
    if (this.editStaff.sex) {
      this.isSexValid = true;
      this.isSexInvalid = false;
    } else {
      this.isSexValid = false;
      this.isSexInvalid = true;
    }
  }

  preventInvalidPhoneInput(event: KeyboardEvent): void {
    const firstChar = this.editStaff.phone.charAt(0);
    if (event.key < '0' || event.key > '9') {
      if (event.key !== 'Backspace' && event.key !== 'Delete' && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
        event.preventDefault();
      }
    }
    if (this.editStaff.phone.length === 0 && event.key !== '9') {
      event.preventDefault();
    }
  }

  onPhoneInput(): void {
    const phone = this.editStaff.phone;
    if (phone.length === 9 && phone.charAt(0) === '9') {
      this.isPhoneValid = true;
      this.isPhoneInvalid = false;
    } else {
      this.isPhoneInvalid = true;
      this.isPhoneValid = false;
    }
  }

  onEmailInput(): void {
    const email = this.editStaff.email.trim(); // Obtener el valor del email y quitar espacios al inicio y final

    if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      this.isEmailValid = true;
      this.isEmailInvalid = false;
    } else {
      this.isEmailValid = false;
      this.isEmailInvalid = true;
    }
  }

  onAddressInput(): void {
    const address = this.editStaff.address.trim(); // Obtener el valor de la dirección y quitar espacios al inicio y final

    // Validar la primera letra en mayúscula
    if (address.length > 0) {
      const firstChar = address.charAt(0);
      if (firstChar !== firstChar.toUpperCase()) {
        // Convertir la primera letra a mayúscula si no lo está
        this.editStaff.address = firstChar.toUpperCase() + address.slice(1);
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
    if (this.editStaff.instruction_grade) {
      this.isInstruction_gradeValid = true;
      this.isInstruction_gradeInvalid = false;
    } else {
      this.isInstruction_gradeValid = false;
      this.isInstruction_gradeInvalid = true;
    }
  }

  onDisability_typeChange(): void {
    if (this.editStaff.disability_type) {
      this.isDisability_typeValid = true;
      this.isDisability_typeInvalid = false;
    } else {
      this.isDisability_typeValid = false;
      this.isDisability_typeInvalid = true;
    }
  }

  onDisabilityInput(): void {
    const disability = this.editStaff.disability.trim(); // Obtener el valor de la dirección y quitar espacios al inicio y final

    // Validar la primera letra en mayúscula
    if (disability.length > 0) {
      const firstChar = disability.charAt(0);
      if (firstChar !== firstChar.toUpperCase()) {
        // Convertir la primera letra a mayúscula si no lo está
        this.editStaff.disability = firstChar.toUpperCase() + disability.slice(1);
      }
    }

    // Validar la presencia de @ en la dirección
    if (disability.includes('@')) {
      this.isDisabilityValid = false;
      this.isDisabilityInvalid = true;
    } else {
      this.isDisabilityValid = true;
      this.isDisabilityInvalid = false;
    }
  }

  onWork_conditionChange(): void {
    if (this.editStaff.work_condition) {
      this.isWork_conditionValid = true;
      this.isWork_conditionInvalid = false;
    } else {
      this.isWork_conditionValid = false;
      this.isWork_conditionInvalid = true;
    }
  }

  onOccupationInput(): void {
    const occupation = this.editStaff.occupation.trim(); // Obtener el valor de la dirección y quitar espacios al inicio y final

    // Validar la primera letra en mayúscula
    if (occupation.length > 0) {
      const firstChar = occupation.charAt(0);
      if (firstChar !== firstChar.toUpperCase()) {
        // Convertir la primera letra a mayúscula si no lo está
        this.editStaff.occupation = firstChar.toUpperCase() + occupation.slice(1);
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