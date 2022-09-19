import { Observable } from 'rxjs';
import { Evento } from './../models/evento';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventoService {

  //Url obtenida de la variable de enviroments
  EventoUrl = environment.eventoUrl;

  constructor(private httpClient: HttpClient) { }

  public listar() : Observable<Evento[]>{
    return this.httpClient.get<Evento[]>(this.EventoUrl+'listar');
  }

  public detalle(id: number): Observable<Evento> {
    return this.httpClient.get<Evento>(this.EventoUrl + `detalle/${id}`);
  }

  public guardar(Evento: Evento): Observable<any> {
    return this.httpClient.post<any>(this.EventoUrl + 'guardar', Evento);
  }

  public modificar(id: number, Evento: Evento): Observable<any> {
    return this.httpClient.put<any>(this.EventoUrl + `modificar/${id}`, Evento);
  }

  public eliminar(id: number): Observable<any> {
    return this.httpClient.delete<any>(this.EventoUrl + `eliminar/${id}`);
  }

  public listarIglesia(id_iglesia: number) : Observable<Evento[]>{
   return this.httpClient.get<Evento[]>(this.EventoUrl+`listar/iglesia/${id_iglesia}`);
 }

}
