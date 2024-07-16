import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ubigeoLista } from '../interfaces/ubigeoLista';


@Injectable({
  providedIn: 'root'
})
export class UbigeoService {

  private apiBaseUrl = 'http://localhost:8085/ubigeo'

  
  constructor(private http: HttpClient) { }

  // Obtener todos los empleados
  getAllUbigeos(): Observable<ubigeoLista[]> {
    return this.http.get<ubigeoLista[]>(`${this.apiBaseUrl}/list`);
  }
}
