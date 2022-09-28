import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MovimientoDetalleArray } from './../models/movimiento-detalle-array';
import { Injectable } from '@angular/core';
import { MovimientoDetalle } from '../models/movimiento-detalle';

@Injectable({
  providedIn: 'root'
})
export class MovimientoDetalleService {

  //Url obtenida de la variable de enviroments
  movimientoDetalleUrl = environment.movimientoDetalleUrl;

  constructor(private httpClient: HttpClient) { }

  public listar() : Observable<MovimientoDetalle[]>{
    return this.httpClient.get<MovimientoDetalle[]>(this.movimientoDetalleUrl+'listar');
  }

  public detalle(id: number): Observable<MovimientoDetalle> {
    return this.httpClient.get<MovimientoDetalle>(this.movimientoDetalleUrl + `detalle/${id}`);
  }

  public guardar(Movimiento: MovimientoDetalle): Observable<any> {
    return this.httpClient.post<any>(this.movimientoDetalleUrl + 'guardar', Movimiento);
  }

  public modificar(id: number, Movimiento: MovimientoDetalle): Observable<any> {
    return this.httpClient.put<any>(this.movimientoDetalleUrl + `modificar/${id}`, Movimiento);
  }

  public eliminar(id: number): Observable<any> {
    return this.httpClient.delete<any>(this.movimientoDetalleUrl + `eliminar/${id}`);
  }

  public listarTipo(id_tipo: number) : Observable<MovimientoDetalle[]>{
   return this.httpClient.get<MovimientoDetalle[]>(this.movimientoDetalleUrl+`listar/tipo/${id_tipo}`);
  }

  public listarMovimiento(id_movimiento: number) : Observable<MovimientoDetalle[]>{
    return this.httpClient.get<MovimientoDetalle[]>(this.movimientoDetalleUrl+`listar/movimiento/${id_movimiento}`);
  }

  public listarEstado(id_estado: string) : Observable<MovimientoDetalle[]>{
    return this.httpClient.get<MovimientoDetalle[]>(this.movimientoDetalleUrl+`listar/estado/${id_estado}`);
  }

  public guardarCargaExcel(arreglo: MovimientoDetalleArray) : Observable<any> {
    return this.httpClient.post<any>(this.movimientoDetalleUrl + 'guardar/excel', arreglo);
  }
}
