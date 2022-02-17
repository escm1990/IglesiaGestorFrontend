import { TokenService } from './../../service/token.service';
import { map, startWith } from 'rxjs/operators';
import { Iglesia } from './../../models/iglesia';
import { IglesiaService } from './../../service/iglesia.service';
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

  iglesia: Iglesia;
  nombreIglesia: String  = '';
  iglesia_id: number | any;
  Iglesias: Iglesia[];

  myControl =  new FormControl();
  options: string[] = [];
  filteredOptions: Observable<string[]>;

  controlAC: AbstractControl;

  constructor(
    private tipoEventoService: TipoEventoService,
    private toastr: ToastrService,
    private router: Router,
    private formBuilder: FormBuilder,
    private iglesiaService: IglesiaService,
    private activatedRoute: ActivatedRoute,
    private tokenService: TokenService
    ) { }

  ngOnInit(): void {

    this.cargarIglesias();
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
        this.iglesia_id = this.tipoEvento.iglesia_id;
        this.obtenerIglesia(this.iglesia_id);
      //  console.log(this.estado+" "+this.descripcion+" "+this.iglesia_id+" "+this.nombreIglesia);

        this.buildForm();

        //Para administrar el listado del AutoComplete
        this.controlAC = this.formTipoEvento.controls['iglesiaAC'];
        this.filteredOptions = this.controlAC.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value)),
          );

      },
      err => {
        this.toastr.error(err.error.mensaje, 'Error (Detalle1)', {
          timeOut: 3000,  positionClass: 'toast-top-center',
        });
        this.router.navigate(['/dashboard/tipo_evento/listar']);
      }
    );
  }

  obtenerIglesia(id: number){
    //console.log("obtenerIglesia "+id);

    this.Iglesias.forEach(element => {
      if(element.id === id){
        this.nombreIglesia = element.nombre;
      }
    });
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

  buildForm(){
    this.formTipoEvento = this.formBuilder.group({
      descripcion: new FormControl(this.descripcion,[Validators.required]),
      iglesiaAC: new FormControl(this.nombreIglesia),
      estado: new FormControl(this.estado)
    });
  }

  onUpdate(): void {
    const id = this.activatedRoute.snapshot.params.id;

    this.tipoEvento.descripcion = this.formTipoEvento.get('descripcion')?.value;
    this.tipoEvento.estado = this.formTipoEvento.get('estado')?.value;
    this.tipoEvento.iglesia_id = this.iglesia_id;
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

  onChangeSelect(event: any) : void{
    for (let elemento of this.Iglesias){
      if(elemento.nombre === event){
        this.iglesia_id = elemento.id;
      }
    }
    //console.log("onChangeSelect "+this.iglesia_id);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
}
