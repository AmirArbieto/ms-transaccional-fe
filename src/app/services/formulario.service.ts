import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { formulario } from './../interfaces/formulario';

@Injectable({
  providedIn: 'root'
})
export class ContactFormService {
  private apiContactForm = 'http://localhost:8080/api/formulario';

  constructor(private http: HttpClient) { }

  getAllContactForms(): Observable<formulario[]> {
    return this.http.get<formulario[]>(`${this.apiContactForm}/active`);
  }

  getContactFormById(id: string): Observable<formulario> {
    return this.http.get<formulario>(`${this.apiContactForm}/${id}`);
  }

  createContactForm(contactFormDTO: formulario): Observable<formulario> {
    return this.http.post<formulario>(this.apiContactForm, contactFormDTO);
  }

  updateContactForm(id: string, contactFormDTO: formulario): Observable<formulario> {
    return this.http.put<formulario>(`${this.apiContactForm}/${id}`, contactFormDTO);
  }

  reactivateContactForm(id: string): Observable<formulario> {
    return this.http.put<formulario>(`${this.apiContactForm}/reactivate/${id}`, {});
  }

  deleteContactForm(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiContactForm}/${id}`);
  }

  deleteContactFormPhysically(id: string): Observable<string> {
    return this.http.delete<string>(`${this.apiContactForm}/fisico/${id}`);
  }

  getActiveContactForms(): Observable<formulario[]> {
    return this.http.get<formulario[]>(`${this.apiContactForm}/active`);
  }

  getInactiveContactForms(): Observable<formulario[]> {
    return this.http.get<formulario[]>(`${this.apiContactForm}/inactive`);
  }
  crearFormulario(formulario: formulario): Observable<formulario> {
    return this.http.post<formulario>(this.apiContactForm, formulario);
  }
}
