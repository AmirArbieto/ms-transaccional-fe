import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentApafaService {

  private baseUrl: string
  private errorMessage: string = ''

  constructor(private http:HttpClient) { 
    this.baseUrl = 'http://localhost:8085/oraclecloud/v1';
  }

  getErrorMessage(): string{
    return this.errorMessage
  }

  fetchData(endpoint: string): Observable<any> {
    const url = `${this.baseUrl}/${endpoint}`;
    return this.http.get(url).pipe(
      catchError(this.handleError)
    );
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

  updateData(endpoint: string, data: any): Observable<any> {
    const url = `${this.baseUrl}/${endpoint}`;
    return this.http.put(url, data).pipe(
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

  deleteData(endpoint: string): Observable<any> {
    const url = `${this.baseUrl}/${endpoint}`;
    return this.http.delete(url, {}).pipe(
      catchError(this.handleError)
    );
  }

  reactiveData(endpoint: string): Observable<any> {
    const url = `${this.baseUrl}/${endpoint}`;
    return this.http.put(url, {}).pipe(
      catchError(this.handleError)
    );
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.status === 404) {
      errorMessage = 'Recurso no encontrado';
    } else {
      errorMessage = 'Error en el servidor';
    }

    console.error(errorMessage);

    return throwError(errorMessage);
  }

}
