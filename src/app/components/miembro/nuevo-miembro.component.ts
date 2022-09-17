import { HttpResponse, HttpEventType } from '@angular/common/http';
import { Miembro } from './../../models/miembro';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Observable } from 'rxjs';
import { TokenService } from './../../service/token.service';
import { UploadFilesService } from './../../service/upload-files.service';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MiembroService } from './../../service/miembro.service';
import { Component, OnInit } from '@angular/core';
import { TipoPersonaService } from 'src/app/service/tipo-persona.service';
import { TipoPersona } from 'src/app/models/tipo-persona';

@Component({
  selector: 'app-nuevo-miembro',
  templateUrl: './nuevo-miembro.component.html',
  styleUrls: ['./nuevo-miembro.component.scss']
})
export class NuevoMiembroComponent implements OnInit {

  nombre = '';
  apellido = '';
  fechaNacimiento: number = 0;
  sexo = '';
  estadoCivil = '';
  direccion = '';
  telefonoFijo = '';
  telefonoMovil = '';
  correo = '';
  fechaConversion: number = 0;
  fechaBautismo: number = 0;
  foto = '';
  estado = 'ACTIVO';
  ultimoUsuario = '';
  iglesia_id: number;
  getIglesia: string;
  tipo_persona_id: number;

  events: string[] = [];
  fechaTemp: Date;
  formMiembro: FormGroup;

  //Variable para subir la imagen
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
  TiposPersona: TipoPersona[] = [];


  constructor(
    private miembroService: MiembroService,
    private toastr: ToastrService,
    private router: Router,
    private formBuilder: FormBuilder,
    private uploadFilesService: UploadFilesService,
    private tokenService: TokenService,
    private tipoPersonaService: TipoPersonaService
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.fileInfos = this.uploadFilesService.getFiles();
    this.cargarTipoPersona();
  }

  private buildForm(){
    this.formMiembro = this.formBuilder.group({
      nombre: new FormControl('', [Validators.required]),
      apellido: new FormControl('', [Validators.required]),
      direccion: new FormControl('', [Validators.required]),
      estadoCivil: new FormControl('', [Validators.required]),
      sexo: new FormControl('', [Validators.required]),
      telefonoFijo: new FormControl('', [Validators.required]),
      telefonoMovil: new FormControl('', [Validators.required]),
      fechaNacimiento: new FormControl({value: '', disabled: true},[Validators.required]),
      fechaConversion: new FormControl({value: '', disabled: true},[Validators.required]),
      fechaBautismo: new FormControl({value: '', disabled: true},[Validators.required]),
      correo: new FormControl('', [ Validators.email]),
      foto: new FormControl(''),
      //iglesia_id: new FormControl(''),
      tipo_persona_id: new FormControl('')
    });
  }

  onCreate(): void {
    this.nombre = this.formMiembro.get('nombre')?.value;
    this.apellido = this.formMiembro.get('apellido')?.value;
    this.direccion = this.formMiembro.get('direccion')?.value;
    this.estadoCivil = this.formMiembro.get('estadoCivil')?.value;
    this.correo =  this.formMiembro.get('correo')?.value;
    this.telefonoFijo =  this.formMiembro.get('telefonoFijo')?.value;
    this.telefonoMovil =  this.formMiembro.get('telefonoMovil')?.value;
    this.tipo_persona_id =  this.formMiembro.get('tipo_persona_id')?.value;
    this.sexo = this.formMiembro.get('sexo')?.value;
    this.foto = this.nombreArchivo;

    this.getIglesia = this.tokenService.getUserIglesiaId();
    this.iglesia_id = +this.getIglesia; //conversión de string a number (+)

    const miembro = new Miembro(this.nombre, this.apellido, this.fechaNacimiento,
      this.sexo, this.estadoCivil, this.direccion, this.telefonoFijo, this.telefonoMovil,
      this.correo, this.fechaConversion, this.fechaBautismo, this.foto, this.estado,
      this.tokenService.getUsername(),this.iglesia_id, this.tipo_persona_id);

      this.miembroService.guardar(miembro).subscribe(
        data => {
          this.toastr.success('Miembro Creado', 'OK', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
          this.router.navigate(['/dashboard/miembro/listar']);
        },
        err => {
          this.toastr.error(err.error.mensaje, 'Error (Nuevo)', {
            timeOut: 3000,  positionClass: 'toast-top-center',
          });
        }
      );

      this.uploadFiles();
  }

  public onDate(event: MatDatepickerInputEvent<Date>, campo: number): void {
    this.events = [];
    this.events.push(`${event.value}`);
    this.fechaTemp = new Date(this.events[0].toString());

    switch (campo) {
      case 1:
          console.log("Fecha Nacimiento");
          this.fechaNacimiento = new Date(this.fechaTemp).getTime();
          break;
      case 2:
          console.log("Fecha Conversion");
          this.fechaConversion = new Date(this.fechaTemp).getTime();
          break;
      case 3:
          console.log("Fecha Bautismo");
          this.fechaBautismo = new Date(this.fechaTemp).getTime();
          break;
      default:
          console.log("Fecha no definida");
          break;
  }
  }

  volver(): void {
    this.router.navigate(['/dashboard/miembro/listar']);
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

  cargarTipoPersona() {
    this.tipoPersonaService.listar().subscribe(
      data => {
        this.TiposPersona = data;
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Error (Listar)', {
          timeOut: 3000, positionClass: 'toast-top-center',
        });
      }
    )
  }

}
