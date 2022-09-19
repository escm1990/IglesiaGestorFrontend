import { Evento } from './../../models/evento';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { EventoService } from './../../service/evento.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TokenService } from './../../service/token.service';
import { TipoEventoService } from './../../service/tipo-evento.service';
import { TipoEvento } from './../../models/tipo-evento';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nuevo-evento',
  templateUrl: './nuevo-evento.component.html',
  styleUrls: ['./nuevo-evento.component.scss']
})
export class NuevoEventoComponent implements OnInit {

  descripcion = '';
  fecha: number = 0;
  iglesia_id: number = 0;
  tipo_evento_id: number = 0;

  events: string[] = [];
  fechaTemp: Date;

  formEvento: FormGroup;
  getIglesia: string;
  TiposEventos: TipoEvento[] = [];

  constructor(
    private eventoService: EventoService,
    private toastr: ToastrService,
    private router: Router,
    private formBuilder: FormBuilder,
    private tokenService: TokenService,
    private tipoEventoService: TipoEventoService
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.cargarTiposEventos();
  }

  private buildForm(){
    this.formEvento = this.formBuilder.group(
    {
      descripcion: new FormControl('',[Validators.required]),
      fecha: new FormControl({value: '', disabled: true},[Validators.required]),
      tipo_evento_id: new FormControl('')
    }
    );
  }

  private cargarTiposEventos(){
    this.tipoEventoService.listar().subscribe({
      next: (data) => {
        this.TiposEventos =  data;
      },
      error: (err) => {
        this.toastr.error(err, 'Error (Listar TipoEvento)', {
          timeOut: 3000,  positionClass: 'toast-top-center',
        });
      }
    });
  }

  volver(): void {
    this.router.navigate(['/dashboard/evento/listar']);
  }

  public onDate(event: MatDatepickerInputEvent<Date>): void {
    this.events = [];
    this.events.push(`${event.value}`);
    this.fechaTemp = new Date(this.events[0].toString());
    this.fecha = new Date(this.fechaTemp).getTime();
  }

  onCreate(){
    this.descripcion = this.formEvento.get('descripcion')?.value;
    this.tipo_evento_id = this.formEvento.get('tipo_evento_id')?.value;
    this.getIglesia = this.tokenService.getUserIglesiaId();
    this.iglesia_id = +this.getIglesia; //conversión de string a number (+)

    const evento = new Evento(this.descripcion, this.fecha, this.iglesia_id, this.tipo_evento_id, this.tokenService.getUsername());
    this.eventoService.guardar(evento).subscribe({
      complete: () => {
        this.toastr.success('Evento Creado', 'OK', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        this.router.navigate(['/dashboard/evento/listar']);
      },
      error: (err) => {
        this.toastr.error(err.error.mensaje, 'Error (Nuevo)', {
          timeOut: 3000,  positionClass: 'toast-top-center',
        });
      }
    });
  }
}
