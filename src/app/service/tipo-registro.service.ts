import { Observable } from 'rxjs';
import { TipoRegistro } from './../models/tipo-registro';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TipoRegistroService {

  //Url obtenida de la variable de enviroments
  tipoRegistroMovimientoUrl = environment.tipoRegistroMovimientoUrl;

  constructor(private httpClient: HttpClient) { }

  public listar(): Observable<TipoRegistro[]>{
    return this.httpClient.get<TipoRegistro[]>(this.tipoRegistroMovimientoUrl+'listar');
  }

  public detalle(id: number): Observable<TipoRegistro> {
    return this.httpClient.get<TipoRegistro>(this.tipoRegistroMovimientoUrl + `detalle/${id}`);
  }

  public guardar(TipoRegistro: TipoRegistro): Observable<any> {
    return this.httpClient.post<any>(this.tipoRegistroMovimientoUrl + 'guardar', TipoRegistro);
  }

  public modificar(id: number, TipoRegistro: TipoRegistro): Observable<any> {
    return this.httpClient.put<any>(this.tipoRegistroMovimientoUrl + `modificar/${id}`, TipoRegistro);
  }

  public eliminar(id: number): Observable<any> {
    return this.httpClient.delete<any>(this.tipoRegistroMovimientoUrl + `eliminar/${id}`);
  }

}
