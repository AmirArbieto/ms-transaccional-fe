import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './../interfaces/user';
import { formulario } from 'src/app/interfaces/formulario';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUser = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) { }

  getActiveUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUser}/active`);
  }

  postData(user: User): Observable<Object> {
    return this.http.post(this.apiUser, user);
  }

  actualizarUser(id: string, user: User): Observable<Object> {
    return this.http.put(`${this.apiUser}/${id}`, user);
  }

  obtenerUserPorId(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUser}/${id}`);
  }

  eliminarUser(id: string): Observable<Object> {
    // Aquí realizamos el eliminado lógico, cambiando el estado del usuario a inactivo
    return this.http.delete(`${this.apiUser}/${id}`);
  }

  activarUser(id: string): Observable<Object> {
    return this.http.put(`${this.apiUser}/reactivate/${id}`, {});
  }
  restoreUser(id: string): Observable<Object> {
    return this.http.put(`${this.apiUser}/reactivate/${id}`, {});
  }

  deletePermanently(id: string): Observable<Object> {
    return this.http.delete(`${this.apiUser}/fisico/${id}`);
  }

  getInactivos(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUser}/inactive`);
  }

  obtenerUserPorCelular(celular: string): Observable<User> {
    return this.http.get<User>(`${this.apiUser}/buscarPorCelular/${celular}`);
  }
  crearUsuario(user: User): Observable<User> {
    return this.http.post<User>(this.apiUser, user);
  }

  
}
