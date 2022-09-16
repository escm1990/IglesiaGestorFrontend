import { TokenService } from './../../service/token.service';
import { TipoPersonaService } from './../../service/tipo-persona.service';
import { Observable } from 'rxjs';
import { UntypedFormGroup, UntypedFormControl, AbstractControl, UntypedFormBuilder, Validators } from '@angular/forms';
import { TipoPersona } from './../../models/tipo-persona';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-editar-tipo-persona',
  templateUrl: './editar-tipo-persona.component.html',
  styleUrls: ['./editar-tipo-persona.component.scss']
})
export class EditarTipoPersonaComponent implements OnInit {

  descripcion: String  = '';
  estado: String = '';
  tipoPersona: TipoPersona;
  formTipoPersona: UntypedFormGroup;

  constructor(
    private tipoPersonaService: TipoPersonaService,
    private toastr: ToastrService,
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private activatedRoute: ActivatedRoute,
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {
    this.cargarDetalle();
  }

  cargarDetalle(){
    const id = this.activatedRoute.snapshot.params.id;
    //console.log("cargarDetalle "+id);

    this.tipoPersonaService.detalle(id).subscribe(
      data => {
        this.tipoPersona = data;
        this.estado = this.tipoPersona.estado;
        this.descripcion = this.tipoPersona.descripcion;
      //  console.log(this.estado+" "+this.descripcion+" "+this.iglesia_id+" "+this.nombreIglesia);

        this.buildForm();


      },
      err => {
        this.toastr.error(err.error.mensaje, 'Error (Detalle1)', {
          timeOut: 3000,  positionClass: 'toast-top-center',
        });
        this.router.navigate(['/dashboard/tipo_persona/listar']);
      }
    );
  }


  buildForm(){
    this.formTipoPersona = this.formBuilder.group({
      descripcion: new UntypedFormControl(this.descripcion,[Validators.required]),
      estado: new UntypedFormControl(this.estado)
    });
  }

  onUpdate(): void {
    const id = this.activatedRoute.snapshot.params.id;

    this.tipoPersona.descripcion = this.formTipoPersona.get('descripcion')?.value;
    this.tipoPersona.estado = this.formTipoPersona.get('estado')?.value;
    this.tipoPersona.ultimoUsuario =  this.tokenService.getUsername();

    this.tipoPersonaService.modificar(id, this.tipoPersona).subscribe(
      data => {
        this.toastr.success('Tipo Persona Actualizada', 'OK', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        this.router.navigate(['/dashboard/tipo_persona/listar']);
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
    this.router.navigate(['/dashboard/tipo_persona/listar']);
  }

}
