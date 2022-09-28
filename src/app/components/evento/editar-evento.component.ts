import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Evento } from './../../models/evento';
import { TipoEventoService } from './../../service/tipo-evento.service';
import { TokenService } from './../../service/token.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EventoService } from './../../service/evento.service';
import { TipoEvento } from './../../models/tipo-evento';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-editar-evento',
  templateUrl: './editar-evento.component.html',
  styleUrls: ['./editar-evento.component.scss']
})
export class EditarEventoComponent implements OnInit {

  descripcion: String = '';
  fecha: number = 0;
  iglesia_id: number = 0;
  tipo_evento_id: number = 0;

  events: string[] = [];
  fechaTemp: Date;

  formEvento: FormGroup;
  getIglesia: string;
  TiposEventos: TipoEvento[] = [];
  evento: Evento;

  constructor(
    private eventoService: EventoService,
    private toastr: ToastrService,
    private router: Router,
    private formBuilder: FormBuilder,
    private tokenService: TokenService,
    private tipoEventoService: TipoEventoService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.cargarDetalle();
  }

  private buildForm(){
    this.formEvento = this.formBuilder.group(
    {
      descripcion: new FormControl(this.descripcion,[Validators.required]),
      fecha: new FormControl({value: this.milisegundosFecha(this.fecha), disabled: true},[Validators.required]),
      tipo_evento_id: new FormControl(this.tipo_evento_id)
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

  onUpdate(){
    const id = this.activatedRoute.snapshot.params.id;

    this.evento.descripcion = this.formEvento.get('descripcion')?.value;
    this.evento.tipo_evento_id = this.formEvento.get('tipo_evento_id')?.value;
    this.getIglesia = this.tokenService.getUserIglesiaId();
    this.evento.iglesia_id = +this.getIglesia; //conversión de string a number (+)
    this.evento.ultimo_usuario = this.tokenService.getUsername();
    this.evento.fecha = this.fecha;

    this.eventoService.modificar(id, this.evento).subscribe({
      complete: () => {
        this.toastr.success('Evento Modificado', 'OK', {
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


  milisegundosFecha(milisegundos: number) : Date{
    var date = new Date(milisegundos);
    return date;
  }

  cargarDetalle(){
    const id = this.activatedRoute.snapshot.params.id;

    this.eventoService.detalle(id).subscribe(
      {
        next: (data) => {
          this.evento =  data;

          this.descripcion =  this.evento.descripcion;
          this.fecha = this.evento.fecha;
          this.iglesia_id = this.evento.iglesia_id;
          this.tipo_evento_id = this.evento.tipo_evento_id;

          this.buildForm();
          this.cargarTiposEventos();
        },
        error: (err) => {
          this.toastr.error(err.error.mensaje, 'Error (Detalle2)', {
            timeOut: 3000,  positionClass: 'toast-top-center',
          });
          this.router.navigate(['/dashboard/evento/listar']);
        }
      }
    );
  }
}
