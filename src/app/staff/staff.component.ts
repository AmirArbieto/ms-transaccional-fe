import { Component, OnInit } from '@angular/core';
import { InstitucionalStaff } from '../interfaces/InstitucionalStaff';
import { StaffService } from '../services/institucional-staff.service';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { Page } from '../interfaces/page';


@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css']
})
export class StaffComponent implements OnInit {
  staffList: InstitucionalStaff[] = [];
  filteredStaffList: InstitucionalStaff[] = [];
  searchTerm: string = '';
  selectedDocumentType: string = '';
  searchMessage: string | null = null;
  isFirstCharacterValid: boolean = false;
  showAlert: boolean = false;

//Variables para paginacion
  totalElements: number = 0;
  page: number = 0;
  size: number = 10;

  constructor(private staffService: StaffService) {}

  ngOnInit(): void {
    this.loadActiveStaffList();
  }

  showDatas = false;
  selectedStaff: any = null;

  showStaffDetails(staff: any) {
    if (this.selectedStaff === staff && this.showDatas) {
      // Si el mismo staff está seleccionado y el div está visible, ocultarlo
      this.showDatas = false;
      this.selectedStaff = null;
    } else {
      // De lo contrario, mostrar los detalles del staff seleccionado
      this.selectedStaff = staff;
      this.showDatas = true;
    }
  }

  closeAlert() {
    this.showDatas = false;
    this.selectedStaff = null;
  }

  changePage(event: number){
    console.log(event);
    const page = event - 1;
    this.loadActiveStaffList(page,this.size);
  }

  changeSize(){
    this.loadActiveStaffList(this.page,this.size);
  }

  loadActiveStaffList(page : number = 0, size : number = 10): void {
    this.staffService.getAllActive(page,size).subscribe(
      (data) => {
        this.setDataSource(data);
        console.log(data);
      },
      (error) => {
        console.error('Error fetching active staff list', error);
      }
    );
  }

  setDataSource(page: Page<InstitucionalStaff>){
    this.totalElements = page.totalElements;
    this.staffList = page.content;
    this.filteredStaffList = page.content;
  }

  deactivateStaff(id: string): void {
    this.staffService.deactivate(id).subscribe(
      (response) => {
        console.log('Staff deactivated', response);
        this.loadActiveStaffList();
        this.showAlert = true;
        this.hideAlert();
      },
      (error) => {
        console.error('Error deactivating staff', error);
      }
    );
  }  

  hideAlert(): void {
    setTimeout(() => {
      this.showAlert = false;
    }, 3000); // 3000 milisegundos (3 segundos)
  }
  

  filterStaff(): void {
    this.filteredStaffList = this.staffList.filter(staff => {
      const matchesSearchTerm = `${staff.name} ${staff.father_lastname} ${staff.mother_lastname} ${staff.document_number} ${staff.email}`
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase());

      const matchesDocumentType = !this.selectedDocumentType || staff.document_type === this.selectedDocumentType;

      return matchesSearchTerm && matchesDocumentType;
    });
  }

  onDocumentTypeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedDocumentType = selectElement.value;
    this.searchTerm = ''; // Limpiar el input de búsqueda
    this.isFirstCharacterValid = false;
    this.searchMessage = null;

    // Limpiar el contenido del input
    const searchInputElement = document.getElementById('searchInput') as HTMLInputElement;
    if (searchInputElement) {
      searchInputElement.value = '';
    }

    this.filterStaff();
  }

  onSearchInput(): void {
    const firstChar = this.searchTerm.charAt(0);
    
    // Limpiar la selección del tipo de documento si se empieza a escribir en el campo de búsqueda
    if (firstChar.match(/[a-zA-Z]/) || firstChar.match(/[0-9]/)) {
      this.selectedDocumentType = ''; // Limpiar la selección del desplegable
    }
  
    if (firstChar.match(/[a-zA-Z]/)) {
      this.searchMessage = 'Se está buscando por Nombre / Email';
      this.isFirstCharacterValid = true;
      this.searchTerm = this.searchTerm.replace(/[^a-zA-Z\s@.]/g, ''); // Permitir letras, espacios, @ y .
    } else if (firstChar.match(/[0-9]/)) {
      this.searchMessage = 'Se está buscando por número de documento';
      this.isFirstCharacterValid = true;
      this.searchTerm = this.searchTerm.replace(/[^0-9]/g, ''); // Solo permite números
    } else {
      this.searchMessage = null;
      this.isFirstCharacterValid = false;
      this.searchTerm = ''; // Limpiar el término de búsqueda si no hay caracteres válidos
    }
  
    this.filterStaff();
  }
  
  

  preventInvalidInput(event: KeyboardEvent): void {
    const firstChar = this.searchTerm.charAt(0);
    const key = event.key;
  
    if (firstChar.match(/[a-zA-Z]/)) {
      // Permitir solo letras, espacios, @ y .
      if (!key.match(/[a-zA-Z\s@.]/) && key !== 'Backspace' && key !== 'Delete') {
        event.preventDefault();
      }
    } else if (firstChar.match(/[0-9]/)) {
      // Permitir solo números
      if (!key.match(/[0-9]/) && key !== 'Backspace' && key !== 'Delete') {
        event.preventDefault();
      }
    }
  }
  
  exportToCSV() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filteredStaffList);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Personal');
    XLSX.writeFile(wb, 'Personal.csv');
  }

  exportToExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filteredStaffList);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Personal');
    XLSX.writeFile(wb, 'Personal.xlsx');
  }

  exportToPDF() {
    const doc = new jsPDF();
    const col = ['Apellido paterno', 'Apellido materno', 'Nombre', 'N° Documento', 'Sexo','Email','Telefono', 'Estado Civil', 'Grado', 'Pais', 'Idioma', 'Direccion'];
    const rows = this.filteredStaffList.map(per => [
      per.father_lastname,
      per.mother_lastname,
      per.name,
      per.document_number,
      per.sex,
      per.email,
      per.phone,
      per.civil_status,
      per.instruction_grade,
      per.country,
      per.native_language,
      per.address,
    ]);

    (doc as any).autoTable({
      head: [col],
      body: rows
    });

    doc.save('Personal.pdf');
  }
}
