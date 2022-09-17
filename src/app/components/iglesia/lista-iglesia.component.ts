import { TokenService } from '../../service/token.service';
import { IglesiaService } from '../../service/iglesia.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Iglesia } from '../../models/iglesia';
import { ToastrService } from 'ngx-toastr';
import {Subject} from 'rxjs';


@Component({
  selector: 'app-lista-iglesia',
  templateUrl: './lista-iglesia.component.html',
  styleUrls: ['./lista-iglesia.component.scss']
})
export class ListaIglesiaComponent implements OnInit, OnDestroy {

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  Iglesias: Iglesia[] = [];
  roles: string[];
  isAdmin = false;

  constructor(
    private IglesiaService: IglesiaService,
    private toastr: ToastrService,
    private tokenService: TokenService
      ) { }

  ngOnInit() {
    this.cargarIglesias();
    this.roles = this.tokenService.getAuthorities();
    this.roles.forEach(rol => {
      if (rol === 'ROLE_ADMIN') {
        this.isAdmin = true;
      }
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  cargarIglesias(): void {

    this.IglesiaService.listar().subscribe({
        next: (data) => {
          this.Iglesias = data;
          this.dtTrigger.next(data);
        },
        error: (e) => {
          this.toastr.error(e, 'Error (Listar)', {
            timeOut: 3000, positionClass: 'toast-top-center',
          });
        },
        complete: () => console.info('Consulta de iglesia finalizada')
      })

  }

  borrar(id: number | any) {
    this.IglesiaService.eliminar(id).subscribe({
      error: (e) => {
        this.toastr.error(e, 'Error (borrar)', {
          timeOut: 3000, positionClass: 'toast-top-center',
        });
      },
      complete: () => {
        this.toastr.success('Iglesia Eliminada', 'OK', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        this.dtTrigger.unsubscribe();
        this.cargarIglesias();
      }
    })
  }

}
