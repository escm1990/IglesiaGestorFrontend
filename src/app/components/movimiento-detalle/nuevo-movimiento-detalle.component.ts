import { startWith, map } from 'rxjs/operators';
import { TipoRegistro } from './../../models/tipo-registro';
import { Miembro } from './../../models/miembro';
import { Observable } from 'rxjs';
import { TipoRegistroService } from './../../service/tipo-registro.service';
import { MovimientoService } from './../../service/movimiento.service';
import { TokenService } from './../../service/token.service';
import { MovimientoDetalleService } from './../../service/movimiento-detalle.service';
import { MiembroService } from './../../service/miembro.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MovimientoDetalle } from './../../models/movimiento-detalle';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nuevo-movimiento-detalle',
  templateUrl: './nuevo-movimiento-detalle.component.html',
  styleUrls: ['./nuevo-movimiento-detalle.component.scss']
})
export class NuevoMovimientoDetalleComponent implements OnInit {

  formDetalleMovimiento: FormGroup;
  movimientoDetalle: MovimientoDetalle;

  idDetMov = this.activatedRoute.snapshot.params.id;

  options: string[] = [];
  filteredOptions: Observable<string[]>;
  myControl = new FormControl('');

  miembros: Miembro[] = [];
  miembro: number | any;

  tiposRegistro: TipoRegistro[] = [];

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
    this.buildForm();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
      );
    this.miembro = 0;
  }

  private buildForm(){
    this.formDetalleMovimiento = this.formBuilder.group(
      {
        comentario: new FormControl('',[Validators.required]),
        tipoRegistro: new FormControl('',[Validators.required]),
        monto : new FormControl('',[Validators.required]),
      }
    );
  }

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

  onCreate(){

    const md = new MovimientoDetalle(
      +this.movimientoService.getMovimientoId(),
      this.formDetalleMovimiento.get('tipoRegistro')?.value,
      this.formDetalleMovimiento.get('comentario')?.value,
      this.formDetalleMovimiento.get('monto')?.value,
      this.miembro,'ACTIVO',this.tokenService.getUsername()
    );

    this.movimientoDetalleService.guardar(md).subscribe(
      {
        complete: () => {
          this.toastr.success('Detalle Movimiento Creado', 'OK', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
          this.volver();
        },
        error: (err) =>{
          this.toastr.error(err, 'Error (Nuevo)', {
            timeOut: 3000,  positionClass: 'toast-top-center',
          });
        }
      }
    );
  };

}
