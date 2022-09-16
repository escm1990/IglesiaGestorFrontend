import { ToastrService } from 'ngx-toastr';
import { NuevoUsuario } from './../models/nuevo-usuario';
import { AuthService } from './../service/auth.service';
import { TokenService } from './../service/token.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, UntypedFormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { Iglesia } from '../models/iglesia';
import { IglesiaService } from '../service/iglesia.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {

  nuevoUsuario: NuevoUsuario;
  usuario: string;
  password: string;
  correo: string;
  estado: string = 'ACTIVO';
  errMsj: String;
  isLogged: boolean = false;
  iglesia: number | any;

  options: string[] = [];
  filteredOptions: Observable<string[]>;
  myControl = new UntypedFormControl('');
  salida: string;

  Iglesias: Iglesia[] = [];


  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private IglesiaService: IglesiaService,
  ) { }

  ngOnInit(): void {

    if(this.tokenService.getToken()){
      this.isLogged = true;
    }
    this.cargarIglesias();

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
      );

  }

  onRegister(): void{

    this.nuevoUsuario = new NuevoUsuario(this.usuario, this.password, this.correo, this.estado, this.iglesia);
    this.authService.nuevo(this.nuevoUsuario).subscribe(
      data => {
        this.toastr.success('Usuario Creado', 'OK', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        this.router.navigate(['/login']);
      },
      err =>{
        this.errMsj = err.error.mensaje;
        this.toastr.success('Error al crear cuenta: '+this.errMsj, 'Fail', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        //console.log(this.errMsj);
      }
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }


  cargarIglesias(): void {
    this.IglesiaService.listar().subscribe(
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

  onChangeSelect(event: any) : void{
    for (let elemento of this.Iglesias){
      if(elemento.nombre === event){
        this.iglesia = elemento.id;
       // console.log(" this.iglesia_id "+ this.iglesia );
      }
    }
  }
}
