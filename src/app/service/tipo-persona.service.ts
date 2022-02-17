import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TipoPersona } from '../models/tipo-persona';


@Injectable({
  providedIn: 'root'
})
export class TipoPersonaService {


  // Url obtenida de la variable de enviroments
  TipoPersonaUrl = environment.tipoPersonaUrl;

  constructor(private httpClient: HttpClient) { }

  public listar(): Observable<TipoPersona[]>{
    return this.httpClient.get<TipoPersona[]>(this.TipoPersonaUrl+'listar');
  }

  public detalle(id: number): Observable<TipoPersona> {
    return this.httpClient.get<TipoPersona>(this.TipoPersonaUrl + `detalle/${id}`);
  }

  public guardar(TipoPersona: TipoPersona): Observable<any> {
    return this.httpClient.post<any>(this.TipoPersonaUrl + 'guardar', TipoPersona);
  }

  public modificar(id: number, TipoPersona: TipoPersona): Observable<any> {
    return this.httpClient.put<any>(this.TipoPersonaUrl + `modificar/${id}`, TipoPersona);
  }

  public eliminar(id: number): Observable<any> {
    return this.httpClient.delete<any>(this.TipoPersonaUrl + `eliminar/${id}`);
  }

  public listarPorIglesia(id: number) : Observable<TipoPersona[]>{
    return this.httpClient.get<TipoPersona[]>(this.TipoPersonaUrl+`listar/iglesia/${id}`);
  }
}
