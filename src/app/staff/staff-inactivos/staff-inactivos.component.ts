import { Component, OnInit } from '@angular/core';
import { InstitucionalStaff } from 'src/app/interfaces/InstitucionalStaff';
import { StaffService } from 'src/app/services/institucional-staff.service';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';


@Component({
  selector: 'app-staff-inactivos',
  templateUrl: './staff-inactivos.component.html',
  styleUrls: ['./staff-inactivos.component.css']
})
export class StaffInactivosComponent implements OnInit {
  inactiveStaffList: InstitucionalStaff[] = [];
  filteredStaffList: InstitucionalStaff[] = [];
  searchTerm: string = '';
  selectedDocumentType: string = '';
  searchMessage: string | null = null;
  isFirstCharacterValid: boolean = false;
  showActivateAlert: boolean = false;

  constructor(private staffService: StaffService) {}

  ngOnInit(): void {
    this.loadInactiveStaffList();
  }

  loadInactiveStaffList(): void {
    this.staffService.getAllInactive().subscribe(
      (data) => {
        this.inactiveStaffList = data;
        this.filteredStaffList = data;
      },
      (error) => {
        console.error('Error fetching inactive staff list', error);
      }
    );
  }

  activateStaff(id: string): void {
    this.staffService.activate(id).subscribe(
      (response) => {
        console.log('Staff activated', response);
        this.loadInactiveStaffList(); // Vuelve a cargar la lista inactiva para reflejar el cambio
        this.showActivateAlert = true; // Mostrar la alerta de activación
        this.hideActivateAlert(); // Ocultar la alerta después de 3 segundos
      },
      (error) => {
        console.error('Error activating staff', error);
      }
    );
  }

  hideActivateAlert(): void {
    setTimeout(() => {
      this.showActivateAlert = false;
    }, 3000); // 3000 milisegundos (3 segundos)
  }
  

  filterStaff(): void {
    this.filteredStaffList = this.inactiveStaffList.filter(staff => {
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
    XLSX.utils.book_append_sheet(wb, ws, 'Personal_Inactivos');
    XLSX.writeFile(wb, 'Personal_Inactivos.csv');
  }

  exportToExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filteredStaffList);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Personal_Inactivos');
    XLSX.writeFile(wb, 'Personal_Inactivos.xlsx');
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
