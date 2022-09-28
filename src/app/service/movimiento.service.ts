import { Observable } from 'rxjs';
import { Movimiento } from './../models/movimiento';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';

const MOVIMIENTO_ID = 'MovimientoId';

@Injectable({
  providedIn: 'root'
})
export class MovimientoService {

  //Url obtenida de la variable de enviroments
  MovimientoUrl = environment.movimientoUrl;

  constructor(private httpClient: HttpClient) { }

  public listar() : Observable<Movimiento[]>{
    return this.httpClient.get<Movimiento[]>(this.MovimientoUrl+'listar');
  }

  public detalle(id: number): Observable<Movimiento> {
    return this.httpClient.get<Movimiento>(this.MovimientoUrl + `detalle/${id}`);
  }

  public guardar(Movimiento: Movimiento): Observable<any> {
    return this.httpClient.post<any>(this.MovimientoUrl + 'guardar', Movimiento);
  }

  public modificar(id: number, Movimiento: Movimiento): Observable<any> {
    return this.httpClient.put<any>(this.MovimientoUrl + `modificar/${id}`, Movimiento);
  }

  public eliminar(id: number): Observable<any> {
    return this.httpClient.delete<any>(this.MovimientoUrl + `eliminar/${id}`);
  }

  public listarIglesia(id_iglesia: number) : Observable<Movimiento[]>{
   return this.httpClient.get<Movimiento[]>(this.MovimientoUrl+`listar/iglesia/${id_iglesia}`);
  }

  public listarCierre(id_cierre: number) : Observable<Movimiento[]>{
    return this.httpClient.get<Movimiento[]>(this.MovimientoUrl+`listar/cierre/${id_cierre}`);
  }

  public setMovimientoId(mId: string): void{
    window.sessionStorage.removeItem(MOVIMIENTO_ID);
    window.sessionStorage.setItem(MOVIMIENTO_ID, mId);
  }

  public getMovimientoId(): string{
    return sessionStorage.getItem(MOVIMIENTO_ID) || '';
  }

}
