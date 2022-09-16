import { TokenService } from '../../service/token.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IglesiaService } from '../../service/iglesia.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Iglesia } from '../../models/iglesia';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as data from 'src/assets/paises.json';
import { UploadFilesService } from '../../service/upload-files.service';
import { Observable } from 'rxjs';

export class PaisesTel {
  name_en: string;
  name_es: string;
  dial_code: string;
  code: string;
}

@Component({
  selector: 'app-nuevo-iglesia',
  templateUrl: './nuevo-iglesia.component.html',
  styleUrls: ['./nuevo-iglesia.component.scss']
})
export class NuevoIglesiaComponent implements OnInit {

  nombre = '';
  direccion = '';
  telefono = '';
  correo = '';
  fechaFundacion: number;
  logo = '';
  estado = 'ACTIVO';
  pais = '';
  dialcode = '';
  events: string[] = [];
  fechaTemp: Date;
  formIglesia: UntypedFormGroup;
  paisesArray: PaisesTel[] = [];
  nombreArchivo: string = '';

  //Lista de archivos seleccionados
  selectedFiles: FileList;
  //Es el array que contiene los items para mostrar el progreso de subida de cada archivo
  progressInfo: any = [];
  //Mensaje que almacena la respuesta de las Apis
  message = '';
  //Nombre del archivo para usarlo posteriormente en la vista html
  fileName = "";
  fileInfos : Observable<any> | null;

  constructor(
    private iglesiaService: IglesiaService,
    private toastr: ToastrService,
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private uploadFilesService: UploadFilesService,
    private tokenService: TokenService
    ) { }

  ngOnInit(): void {
    this.buildForm();
    this.paisesArray = (data as any).default;
    this.fileInfos = this.uploadFilesService.getFiles();
  }

  private buildForm(){
    this.formIglesia = this.formBuilder.group({
      nombre: new UntypedFormControl('', [Validators.required]),
      direccion: new UntypedFormControl('', [Validators.required]),
      pais: new UntypedFormControl('', [Validators.required]),
      telefono: new UntypedFormControl('', [Validators.required]),
      fechaFormulario: new UntypedFormControl({value: '', disabled: true},[Validators.required]),
      correo: new UntypedFormControl('', [ Validators.email]),
      logo: new UntypedFormControl('')
    });
  }

  onCreate(): void {
    this.nombre = this.formIglesia.get('nombre')?.value;
    this.direccion =  this.formIglesia.get('direccion')?.value;
    this.pais =  this.formIglesia.get('pais')?.value;
    this.telefono =  this.dialcode+this.formIglesia.get('telefono')?.value;
    this.correo =  this.formIglesia.get('correo')?.value;
    this.logo =  this.nombreArchivo;

    const iglesia = new Iglesia(this.nombre, this.direccion, this.pais, this.correo, this.telefono, this.estado, this.logo, this.fechaFundacion, this.tokenService.getUsername());
    this.iglesiaService.guardar(iglesia).subscribe(
      data => {
        this.toastr.success('Iglesia Creada', 'OK', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        this.router.navigate(['/dashboard/iglesia/listar']);
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Error (Nuevo)', {
          timeOut: 3000,  positionClass: 'toast-top-center',
        });
        // this.router.navigate(['/']);
      }
    );

    this.uploadFiles();

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


}
