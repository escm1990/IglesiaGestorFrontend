import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadFilesService {

  //Url obtenida de la variable de enviroments
  baseUrl = environment.baseUrl;

  //Inyeccion de HttpClient
  constructor(private http: HttpClient) { }

  //Metodo que envia los archivos al endpoint /upload
  upload(file: File): Observable<HttpEvent<any>>{
    const formData: FormData = new FormData();
    formData.append('files', file);

    const req = new HttpRequest('POST', `${this.baseUrl}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }

  //Metodo para Obtener los archivos
  getFiles(){
    return this.http.get(`${this.baseUrl}/files`);
  }

  //Metodo para borrar los archivos
  deleteFile(filename: string){
    return this.http.get(`${this.baseUrl}/delete/${filename}`);
  }

  //Metodo para borrar los archivos
  getFile(filename: String){
    return this.http.get(`${this.baseUrl}/files/${filename}`);
  }


}
