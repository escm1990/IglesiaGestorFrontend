import { TipoPersona } from './../../models/tipo-persona';
import { TokenService } from './../../service/token.service';
import { IglesiaService } from './../../service/iglesia.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Iglesia } from './../../models/iglesia';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { TipoPersonaService } from 'src/app/service/tipo-persona.service';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-nuevo-tipo-persona',
  templateUrl: './nuevo-tipo-persona.component.html',
  styleUrls: ['./nuevo-tipo-persona.component.scss']
})
export class NuevoTipoPersonaComponent implements OnInit {

  descripcion = '';
  estado = 'ACTIVO';
  fecha: number;
  formTipoPersona: UntypedFormGroup;

  constructor(
    private tipoPersonaService: TipoPersonaService,
    private toastr: ToastrService,
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {

    this.buildForm();
  }


  private buildForm(){
    this.formTipoPersona = this.formBuilder.group({
      descripcion: new UntypedFormControl('', [Validators.required]),
          });
  }

  onCreate(): void{
    this.descripcion = this.formTipoPersona.get('descripcion')?.value;

    const tipoPersona = new TipoPersona(this.descripcion,this.estado,this.tokenService.getUsername());
    this.tipoPersonaService.guardar(tipoPersona).subscribe(
      data => {
        this.toastr.success('Tipo Persona Creado', 'OK', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        this.router.navigate(['/dashboard/tipo_persona/listar']);
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Error (Nuevo)', {
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
