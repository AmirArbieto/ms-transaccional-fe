import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { InstitucionalStaff } from './../interfaces/InstitucionalStaff';
import { Page } from '../interfaces/page';

@Injectable({
  providedIn: 'root'
})
export class StaffService {

  private apiBaseUrl = 'https://vigilant-waddle-p46rwv5v5xvcrgq7-8081.app.github.dev/institucional-staff'

  
  constructor(private http: HttpClient) { }

  // Obtener todos los empleados
  getAll(): Observable<InstitucionalStaff[]> {
    return this.http.get<InstitucionalStaff[]>(`${this.apiBaseUrl}/list`);
  }

  // Método para buscar empleados por nombre y tipo de documento
search(searchTerm: string, documentType: string): Observable<InstitucionalStaff[]> {
  let params = new HttpParams();
  if (searchTerm) {
    params = params.set('searchTerm', searchTerm);
  }
  if (documentType) {
    params = params.set('documentType', documentType);
  }

  return this.http.get<InstitucionalStaff[]>(`${this.apiBaseUrl}/search`, { params });
}

  // Crear un nuevo empleado
  create(staff: InstitucionalStaff): Observable<InstitucionalStaff> {
    return this.http.post<InstitucionalStaff>(`${this.apiBaseUrl}/create`, staff);
  }

  update(id: string, staff: InstitucionalStaff): Observable<InstitucionalStaff> {
    return this.http.put<InstitucionalStaff>(`${this.apiBaseUrl}/update/${id}`, staff)
      .pipe(
        catchError(error => {
          console.error('Error en la solicitud PUT', error);
          return throwError(error);
        })
      );
  }

  // Activar un empleado
  activate(id: string): Observable<InstitucionalStaff> {
    return this.http.put<InstitucionalStaff>(`${this.apiBaseUrl}/activate/${id}`, {});
  }

  // Desactivar un empleado
  deactivate(id: string): Observable<InstitucionalStaff> {
    return this.http.put<InstitucionalStaff>(`${this.apiBaseUrl}/deactivate/${id}`, {});
  }

  // Obtener un empleado por ID
  getById(id: string): Observable<InstitucionalStaff> {
    return this.http.get<InstitucionalStaff>(`${this.apiBaseUrl}/get/${id}`);
  }

  // Obtener todos los empleados activos
  getAllActive(page : number = 0, size : number = 10): Observable<Page<InstitucionalStaff>> {
    const options = {
      params: {
        page,size
      }
    }
    return this.http.get<Page<InstitucionalStaff>>(`${this.apiBaseUrl}/list/active`, options);
  }

  // Obtener todos los empleados inactivos
  getAllInactive(): Observable<InstitucionalStaff[]> {
    return this.http.get<InstitucionalStaff[]>(`${this.apiBaseUrl}/list/inactive`);
  }

}
