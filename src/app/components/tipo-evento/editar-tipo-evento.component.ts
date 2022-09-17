import { TokenService } from './../../service/token.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TipoEventoService } from './../../service/tipo-evento.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { TipoEvento } from '../../models/tipo-evento';

@Component({
  selector: 'app-editar-tipo-evento',
  templateUrl: './editar-tipo-evento.component.html',
  styleUrls: ['./editar-tipo-evento.component.scss']
})
export class EditarTipoEventoComponent implements OnInit {

  descripcion: String  = '';
  estado: String = '';
  tipoEvento: TipoEvento;
  formTipoEvento: FormGroup;

  myControl =  new FormControl();
  options: string[] = [];
  filteredOptions: Observable<string[]>;

  controlAC: AbstractControl;

  constructor(
    private tipoEventoService: TipoEventoService,
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

    this.tipoEventoService.detalle(id).subscribe(
      data => {
        this.tipoEvento = data;
        this.estado = this.tipoEvento.estado;
        this.descripcion = this.tipoEvento.descripcion;
      //  console.log(this.estado+" "+this.descripcion+" "+this.iglesia_id+" "+this.nombreIglesia);

        this.buildForm();

      },
      err => {
        this.toastr.error(err.error.mensaje, 'Error (Detalle1)', {
          timeOut: 3000,  positionClass: 'toast-top-center',
        });
        this.router.navigate(['/dashboard/tipo_evento/listar']);
      }
    );
  }


  buildForm(){
    this.formTipoEvento = this.formBuilder.group({
      descripcion: new FormControl(this.descripcion,[Validators.required]),
      estado: new FormControl(this.estado)
    });
  }

  onUpdate(): void {
    const id = this.activatedRoute.snapshot.params.id;

    this.tipoEvento.descripcion = this.formTipoEvento.get('descripcion')?.value;
    this.tipoEvento.estado = this.formTipoEvento.get('estado')?.value;
    this.tipoEvento.ultimoUsuario =  this.tokenService.getUsername();

    this.tipoEventoService.modificar(id, this.tipoEvento).subscribe(
      data => {
        this.toastr.success('Tipo Evento Actualizada', 'OK', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        this.router.navigate(['/dashboard/tipo_evento/listar']);
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
    this.router.navigate(['/dashboard/tipo_evento/listar']);
  }

}
