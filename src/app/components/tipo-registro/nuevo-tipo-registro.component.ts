import { TipoRegistro } from './../../models/tipo-registro';
import { TokenService } from './../../service/token.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TipoRegistroService } from './../../service/tipo-registro.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nuevo-tipo-registro',
  templateUrl: './nuevo-tipo-registro.component.html',
  styleUrls: ['./nuevo-tipo-registro.component.scss']
})
export class NuevoTipoRegistroComponent implements OnInit {

  descripcion = '';
  tipoContabilizacion = '';
  estado = 'ACTIVO';
  fecha: number;
  formTipoRegistro: FormGroup;

  constructor(
    private tipoRegistroService: TipoRegistroService,
    private toastr: ToastrService,
    private router: Router,
    private formBuilder: FormBuilder,
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm(){
    this.formTipoRegistro = this.formBuilder.group({
      descripcion: new FormControl('', [Validators.required]),
      tipoContabilizacion: new FormControl('', [Validators.required])
    });
  }

  onCreate():void {

    this.descripcion = this.formTipoRegistro.get('descripcion')?.value;
    this.tipoContabilizacion = this.formTipoRegistro.get('tipoContabilizacion')?.value;
    const tipoRegistro = new TipoRegistro(this.descripcion, this.estado, this.tipoContabilizacion, this.tokenService.getUsername());1

    this.tipoRegistroService.guardar(tipoRegistro).subscribe(
      data => {
        this.toastr.success('Tipo Registro Creado', 'OK', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        this.router.navigate(['/dashboard/tipo_registro/listar']);
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Error (Nuevo)', {
          timeOut: 3000,  positionClass: 'toast-top-center',
        });
        // this.router.navigate(['/']);
      }
    );

  }

  volver():void {
    this.router.navigate(['/dashboard/tipo_registro/listar']);
  }
}
