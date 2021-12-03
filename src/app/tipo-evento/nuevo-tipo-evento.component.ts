import { TokenService } from './../service/token.service';
import { Iglesia } from './../models/iglesia';
import { IglesiaService } from './../service/iglesia.service';
import { ToastrService } from 'ngx-toastr';
import { TipoEventoService } from './../service/tipo-evento.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TipoEvento } from '../models/tipo-evento';
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

  iglesia_id: number |any;
  Iglesias: Iglesia[] = [];

  myControl = new FormControl();
  options: string[] = [];
  filteredOptions: Observable<string[]>;

  constructor(
    private tipoEventoService: TipoEventoService,
    private toastr: ToastrService,
    private router: Router,
    private formBuilder: FormBuilder,
    private iglesiaService: IglesiaService,
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {
    this.cargarIglesias();

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );

    this.buildForm();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  private buildForm(){
    this.formTipoEvento = this.formBuilder.group({
      descripcion: new FormControl('', [Validators.required]),
      iglesia: new FormControl({value: ''},[Validators.required])    });
  }

  onCreate(): void{
    this.descripcion = this.formTipoEvento.get('descripcion')?.value;

    const tipoEvento = new TipoEvento(this.descripcion,this.estado,this.iglesia_id, this.tokenService.getUsername());
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

  cargarIglesias(): void {
    this.iglesiaService.listar().subscribe(
      data => {
        this.Iglesias = data;

        // Llenar un array con otro array
        this.Iglesias.forEach(element => {
          //console.log(element.nombre.toString());
          this.options.push(element.nombre.toString());
        });

      },
      err => {
        console.log(err);
      }
    );

  }

  volver(): void {
    this.router.navigate(['/dashboard/tipo_evento/listar']);
  }

  onChangeSelect(event: any) : void{
    for (let elemento of this.Iglesias){
      if(elemento.nombre === event){
        this.iglesia_id = elemento.id;
        //console.log(" this.iglesia_id "+ this.iglesia_id );
      }
    }
  }

}
