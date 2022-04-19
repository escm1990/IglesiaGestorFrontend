import { HttpClient } from '@angular/common/http';
import { TipoEvento } from './../models/tipo-evento';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoEventoService {

  //Url obtenida de la variable de enviroments
  TipoEventoUrl = environment.tipoEventoUrl;

  constructor(private httpClient: HttpClient) { }

  public listar() : Observable<TipoEvento[]>{
    return this.httpClient.get<TipoEvento[]>(this.TipoEventoUrl+'listar');
  }

  public detalle(id: number): Observable<TipoEvento> {
    return this.httpClient.get<TipoEvento>(this.TipoEventoUrl + `detalle/${id}`);
  }

  public guardar(TipoEvento: TipoEvento): Observable<any> {
    return this.httpClient.post<any>(this.TipoEventoUrl + 'guardar', TipoEvento);
  }

  public modificar(id: number, TipoEvento: TipoEvento): Observable<any> {
    return this.httpClient.put<any>(this.TipoEventoUrl + `modificar/${id}`, TipoEvento);
  }

  public eliminar(id: number): Observable<any> {
    return this.httpClient.delete<any>(this.TipoEventoUrl + `eliminar/${id}`);
  }

}
