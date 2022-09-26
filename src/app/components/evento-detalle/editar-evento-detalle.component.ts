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
  selector: 'app-editar-evento-detalle',
  templateUrl: './editar-evento-detalle.component.html',
  styleUrls: ['./editar-evento-detalle.component.scss']
})
export class EditarEventoDetalleComponent implements OnInit {

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
    private eventoDetalleService: EventoDetalleService
  ) { }

  ngOnInit(): void {
    this.cargarDetalle();
    this.cargarMiembros();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
      );
  }

  cargarDetalle(){
    this.eventoDetalleService.detalle(this.idDetEve).subscribe(
      {
        next: (data) =>{
          this.detalleEvento = data;
          this.comentarioMostrar =  this.detalleEvento.comentario;
          this.buildForm();
        },
        error: (e) =>{
          this.toastr.error(e, 'Error (Listar Detalle)', {
            timeOut: 3000,  positionClass: 'toast-top-center',
          });
        }
      }
    );
  }

  private buildForm(){
    this.formDetalleEvento =  this.formBuilder.group(
      {
        comentarioF: new FormControl(this.comentarioMostrar,[Validators.required]),
      }
    );
  }

  volver(): void {
    this.router.navigate(['/dashboard/evento/detalle/'+this.detalleEvento.evento_id]);
  }

  onUpdate(){
    const id = this.activatedRoute.snapshot.params.id;
    this.detalleEvento.comentario = this.formDetalleEvento.get('comentarioF')?.value;
    this.detalleEvento.miembro_id = this.miembro;

    this.eventoDetalleService.modificar(id,this.detalleEvento).subscribe({
      complete: () =>{
        console.log('completo');
        this.volver();
      }
    })
  }

  obtenerMiembro(id: number): string {
    var salida = '';

    this.miembroService.detalle(id).subscribe(
      {
        next: (data) =>{
          this.miembro =  new Miembro(data.nombre.toString(), data.apellido.toString(), data.fechaNacimiento,
            data.sexo.toString(), data.estadoCivil.toString(),data.direccion.toString(), data.telefonoFijo.toString(),
            data.telefonoMovil.toString(), data.correo.toString(), data.fechaConversion, data.fechaBautismo,
            data.foto.toString(), data.estado.toString(), data.ultimoUsuario.toString(), data.iglesia_id, data.tipo_persona_id);

          salida = data.nombre.toString()+' '+data.apellido.toString();
        },
        error: (e) =>{
          this.toastr.error(e, 'Error (Listar Miembro)', {
            timeOut: 3000,  positionClass: 'toast-top-center',
          });
        }
      }
    );

    console.log('Salida -- '+salida);
    return salida;
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
  }

}
