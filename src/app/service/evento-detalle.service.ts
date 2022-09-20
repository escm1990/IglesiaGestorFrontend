import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { EventoDetalle } from '../models/evento-detalle';

@Injectable({
  providedIn: 'root'
})
export class EventoDetalleService {

  //Url obtenida de la variable de enviroments
  EventoDetalleUrl = environment.eventoDetalleUrl;

  constructor(private httpClient: HttpClient) { }

  public listar() : Observable<EventoDetalle[]>{
    return this.httpClient.get<EventoDetalle[]>(this.EventoDetalleUrl+'listar');
  }

  public detalle(id: number): Observable<EventoDetalle> {
    return this.httpClient.get<EventoDetalle>(this.EventoDetalleUrl + `detalle/${id}`);
  }

  public guardar(eventoDetalle: EventoDetalle): Observable<any> {
    return this.httpClient.post<any>(this.EventoDetalleUrl + 'guardar', eventoDetalle);
  }

  public modificar(id: number, eventoDetalle: EventoDetalle): Observable<any> {
    return this.httpClient.put<any>(this.EventoDetalleUrl + `modificar/${id}`, eventoDetalle);
  }

  public eliminar(id: number): Observable<any> {
    return this.httpClient.delete<any>(this.EventoDetalleUrl + `eliminar/${id}`);
  }

  public listarEvento(id_evento: number) : Observable<EventoDetalle[]>{
   return this.httpClient.get<EventoDetalle[]>(this.EventoDetalleUrl+`listar/evento/${id_evento}`);
 }
}
