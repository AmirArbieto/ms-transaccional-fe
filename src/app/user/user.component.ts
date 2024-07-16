import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { UserService } from './../services/user.service';
import { Router } from '@angular/router';
import { User } from './../interfaces/user';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  @ViewChild('table') table!: ElementRef;
  users: User[] = [];
  filteredUsers: User[] = [];
  filtro: string = '';
  searchDocument: string = '';
  searchDocumentType: string = '';

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.obtenerUsers();
    this.filtro = ''; // Inicializa el filtro
    this.filterResults(); // Filtra inicialmente los resultados
  }

  obtenerUsers() {
    this.userService.getActiveUsers().pipe(
      catchError(error => {
        console.error('Error al obtener datos:', error);
        Swal.fire('Error', 'No se pudieron obtener los datos de los usuarios', 'error');
        return of([]);
      })
    ).subscribe((data: User[]) => {
      this.users = data;
      this.filteredUsers = data; // Inicializa filteredUsers con todos los datos
      this.filterResults(); // Filtra inicialmente los resultados
    });
  }

  filterResults() {
    this.filteredUsers = this.users.filter(user => {
      const matchesName = user.name.toLowerCase().includes(this.filtro.toLowerCase()) ||
        user.lastname_paternal.toLowerCase().includes(this.filtro.toLowerCase()) ||
        user.lastname_maternal.toLowerCase().includes(this.filtro.toLowerCase());
      const matchesDocument = user.document_number.includes(this.searchDocument) &&
        (this.searchDocumentType === '' || user.document_type === this.searchDocumentType);
      return matchesName && matchesDocument;
    });
  }

  updateUser(user: User): void {
    this.router.navigate(['/user/actualizar', user.id]);
  }

  deleteUser(user: User): void {
    Swal.fire({
      title: 'Confirmar eliminación',
      text: `¿Estás seguro de que deseas eliminar a ${user.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.eliminarUser(user.id).subscribe(() => {
          this.obtenerUsers(); // Refresca la lista de usuarios
          Swal.fire('Usuario eliminado', 'El usuario ha sido eliminado con éxito', 'success');
        });
      }
    });
  }




  exportToCSV() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filteredUsers);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    XLSX.writeFile(wb, 'Users.csv');
  }

  exportToExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filteredUsers);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    XLSX.writeFile(wb, 'Users.xlsx');
  }

  exportToPDF() {
    const doc = new jsPDF();
    const col = ['Nombre', 'Apellido Paterno', 'Apellido Materno', 'Tipo de Documento', 'Número de Documento', 'Correo Electrónico', 'Celular', 'Celular Opcional', 'Estado'];
    const rows = this.filteredUsers.map(user => [
      user.name,
      user.lastname_paternal,
      user.lastname_maternal,
      user.document_type,
      user.document_number,
      user.email,
      user.phone,
      user.phone_optional,
      user.status
    ]);

    (doc as any).autoTable({
      head: [col],
      body: rows
    });

    doc.save('Users.pdf');
  }
}
