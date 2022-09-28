import { Movimiento } from './../../models/movimiento';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { TokenService } from './../../service/token.service';
import { MovimientoService } from './../../service/movimiento.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-editar-movimiento',
  templateUrl: './editar-movimiento.component.html',
  styleUrls: ['./editar-movimiento.component.scss']
})
export class EditarMovimientoComponent implements OnInit {

  fecha: number = 0;
  fechaTemp: Date;
  iglesia_id: number = 0;
  getIglesia: string;
  descripcion = '';

  formMovimiento: FormGroup;
  events: string[] = [];
  movimiento: Movimiento;

  id = this.activatedRoute.snapshot.params.id;

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private formBuilder: FormBuilder,
    private tokenService: TokenService,
    private movimientoService: MovimientoService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.cargarDetalle();
  }

  cargarDetalle(){

    this.movimientoService.detalle(this.id).subscribe(
      {
        next: (data) => {
          this.movimiento = data;
          this.fecha = this.movimiento.fecha;
          this.buildForm();
        },
        error: (err) => {
          this.toastr.error(err.error.mensaje, 'Error (Detalle1)', {
            timeOut: 3000,  positionClass: 'toast-top-center',
          });
          this.volver();
        }
      }
    );
  }

  volver(): void {
    this.router.navigate(['/dashboard/movimiento/listar']);
  }

  private buildForm(){
    this.formMovimiento = this.formBuilder.group(
      {
        descripcion: new FormControl(this.movimiento.descripcion,[Validators.required]),
        fecha: new FormControl({value: this.milisegundosFecha(this.fecha), disabled: true},[Validators.required]),
      }
    );
  }

  onUpdate(){
    this.movimiento.descripcion = this.formMovimiento.get('descripcion')?.value;
    this.movimiento.fecha = this.fecha;
    this.movimientoService.modificar(this.id,this.movimiento).subscribe(
    {
      complete: () => {
        this.toastr.success('movimiento Modificado', 'OK', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        this.volver()
      },
      error: (err) => {
        this.toastr.error(err.error.mensaje.toString(), 'Error (Nuevo)', {
          timeOut: 3000,  positionClass: 'toast-top-center',
        });
      }
    }
    );
  }

  milisegundosFecha(milisegundos: number) : Date{
    var date = new Date(milisegundos);
    return date;
  }

  public onDate(event: MatDatepickerInputEvent<Date>): void {
    this.events = [];
    this.events.push(`${event.value}`);
    this.fechaTemp = new Date(this.events[0].toString());
    this.fecha = new Date(this.fechaTemp).getTime();
  }

}
