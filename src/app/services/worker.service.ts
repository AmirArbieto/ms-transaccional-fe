import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Person } from '../interfaces/person';
import { MiTrabajadorPersonalizado as Worker } from 'src/app/interfaces/workerInterfas';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkerService {

  private apiWorkers = 'http://localhost:8085/oraclecloud/v1/workers';
    constructor(private http:HttpClient) { }

    //Listar
    getData(sort = 'id,desc'): Observable<Worker[]> {
      const params = new HttpParams().set('sort', sort);
      return this.http.get<Worker[]>(`${this.apiWorkers}/list_actives`, { params });
    }

    postData(worker: Worker) : Observable<Object>{
      return this.http.post(this.apiWorkers, worker)
   }

     actualizarWorker(id:number, worker:Worker) : Observable<Object>{
        return this.http.put(`${this.apiWorkers}/${id}`, worker);
     }

     obtenerWorkerPorId(id:number):Observable<Worker>{
        return this.http.get<Worker>(`${this.apiWorkers}/${id}`);
      }
    
      eliminarPerson(id:number):Observable<Object>{
        return this.http.delete(`${this.apiWorkers}/inactive/${id}`);
      }
    
      activarWorker(id:number):Observable<Object>{
        return this.http.put(`${this.apiWorkers}/active/${id}`, id);
      }
    
      getInactivos(): Observable<Worker[]>{
        return this.http.get<Worker[]>(`${this.apiWorkers}/inactive`);
      }

      getWorkerDetails(workerId: number): Observable<Worker> {
        return this.http.get<Worker>(`${this.apiWorkers}/${workerId}`);
      }
}

