import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-inactivos',
  templateUrl: './user-inactivos.component.html',
  styleUrls: ['./user-inactivos.component.css']
})
export class UserInactivosComponent implements OnInit {
  @ViewChild('table') table!: ElementRef;
  users: User[] = [];
  filteredUsers: User[] = [];
  filtro: string = '';
  searchDocument: string = '';
  searchDocumentType: string = '';
  inactiveUsers: User[] = [];


  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.obtenerUsersInactivos();
    this.filtro = ''; // Inicializa el filtro
    this.filterResults(); // Filtra inicialmente los resultados
  }

  obtenerUsersInactivos() {
    this.userService.getInactivos().pipe(
      catchError(error => {
        console.error('Error al obtener datos:', error);
        Swal.fire('Error', 'No se pudieron obtener los datos de los usuarios inactivos', 'error');
        return of([]);
      })
    ).subscribe((data: User[]) => {
      this.users = data;
      this.filteredUsers = data; // Inicializa filteredUsers con todos los datos
      this.filterResults(); // Filtra inicialmente los resultados
    });
  }

  restoreUser(user: User): void {
    this.userService.restoreUser(user.id).subscribe(() => {
      this.obtenerUsersInactivos(); // Refresca la lista de usuarios inactivos
      Swal.fire('Usuario restaurado', 'El usuario ha sido restaurado con éxito', 'success');
    });
  }

  deletePermanently(user: User): void {
    Swal.fire({
      title: 'Confirmar eliminación definitiva',
      text: `¿Estás seguro de que deseas eliminar definitivamente a ${user.name}? Esta acción no se puede deshacer y eliminará permanentemente el usuario.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar definitivamente',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deletePermanently(user.id).subscribe(() => {
          // Elimina el usuario de la lista inactiveUsers
          this.inactiveUsers = this.inactiveUsers.filter(u => u.id !== user.id);
          Swal.fire('Usuario eliminado definitivamente', 'El usuario ha sido eliminado definitivamente con éxito', 'success');
        });
      }
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

  exportToCSV() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filteredUsers);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    XLSX.writeFile(wb, 'UsuariosInactivos.csv');
  }

  exportToExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filteredUsers);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    XLSX.writeFile(wb, 'UsuariosInactivos.xlsx');
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

    doc.save('UsuariosInactivos.pdf');
  }
}

