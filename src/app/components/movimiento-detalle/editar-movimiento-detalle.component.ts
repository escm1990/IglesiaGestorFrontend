import { startWith, map } from 'rxjs/operators';
import { MiembroService } from './../../service/miembro.service';
import { TipoRegistroService } from './../../service/tipo-registro.service';
import { MovimientoDetalleService } from './../../service/movimiento-detalle.service';
import { MovimientoService } from './../../service/movimiento.service';
import { TokenService } from './../../service/token.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TipoRegistro } from './../../models/tipo-registro';
import { Miembro } from './../../models/miembro';
import { Observable } from 'rxjs';
import { MovimientoDetalle } from './../../models/movimiento-detalle';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-editar-movimiento-detalle',
  templateUrl: './editar-movimiento-detalle.component.html',
  styleUrls: ['./editar-movimiento-detalle.component.scss']
})
export class EditarMovimientoDetalleComponent implements OnInit {

  formDetalleMovimiento: FormGroup;
  movimientoDetalle: MovimientoDetalle;

  idDetMov = this.activatedRoute.snapshot.params.id;
  comentarioMostrar: String = '';
  monto: number = 0;

  options: string[] = [];
  filteredOptions: Observable<string[]>;
  myControl = new FormControl('');

  miembros: Miembro[] = [];
  miembro: number | any;
  miembroMostrar = '';

  tiposRegistro: TipoRegistro[] = [];
  tpReg: number = 0;
  numMov: number = 0;

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private tokenService: TokenService,
    private movimientoService: MovimientoService,
    private movimientoDetalleService: MovimientoDetalleService,
    private tipoRegistroService: TipoRegistroService,
    private miembroService: MiembroService
  ) { }


  ngOnInit(): void {
    this.cargarMiembros();
    this.cargarTipoRegistro();
    this.cargarDetalle();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
      );
    this.miembro = 0;
  }

  private buildForm(){
    this.formDetalleMovimiento = this.formBuilder.group(
      {
        comentario: new FormControl(this.comentarioMostrar,[Validators.required]),
        tipoRegistro: new FormControl(this.tpReg,[Validators.required]),
        monto : new FormControl(this.monto,[Validators.required]),
        idMov : new FormControl(this.numMov)
      }
    );
  };

  volver(): void {
    this.router.navigate(['/dashboard/movimiento/detalle/'+this.movimientoService.getMovimientoId()]);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  onChangeSelect(event: any) : void{
    for (let elemento of this.miembros){
      if(elemento.nombre+' '+elemento.apellido === event){
        this.miembro = elemento.id;
       // console.log(" this.iglesia_id "+ this.iglesia );
      }
    }
  };

  cargarMiembros(): void{
    this.miembroService.listar().subscribe(
      {
        next: (data) =>{
          this.miembros = data;
          this.miembros.forEach(element => {
            this.options.push(element.nombre.toString()+' '+element.apellido.toString());
          })
        },
        error: (err) => {
          console.log('Error cargar miembros --> '+err);
        }
      }
    )
  };

  cargarTipoRegistro(): void{
    this.tipoRegistroService.listar().subscribe(
      {
        next: (data) =>{
          this.tiposRegistro = data;
        },
        error: (err) => {
          console.log('Error cargar tiposRegistro --> '+err);
        }
      }
    );
  };

  cargarDetalle(){
    this.movimientoDetalleService.detalle(this.idDetMov).subscribe(
      {
        next: (data) => {
          this.movimientoDetalle = data;
          this.comentarioMostrar =  this.movimientoDetalle.comentario;
          this.monto = this.movimientoDetalle.monto;
          this.tpReg = this.movimientoDetalle.tipo_registro_id;
          this.miembroMostrar = this.obtenerMiembro(this.movimientoDetalle.miembro_id);
          this.buildForm();
        },
        error: (e) =>{
          this.toastr.error(e, 'Error (Listar Detalle)', {
            timeOut: 3000,  positionClass: 'toast-top-center',
          });
        }
      }
    );
  };

  onUpdate(){

    this.movimientoDetalle.comentario = this.formDetalleMovimiento.get('comentario')?.value;
    this.movimientoDetalle.monto = this.formDetalleMovimiento.get('monto')?.value;
    this.movimientoDetalle.tipo_registro_id = this.formDetalleMovimiento.get('tipoRegistro')?.value;
    this.movimientoDetalle.ultimo_usuario = this.tokenService.getUsername();
    this.movimientoDetalle.miembro_id = this.miembro;

    this.movimientoDetalleService.modificar(this.idDetMov, this.movimientoDetalle).subscribe(
      {
        complete: () =>{
          this.toastr.success('Movimiento Detalle Actualizado', 'OK', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
          this.volver();
        },
        error: (err) =>{
          this.toastr.error(err.error.mensaje, 'Error (Modificar)', {
            timeOut: 3000,  positionClass: 'toast-top-center',
          });
        }
      }
    );
  };

  obtenerMiembro(id: number): string {
    var salida = '';

    this.miembroService.detalle(id).subscribe(
      {
        next: (data) =>{
          this.miembro =  new Miembro(data.nombre.toString(), data.apellido.toString(), data.fechaNacimiento,
            data.sexo.toString(), data.estadoCivil.toString(),data.direccion.toString(), data.telefonoFijo.toString(),
            data.telefonoMovil.toString(), data.correo.toString(), data.fechaConversion, data.fechaBautismo,
            data.foto.toString(), data.estado.toString(), data.ultimoUsuario.toString(), data.iglesia_id, data.tipo_persona_id);

          salida = data.nombre.toString()+' '+data.apellido.toString();
          console.log('Salida(1) -- '+salida);
          this.miembroMostrar = this.movimientoDetalle.miembro_id+' - '+salida;


        },
        error: (e) =>{
          this.toastr.error(e, 'Error (Listar Miembro)', {
            timeOut: 3000,  positionClass: 'toast-top-center',
          });
        }
      }
    );

    console.log('Salida(2) -- '+salida);
    return salida;
  }

}
