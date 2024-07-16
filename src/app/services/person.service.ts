import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Person } from '../interfaces/person';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  private apiPersons = 'http://localhost:8085/oraclecloud/v1/persons';
    constructor(private http:HttpClient) { }

    //Listar
    getData(): Observable<Person[]>{
        return this.http.get<Person[]>(`${this.apiPersons}/active`);  
     }

     postData(person: Person) : Observable<Object>{
        return this.http.post(this.apiPersons, person)
     }

     actualizarPerson(id:number, person:Person) : Observable<Object>{
        return this.http.put(`${this.apiPersons}/${id}`, person);
     }

     obtenerPersonPorId(id:number):Observable<Person>{
        return this.http.get<Person>(`${this.apiPersons}/${id}`);
      }
    
      eliminarPerson(id:number):Observable<Object>{
        return this.http.delete(`${this.apiPersons}/inactive/${id}`);
      }
    
      activarPerson(id:number):Observable<Object>{
        return this.http.put(`${this.apiPersons}/active/${id}`, id);
      }
    
      getInactivos(): Observable<Person[]>{
        return this.http.get<Person[]>(`${this.apiPersons}/inactive`);
      }
      getListado(typeDocuments: string, filtro: string): Observable<Person[]> {
        const url = `${this.apiPersons}/listado?typeDocuments=${typeDocuments}&filtro=${filtro}`;
        return this.http.get<Person[]>(url);
      }
}

