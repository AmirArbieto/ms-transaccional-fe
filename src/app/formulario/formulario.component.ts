import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ContactFormService } from '../services/formulario.service';
import { Router } from '@angular/router';
import { formulario } from './../interfaces/formulario';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import Swal from 'sweetalert2';
import { UserService } from '../services/user.service';
import { User } from './../interfaces/user';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {
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
    this.contactFormService.getAllContactForms().pipe(
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

  updateForm(form: formulario): void {
    this.router.navigate(['/formulario/actualizar', form.id]);
  }

  deleteForm(form: formulario): void {
    Swal.fire({
      title: 'Confirmar eliminación',
      text: `¿Estás seguro de que deseas eliminar el formulario con descripción: ${form.description}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.contactFormService.deleteContactForm(form.id).subscribe(() => {
          this.getForms();
          Swal.fire('Formulario eliminado', 'El formulario ha sido eliminado con éxito', 'success');
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



