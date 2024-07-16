import { Component } from '@angular/core';
import { OnInit, ElementRef, ViewChild } from '@angular/core';
import { ContactFormService } from 'src/app/services/formulario.service';
import { Router } from '@angular/router';
import { formulario } from 'src/app/interfaces/formulario';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import Swal from 'sweetalert2';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service'


@Component({
  selector: 'app-formulario-inactivos',
  templateUrl: './formulario-inactivos.component.html',
  styleUrls: ['./formulario-inactivos.component.css']
})
export class FormularioInactivosComponent implements OnInit {
  @ViewChild('table') table!: ElementRef;
  forms: formulario[] = [];
  filteredForms: formulario[] = [];
  filtro: string = '';
  statusFilter: string = '';
  users: User[] = [];
  userMap: { [key: string]: string } = {};

  constructor(private contactFormService: ContactFormService, private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.getForms();
    this.getUsers();
    this.filtro = '';
    this.filterResults();
  }

  getUsers() {
    this.userService.getActiveUsers().subscribe((data: User[]) => {
      this.users = data;
      this.userMap = data.reduce((map: { [key: string]: string }, user) => {
        map[user.id] = user.document_type + ' : ' + user.document_number;
        return map;
      }, {});
    });
  }

  getForms() {
    this.contactFormService.getInactiveContactForms().pipe(
      catchError(error => {
        console.error('Error al obtener datos:', error);
        Swal.fire('Error', 'No se pudieron obtener los datos de los formularios de contacto', 'error');
        return of([]);
      })
    ).subscribe((data: formulario[]) => {
      this.forms = data;
      this.filteredForms = data;
      this.filterResults();
    });
  }

  filterResults() {
    this.filteredForms = this.forms.filter(form => {
      const matchesDescription = form.description.toLowerCase().includes(this.filtro.toLowerCase());
      const matchesStatus = this.statusFilter === '' || form.status === this.statusFilter;
      return matchesDescription && matchesStatus;
    });
  }

  restoreForm(form: formulario): void {
    Swal.fire({
      title: 'Confirmar restauración',
      text: `¿Estás seguro de que deseas restaurar el formulario con descripción: ${form.description}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, restaurar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.contactFormService.reactivateContactForm(form.id).subscribe(() => {
          this.getForms();
          Swal.fire('Formulario restaurado', 'El formulario ha sido restaurado con éxito', 'success');
        });
      }
    });
  }

  deletePermanently(form: formulario): void {
    Swal.fire({
      title: 'Confirmar eliminación permanente',
      text: `¿Estás seguro de que deseas eliminar permanentemente el formulario con descripción: ${form.description}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar permanentemente',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.contactFormService.deleteContactFormPhysically(form.id).subscribe(() => {
          this.getForms();
          Swal.fire('Formulario eliminado', 'El formulario ha sido eliminado permanentemente', 'success');
        });
      }
    });
  }


  exportToCSV() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filteredForms);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Forms');
    XLSX.writeFile(wb, 'Forms.csv');
  }

  exportToExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filteredForms);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Forms');
    XLSX.writeFile(wb, 'Forms.xlsx');
  }

  exportToPDF() {
    const doc = new jsPDF();
    const col = ['User ID', 'Descripción', 'Programa de Estudio', 'Estado'];
    const rows = this.filteredForms.map(form => [
      form.userId,
      form.description,
      form.studyProgramId,
      form.status
    ]);

    (doc as any).autoTable({
      head: [col],
      body: rows
    });

    doc.save('Forms.pdf');
  }
}