import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Iglesia } from '../models/iglesia';

@Injectable({
  providedIn: 'root'
})
export class IglesiaService {

  iglesiaUrl = 'http://localhost:9090/api/iglesia/';

  constructor(private httpClient: HttpClient) { }

  public listar() : Observable<Iglesia[]>{
    return this.httpClient.get<Iglesia[]>(this.iglesiaUrl+'listar');
  }

  public detalle(id: number): Observable<Iglesia> {
    return this.httpClient.get<Iglesia>(this.iglesiaUrl + `detalle/${id}`);
  }

  public guardar(iglesia: Iglesia): Observable<any> {
    return this.httpClient.post<any>(this.iglesiaUrl + 'guardar', iglesia);
  }

  public modificar(id: number, iglesia: Iglesia): Observable<any> {
    return this.httpClient.put<any>(this.iglesiaUrl + `modificar/${id}`, iglesia);
  }

  public eliminar(id: number): Observable<any> {
    return this.httpClient.delete<any>(this.iglesiaUrl + `eliminar/${id}`);
  }

}
