import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApisService {
  private baseUrl: string;
  private errorMessage: string = '';

  constructor(private http: HttpClient) {
    this.baseUrl = 'http://localhost:8085/oraclecloud/v1';
  }

  // Obtener todos los trabajadores
  obtenerTrabajadores(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl)
      .pipe(catchError(this.handleError));
  }

  // Obtener trabajadores activos
  obtenerTrabajadoresActivos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/workers/actives`)
      .pipe(catchError(this.handleError));
  }

  // Obtener trabajadores inactivos
  obtenerTrabajadoresInactivos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/workers/inactive`)
      .pipe(catchError(this.handleError));
  }

  // Guardar un nuevo trabajador
  guardarTrabajador(trabajador: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, trabajador)
      .pipe(catchError(this.handleError));
  }

  postData(endpoint: string, data: any): Observable<any> {
    const url = `${this.baseUrl}/${endpoint}`;
    return this.http.post(url, data).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400) {
          this.errorMessage = error.error;
        } else {
          this.errorMessage = "Error en el servidor";
        }
        return throwError(error);
      })
    );
  }

  // Obtener trabajador por ID
  obtenerTrabajadorPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Actualizar un trabajador existente
  actualizarTrabajador(id: number, trabajador: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/workers/update/${id}`, trabajador)
      .pipe(catchError(this.handleError));
  }

  updateData(id: number, data: any): Observable<any> {
    const url = `${this.baseUrl}/workers/update/${id}`;
    return this.http.patch(url, data).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error en la solicitud de actualización:', error);

        if (error.status === 400) {
          this.errorMessage = error.error;
        } else {
          this.errorMessage = 'Error en el servidor';
        }

        return throwError(error);
      })
    );
  }


  // Eliminar un trabajador por ID
  eliminarTrabajador(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Desactivar un trabajador por ID
  desactivarTrabajador(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/workers/inactive/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Activar un trabajador por ID
  activarTrabajador(id: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/workers/active/${id}`, {})
      .pipe(catchError(this.handleError));
  }

  // Manejar errores HTTP
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.status === 400) {
      console.error('Error 400: Cuerpo del error:', error.error);
      errorMessage = 'Error en la solicitud: Datos incorrectos';
    } else if (error.status === 404) {
      errorMessage = 'Recurso no encontrado';
    } else {
      errorMessage = 'Error en el servidor';
    }

    console.error(errorMessage);
    return throwError(errorMessage);
  }
  getErrorMessage(): string {
    return this.errorMessage;
  }

  fetchData(endpoint: string): Observable<any> {
    const url = `${this.baseUrl}/${endpoint}`;
    return this.http.get(url).pipe(
      catchError(this.handleError)
    );
  }

}