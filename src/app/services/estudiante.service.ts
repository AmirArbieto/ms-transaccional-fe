import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Estudiante } from '../interfaces/estudiante';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {

  private apiStudents = 'http://localhost:8085/oraclecloud/v1/students'

  constructor(private http:HttpClient) { }

  //Listar
  getData(): Observable<Estudiante[]>{
    return this.http.get<Estudiante[]>(`${this.apiStudents}/active`);
  }

  postData(estudiante: Estudiante) : Observable<Object>{
    return this.http.post(this.apiStudents, estudiante)
  }

  actualizarEstudiante(id:number,estudiante:Estudiante) : Observable<Object>{
    return this.http.put(`${this.apiStudents}/${id}`, estudiante);
  }

  obtenerEstudiantePorId(id:number):Observable<Estudiante>{
    return this.http.get<Estudiante>(`${this.apiStudents}/${id}`);
  }

  eliminarEstudiante(id:number):Observable<Object>{
    return this.http.delete(`${this.apiStudents}/inactive/${id}`);
  }

  activarEstudiante(id:number):Observable<Object>{
    return this.http.put(`${this.apiStudents}/active/${id}`, id);
  }

  getInactivos(): Observable<Estudiante[]>{
    return this.http.get<Estudiante[]>(`${this.apiStudents}/inactive`);
  }

}
