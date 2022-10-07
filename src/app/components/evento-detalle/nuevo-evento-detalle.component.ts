import { EventoService } from './../../service/evento.service';
import { TokenService } from './../../service/token.service';
import { Miembro } from 'src/app/models/miembro';
import { EventoDetalle } from './../../models/evento-detalle';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventoDetalleService } from './../../service/evento-detalle.service';
import { MiembroService } from './../../service/miembro.service';
import { Component, OnInit } from '@angular/core';
import { map, startWith} from 'rxjs/operators';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-nuevo-evento-detalle',
  templateUrl: './nuevo-evento-detalle.component.html',
  styleUrls: ['./nuevo-evento-detalle.component.scss']
})
export class NuevoEventoDetalleComponent implements OnInit {

  formDetalleEvento: FormGroup;
  detalleEvento: EventoDetalle;

  comentarioMostrar: String = '';
  idDetEve = this.activatedRoute.snapshot.params.id;

  options: string[] = [];
  filteredOptions: Observable<string[]>;
  myControl = new FormControl('');

  miembros: Miembro[] = [];
  miembro: number | any;

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private miembroService: MiembroService,
    private eventoDetalleService: EventoDetalleService,
    private tokenService: TokenService,
    private eventoService: EventoService
  ) { }

  ngOnInit(): void {
    this.cargarMiembros();
    this.buildForm();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
      );
  }


  private buildForm(){
    this.formDetalleEvento =  this.formBuilder.group(
      {
        comentarioF: new FormControl('',[Validators.required]),
      }
    );
  }

  volver(): void {
    this.router.navigate(['/dashboard/evento/detalle/'+this.eventoService.getEventoId()]);
  }

  onCreate(){

     const ed = new EventoDetalle(
      +this.eventoService.getEventoId(),
      this.miembro,
      this.formDetalleEvento.get('comentarioF')?.value,
      this.tokenService.getUsername());

      this.eventoDetalleService.guardar(ed).subscribe(
        {
          complete: () => {
            this.toastr.success('Tipo Registro Creado', 'OK', {
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
      )
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
  }

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
}
