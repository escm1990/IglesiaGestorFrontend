import { Observable } from 'rxjs';
import { Miembro } from './../models/miembro';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MiembroService {

   //Url obtenida de la variable de enviroments
   miembroUrl = environment.miembroUrl;

   constructor(private httpClient: HttpClient) { }

   public listar() : Observable<Miembro[]>{
     return this.httpClient.get<Miembro[]>(this.miembroUrl+'listar');
   }

   public detalle(id: number): Observable<Miembro> {
     return this.httpClient.get<Miembro>(this.miembroUrl + `detalle/${id}`);
   }

   public guardar(Miembro: Miembro): Observable<any> {
     return this.httpClient.post<any>(this.miembroUrl + 'guardar', Miembro);
   }

   public modificar(id: number, Miembro: Miembro): Observable<any> {
     return this.httpClient.put<any>(this.miembroUrl + `modificar/${id}`, Miembro);
   }

   public eliminar(id: number): Observable<any> {
     return this.httpClient.delete<any>(this.miembroUrl + `eliminar/${id}`);
   }

   public listarIglesia(id_iglesia: number) : Observable<Miembro[]>{
    return this.httpClient.get<Miembro[]>(this.miembroUrl+`listar/iglesia/${id_iglesia}`);
  }

  public listarSexo(id_sexo: string) : Observable<Miembro[]>{
    return this.httpClient.get<Miembro[]>(this.miembroUrl+`listar/sexo/${id_sexo}`);
  }

  public listarTipo(id_tipo: string) : Observable<Miembro[]>{
    return this.httpClient.get<Miembro[]>(this.miembroUrl+`listar/tipo/${id_tipo}`);
  }

  public listarNombre(id_nombre: string) : Observable<Miembro[]>{
    return this.httpClient.get<Miembro[]>(this.miembroUrl+`listar/nombre/${id_nombre}`);
  }

  public listarFechaBautismo(fecha: string) : Observable<Miembro[]>{
    return this.httpClient.get<Miembro[]>(this.miembroUrl+`listar/fechabautismo/${fecha}`);
  }

  public listarFechaConversion(fecha: string) : Observable<Miembro[]>{
    return this.httpClient.get<Miembro[]>(this.miembroUrl+`listar/fechaconversion/${fecha}`);
  }

  public listarFechaNacimiento(fecha: string) : Observable<Miembro[]>{
    return this.httpClient.get<Miembro[]>(this.miembroUrl+`listar/fechanacimiento/${fecha}`);
  }
}
