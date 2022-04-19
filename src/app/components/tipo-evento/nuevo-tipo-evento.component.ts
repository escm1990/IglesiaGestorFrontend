import { TokenService } from './../../service/token.service';
import { Iglesia } from './../../models/iglesia';
import { IglesiaService } from './../../service/iglesia.service';
import { ToastrService } from 'ngx-toastr';
import { TipoEventoService } from './../../service/tipo-evento.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TipoEvento } from '../../models/tipo-evento';
import { Observable} from 'rxjs';
import { map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-nuevo-tipo-evento',
  templateUrl: './nuevo-tipo-evento.component.html',
  styleUrls: ['./nuevo-tipo-evento.component.scss']
})
export class NuevoTipoEventoComponent implements OnInit {

  descripcion = '';
  estado = 'ACTIVO';
  fecha: number;
  formTipoEvento: FormGroup;
  events: string[] = [];

  myControl = new FormControl();
  options: string[] = [];
  filteredOptions: Observable<string[]>;

  constructor(
    private tipoEventoService: TipoEventoService,
    private toastr: ToastrService,
    private router: Router,
    private formBuilder: FormBuilder,
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {

    this.buildForm();
  }

  private buildForm(){
    this.formTipoEvento = this.formBuilder.group({
      descripcion: new FormControl('', [Validators.required]),
       });
  }

  onCreate(): void{
    this.descripcion = this.formTipoEvento.get('descripcion')?.value;

    const tipoEvento = new TipoEvento(this.descripcion,this.estado, this.tokenService.getUsername());
    this.tipoEventoService.guardar(tipoEvento).subscribe(
      data => {
        this.toastr.success('Tipo Evento Creado', 'OK', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        this.router.navigate(['/dashboard/tipo_evento/listar']);
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
    this.router.navigate(['/dashboard/tipo_evento/listar']);
  }

}
