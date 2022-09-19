import { HttpEventType, HttpResponse } from '@angular/common/http';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { TipoPersonaService } from 'src/app/service/tipo-persona.service';
import { TokenService } from './../../service/token.service';
import { UploadFilesService } from './../../service/upload-files.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MiembroService } from './../../service/miembro.service';
import { TipoPersona } from 'src/app/models/tipo-persona';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Miembro } from 'src/app/models/miembro';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-editar-miembro',
  templateUrl: './editar-miembro.component.html',
  styleUrls: ['./editar-miembro.component.scss']
})
export class EditarMiembroComponent implements OnInit {

  miembro: Miembro;
  nombre: String = '';
  apellido: String = '';
  fechaNacimiento: number = 0;
  sexo: String = '';
  estadoCivil: String = '';
  direccion: String = '';
  telefonoFijo: String = '';
  telefonoMovil: String = '';
  correo: String = '';
  fechaConversion: number = 0;
  fechaBautismo: number = 0;
  foto: String = '';
  estado: String = '';
  ultimoUsuario: String = '';
  iglesia_id: number;
  getIglesia: string;
  tipo_persona_id: number;

  events: string[] = [];
  fechaTemp: Date;
  formMiembro: FormGroup;

  //Variable para subir la imagen
  nombreArchivo: string = '';
  nombreArchivoAnterior = '';
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
  rutaCarpeta = environment.logos;
  urlImagen = '';

  constructor(
    private miembroService: MiembroService,
    private toastr: ToastrService,
    private router: Router,
    private formBuilder: FormBuilder,
    private uploadFilesService: UploadFilesService,
    private tokenService: TokenService,
    private tipoPersonaService: TipoPersonaService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.cargarDetalle();
  }

  private buildForm(){
    this.formMiembro = this.formBuilder.group({
      nombre: new FormControl(this.nombre, [Validators.required]),
      apellido: new FormControl(this.apellido, [Validators.required]),
      direccion: new FormControl(this.direccion, [Validators.required]),
      estadoCivil: new FormControl(this.estadoCivil, [Validators.required]),
      sexo: new FormControl(this.sexo, [Validators.required]),
      telefonoFijo: new FormControl(this.telefonoFijo, [Validators.required]),
      telefonoMovil: new FormControl(this.telefonoMovil, [Validators.required]),
      fechaNacimiento: new FormControl({value: this.milisegundosFecha(this.fechaNacimiento), disabled: true},[Validators.required]),
      fechaConversion: new FormControl({value: this.milisegundosFecha(this.fechaConversion), disabled: true},[Validators.required]),
      fechaBautismo: new FormControl({value: this.milisegundosFecha(this.fechaBautismo), disabled: true},[Validators.required]),
      correo: new FormControl(this.correo, [ Validators.email]),
      tipo_persona_id: new FormControl(this.tipo_persona_id),
      foto: new FormControl('')
    });
  }

  onUpdate(): void {

    const id = this.activatedRoute.snapshot.params.id;

    this.miembro.nombre = this.formMiembro.get('nombre')?.value;
    this.miembro.apellido = this.formMiembro.get('apellido')?.value;
    this.miembro.direccion = this.formMiembro.get('direccion')?.value;
    this.miembro.estadoCivil = this.formMiembro.get('estadoCivil')?.value;
    this.miembro.correo =  this.formMiembro.get('correo')?.value;
    this.miembro.telefonoFijo =  this.formMiembro.get('telefonoFijo')?.value;
    this.miembro.telefonoMovil =  this.formMiembro.get('telefonoMovil')?.value;
    this.miembro.tipo_persona_id =  this.formMiembro.get('tipo_persona_id')?.value;
    this.miembro.sexo = this.formMiembro.get('sexo')?.value;
    this.miembro.foto = this.nombreArchivo === '' || this.nombreArchivo === null ? this.miembro.foto : this.nombreArchivo;


    this.getIglesia = this.tokenService.getUserIglesiaId();
    this.miembro.iglesia_id = +this.getIglesia; //conversión de string a number (+)

      this.miembroService.modificar(id, this.miembro).subscribe(
        data => {
          this.toastr.success('Miembro Actualizado', 'OK', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
          this.router.navigate(['/dashboard/miembro/listar']);
        },
        err => {
          this.toastr.error(err.error.mensaje, 'Error (Modificar)', {
            timeOut: 3000,  positionClass: 'toast-top-center',
          });
        }
      );

      this.uploadFiles();

      this.deleteFile(this.nombreArchivoAnterior);

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

  milisegundosFecha(milisegundos: number) : Date{
    var date = new Date(milisegundos);
    return date;
  }

  deleteFile(filename: string) {
    this.uploadFilesService.deleteFile(filename).subscribe(res => {
      this.message = res.toString();
      this.fileInfos = this.uploadFilesService.getFiles();
    });
  }

  cargarDetalle(){

    const id = this.activatedRoute.snapshot.params.id;

    this.miembroService.detalle(id).subscribe({
      next: (data) => {
        this.miembro = data;

        this.nombre = this.miembro.nombre;
        this.apellido = this.miembro.apellido;
        this.direccion = this.miembro.direccion;
        this.estado = this.miembro.estado;
        this.estadoCivil = this.miembro.estadoCivil;
        this.sexo = this.miembro.sexo;
        this.telefonoFijo = this.miembro.telefonoFijo;
        this.telefonoMovil = this.miembro.telefonoMovil;
        this.correo = this.miembro.correo;
        this.fechaBautismo =  this.miembro.fechaBautismo;
        this.fechaConversion = this.miembro.fechaConversion;
        this.fechaNacimiento = this.miembro.fechaNacimiento;
        this.urlImagen = this.rutaCarpeta+this.miembro.foto;
        this.tipo_persona_id =  this.miembro.tipo_persona_id;
        this.buildForm();
        this.cargarTipoPersona();
      },
      error: (err) => {
        this.toastr.error(err.error.mensaje, 'Error (Detalle2)', {
          timeOut: 3000,  positionClass: 'toast-top-center',
        });
        this.router.navigate(['/dashboard/miembro/listar']);
      }
    });
  }
}
