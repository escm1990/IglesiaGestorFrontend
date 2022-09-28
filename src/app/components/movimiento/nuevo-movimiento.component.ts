import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TokenService } from './../../service/token.service';
import { MovimientoService } from './../../service/movimiento.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Movimiento } from './../../models/movimiento';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nuevo-movimiento',
  templateUrl: './nuevo-movimiento.component.html',
  styleUrls: ['./nuevo-movimiento.component.scss']
})
export class NuevoMovimientoComponent implements OnInit {

  fecha: number = 0;
  fechaTemp: Date;
  iglesia_id: number = 0;
  getIglesia: string;
  descripcion = '';

  formMovimiento: FormGroup;
  events: string[] = [];

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private formBuilder: FormBuilder,
    private tokenService: TokenService,
    private movimientoService: MovimientoService
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm(){
    this.formMovimiento = this.formBuilder.group(
      {
        descripcion: new FormControl('',[Validators.required]),
        fecha: new FormControl({value: '', disabled: true},[Validators.required]),
      }
    );
  }

  volver(): void {
    this.router.navigate(['/dashboard/movimiento/listar']);
  }

  public onDate(event: MatDatepickerInputEvent<Date>): void {
    this.events = [];
    this.events.push(`${event.value}`);
    this.fechaTemp = new Date(this.events[0].toString());
    console.log(this.fechaTemp);
    this.fecha = new Date(this.fechaTemp).getTime();
    console.log(this.fecha);
  }

  onCreate(){
    this.descripcion = this.formMovimiento.get('descripcion')?.value;
    this.getIglesia = this.tokenService.getUserIglesiaId();
    this.iglesia_id = +this.getIglesia; //conversión de string a number (+)
    console.log(this.fecha);
    const movi = new Movimiento(this.descripcion, this.fecha, 0, this.iglesia_id, this.tokenService.getUsername());

    this.movimientoService.guardar(movi).subscribe({
      complete: () => {
        this.toastr.success('Movimiento Creado', 'OK', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        this.volver();
      },
      error: (err) => {
        this.toastr.error(err.error.mensaje, 'Error (Nuevo)', {
          timeOut: 3000,  positionClass: 'toast-top-center',
        });
      }
    });

  };

}
