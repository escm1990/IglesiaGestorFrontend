import { TokenService } from './../../service/token.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TipoRegistroService } from './../../service/tipo-registro.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { TipoRegistro } from './../../models/tipo-registro';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-editar-tipo-registro',
  templateUrl: './editar-tipo-registro.component.html',
  styleUrls: ['./editar-tipo-registro.component.scss']
})
export class EditarTipoRegistroComponent implements OnInit {

  descripcion: String  = '';
  tipoContabilizacion: String = '';
  estado: String = '';
  tipoRegistro: TipoRegistro;
  formTipoRegistro: FormGroup;

  constructor(
    private tipoRegistroService: TipoRegistroService,
    private toastr: ToastrService,
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {
    this.cargarDetalle();
  }

  cargarDetalle(){
    const id = this.activatedRoute.snapshot.params.id;
    //console.log("cargarDetalle "+id);

    this.tipoRegistroService.detalle(id).subscribe(
      data => {
        this.tipoRegistro = data;
        this.estado = this.tipoRegistro.estado;
        this.tipoContabilizacion = this.tipoRegistro.tipoContabilizacion;
        this.descripcion = this.tipoRegistro.descripcion;
      //  console.log(this.estado+" "+this.descripcion+" "+this.iglesia_id+" "+this.nombreIglesia);

        this.buildForm();

      },
      err => {
        this.toastr.error(err.error.mensaje, 'Error (Detalle1)', {
          timeOut: 3000,  positionClass: 'toast-top-center',
        });
        this.router.navigate(['/dashboard/tipo_registro/listar']);
      }
    );
  }


  buildForm(){
    this.formTipoRegistro = this.formBuilder.group({
      descripcion: new FormControl(this.descripcion,[Validators.required]),
      estado: new FormControl(this.estado),
      tipoContabilizacion: new FormControl(this.tipoContabilizacion)
    });
  }

  onUpdate(): void {
    const id = this.activatedRoute.snapshot.params.id;

    this.tipoRegistro.descripcion = this.formTipoRegistro.get('descripcion')?.value;
    this.tipoRegistro.estado = this.formTipoRegistro.get('estado')?.value;
    this.tipoRegistro.ultimoUsuario =  this.tokenService.getUsername();

    this.tipoRegistroService.modificar(id, this.tipoRegistro).subscribe(
      data => {
        this.toastr.success('Tipo Registro Actualizada', 'OK', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        this.router.navigate(['/dashboard/tipo_registro/listar']);
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Error (Modificar)', {
          timeOut: 3000,  positionClass: 'toast-top-center',
        });
        // this.router.navigate(['/']);
      }
    );
  }

  volver(): void {
    this.router.navigate(['/dashboard/tipo_registro/listar']);
  }

}
