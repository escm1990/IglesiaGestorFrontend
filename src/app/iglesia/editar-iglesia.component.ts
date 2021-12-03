import { TokenService } from './../service/token.service';
import { environment } from './../../environments/environment';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { UploadFilesService } from './../service/upload-files.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Iglesia } from './../models/iglesia';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { IglesiaService } from './../service/iglesia.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import * as data from '../../assets/paises.json';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';


export class PaisesTel {
  name_en: string;
  name_es: string;
  dial_code: string;
  code: string;
}

@Component({
  selector: 'app-editar-iglesia',
  templateUrl: './editar-iglesia.component.html',
  styleUrls: ['./editar-iglesia.component.scss']
})
export class EditarIglesiaComponent implements OnInit {

  iglesia: Iglesia;
  formIglesia: FormGroup;

  //Lista de archivos seleccionados
  selectedFiles: FileList;
  //Es el array que contiene los items para mostrar el progreso de subida de cada archivo
  progressInfo: any = [];
  //Mensaje que almacena la respuesta de las Apis
  message = '';
  //Nombre del archivo para usarlo posteriormente en la vista html
  fileName = "";
  fileInfos : Observable<any> | null;


  dialcode = '';
  events: string[] = [];
  fechaTemp: Date;
  paisesArray: PaisesTel[] = [];
  nombreArchivo: string = '';
  nombreArchivoAnterior = '';
  nombre: String = '';
  direccion: String = '';
  telefono: String = '';
  correo: String = '';
  logo: String = '';
  estado: String = '';
  pais: String = '';
  fechaFundacion: number;
  rutaCarpeta = environment.logos;
  urlImagen = '';

  constructor(
    private iglesiaService: IglesiaService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private formBuilder: FormBuilder,
    private uploadFilesService: UploadFilesService,
    private tokenService: TokenService
  ) { }

  ngOnInit() {

    this.paisesArray = (data as any).default;

    this.cargarDetalle();

  }

  private buildForm(){
    this.formIglesia = this.formBuilder.group({
      nombre: new FormControl(this.nombre, [Validators.required]),
      direccion: new FormControl(this.direccion, [Validators.required]),
      pais: new FormControl(this.pais, [Validators.required]),
      telefono: new FormControl(this.telefono.substr(this.dialcode.length,this.telefono.length), [Validators.required]),
      fechaFormulario: new FormControl({value: this.milisegundosFecha(this.iglesia.fechaFundacion), disabled: true},[Validators.required]),
      correo: new FormControl(this.correo, [ Validators.email]),
      logo: new FormControl(''),
      estado: new FormControl(this.estado)
    });
  }

  onUpdate(): void {
    const id = this.activatedRoute.snapshot.params.id;

    this.iglesia.nombre = this.formIglesia.get('nombre')?.value;
    this.iglesia.direccion =  this.formIglesia.get('direccion')?.value;
    this.iglesia.pais =  this.formIglesia.get('pais')?.value;
    this.iglesia.telefono =  this.dialcode+this.formIglesia.get('telefono')?.value;
    this.iglesia.correo =  this.formIglesia.get('correo')?.value;
    this.iglesia.logo = this.nombreArchivo === '' || this.nombreArchivo === null ? this.iglesia.logo : this.nombreArchivo;
    this.iglesia.fechaFundacion =  this.fechaFundacion;
    this.iglesia.estado = this.formIglesia.get('estado')?.value;
    this.iglesia.ultimoUsuario = this.tokenService.getUsername();

    this.iglesiaService.modificar(id, this.iglesia).subscribe(
      data => {
        this.toastr.success('Iglesia Actualizada', 'OK', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        this.router.navigate(['/dashboard/iglesia/listar']);
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Error (Modificar)', {
          timeOut: 3000,  positionClass: 'toast-top-center',
        });
        // this.router.navigate(['/']);
      }
    );

    this.uploadFiles();

    this.deleteFile(this.nombreArchivoAnterior);

   }

  volver(): void {
    this.router.navigate(['/dashboard/iglesia/listar']);
  }

  public onDate(event: MatDatepickerInputEvent<Date>): void {
    this.events = [];
    this.events.push(`${event.value}`);
    this.fechaTemp = new Date(this.events[0].toString());
    this.fechaFundacion = new Date(this.fechaTemp).getTime();
  }

  onChangeSelect(event: String) : void{
    for (let elemento of this.paisesArray){
      if(elemento.name_es === event){
        this.dialcode = elemento.dial_code;
      }
    }
  }

  cargarImagen(event: any ){
    this.nombreArchivo = event.target.value.replace("C:\\fakepath\\", "");
    this.selectFiles(event);
    this.logo = this.nombreArchivo;
  }

  selectFiles(event: any) {
    this.progressInfo = [];
    //Validación para obtener el nombre del archivo si es uno solo
    //En caso de que sea >1 asigna a fileName length
    event.target.files.length == 1 ? this.fileName = event.target.files[0].name : this.fileName = event.target.files.length + " archivos";
    this.selectedFiles = event.target.files;
  }

  uploadFiles() {
    this.message = '';
    for (let i = 0; i < this.selectedFiles.length; i++) {
      this.upload(i, this.selectedFiles[i]);
    }
  }

  upload(index: number, file: File) {
    this.progressInfo[index] = { value: 0, fileName: file.name };

    this.uploadFilesService.upload(file).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {

          if (event.total) {
            const total: number = event.total;
            this.progressInfo[index].value = Math.round(100 * event.loaded / total);
          }

        } else if (event instanceof HttpResponse) {
          this.fileInfos = this.uploadFilesService.getFiles();
        }
      },
      err => {
        this.progressInfo[index].value = 0;
        this.message = 'No se puede subir el archivo ' + file.name;
      });
  }

  deleteFile(filename: string) {
    this.uploadFilesService.deleteFile(filename).subscribe(res => {
      this.message = res.toString();
      this.fileInfos = this.uploadFilesService.getFiles();
    });
  }

  milisegundosFecha(milisegundos: number) : Date{
    var date = new Date(milisegundos);
    return date;
  }

  cargarDetalle(){
    const id = this.activatedRoute.snapshot.params.id;
    this.iglesiaService.detalle(id).subscribe(
      data => {
        this.iglesia = data;

        this.nombre = this.iglesia.nombre;
        this.direccion = this.iglesia.direccion;
        this.pais =  this.iglesia.pais;
        this.telefono =  this.iglesia.telefono;
        this.correo =  this.iglesia.correo;
        this.urlImagen = this.rutaCarpeta+this.iglesia.logo;
        this.nombreArchivoAnterior = this.iglesia.logo.toString();
        this.estado =  this.iglesia.estado;
        this.fechaFundacion = this.iglesia.fechaFundacion;

        for (let elemento of this.paisesArray){
          if(elemento.name_es === this.iglesia.pais){
            this.dialcode = elemento.dial_code;
          }
        }

        this.buildForm();
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Error (Detalle2)', {
          timeOut: 3000,  positionClass: 'toast-top-center',
        });
        this.router.navigate(['/dashboard/iglesia/listar']);
      }
    );
  }
}
