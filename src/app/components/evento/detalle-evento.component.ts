import { Miembro } from 'src/app/models/miembro';
import { EventoDetalleArray } from './../../models/evento-detalle-array';
import { MiembroService } from './../../service/miembro.service';
import { TokenService } from './../../service/token.service';
import { EventoDetalle } from './../../models/evento-detalle';
import { EventoDetalleService } from './../../service/evento-detalle.service';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { TipoEventoService } from './../../service/tipo-evento.service';
import { EventoService } from './../../service/evento.service';
import { TipoEvento } from './../../models/tipo-evento';
import { Evento } from './../../models/evento';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import * as XLSX from 'xlsx';

export interface iDetalleInsertar {
  Miembro: number;
  Comentario: string;
}

interface EventoDetalleMember extends Partial<EventoDetalle> {
  mostrarMiembro: String
}

@Component({
  selector: 'app-detalle-evento',
  templateUrl: './detalle-evento.component.html',
  styleUrls: ['./detalle-evento.component.scss']
})
export class DetalleEventoComponent implements OnInit, OnDestroy {

  filas: iDetalleInsertar[] = [ { Miembro: 0, Comentario: "" }];

  evento: Evento;
  tipoEvento: TipoEvento;
  descripcion: String;
  fechaMostrar: string = '';
  tipoEventoMostrar: String = '';
  eventoDetalle: EventoDetalle[] = [];
  eventoDetalleExcel: EventoDetalle[] = [];
  miembroMostrar: string[] = [];
  eda: EventoDetalleArray;
  ed: EventoDetalle;
  objMiembro: number;
  objComent: String;
  miembro: Miembro;

  objInt : EventoDetalleMember;

  index: number = 0;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  isAdmin =  false;
  roles: string[];

  spinnerEnabled = false;
  keys: string[];
  dataSheet: Subject<any> = new Subject<any>();
  @ViewChild('inputFile') inputFile: ElementRef;
  isExcelFile: boolean;

  idEvento = this.activateRoute.snapshot.params.id;

  eventoDetalleMostrar: String[] = [];

  constructor(
    private eventoService: EventoService,
    private eventoDetalleService: EventoDetalleService,
    private tipoEventoService: TipoEventoService,
    private miembroService: MiembroService,
    private activateRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {
    this.roles = this.tokenService.getAuthorities();
    this.roles.forEach(rol =>{
      if (rol === 'ROLE_ADMIN') {
        this.isAdmin = true;
      }
    });
    this.mostrarDetalle();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  mostrarDetalle(){
    const id = this.activateRoute.snapshot.params.id;

    this.eventoService.detalle(id).subscribe(
      {
        next: (data) =>{
          this.evento = data;

          this.tipoEventoService.detalle(this.evento.tipo_evento_id).subscribe(
            {
              next: (data) =>{
                this.tipoEvento = data;
                this.tipoEventoMostrar = this.tipoEvento.descripcion;
              },
              error: (err) =>{
                this.toastr.error(err.error.mensaje, 'Error (DetalleTipoPersona1)', {
                  timeOut: 3000,  positionClass: 'toast-top-center',
                });
              }
            }
          );

          this.fechaMostrar = this.milisegundosFecha(this.evento.fecha);
          this.cargarDetalleEvento(id);
        },
        error: (err) => {
          this.toastr.error(err.error.mensaje, 'Error (Detalle1)', {
            timeOut: 3000,  positionClass: 'toast-top-center',
          });
          this.volver();
        }
      }
    );
  }

  volver(): void {
    this.router.navigate(['/dashboard/evento/listar']);
  }

  milisegundosFecha(milisegundos: number) : string{
    var date = new Date(milisegundos);
    var result = date.toLocaleDateString(); // 10/29/2013
    return result;
  }

  cargarDetalleEvento(id: number){

    this.index = 0;
    this.eventoDetalleService.listarEvento(id).subscribe(
      {
        next: (data) => {
          this.eventoDetalle = data;
          this.dtTrigger.next(data);

          this.eventoDetalle.forEach(x =>{
            //console.log('Miembro --> '+x.miembro_id.toString());

            this.miembroService.detalle(+x.miembro_id.toString()).subscribe(
              {
                next: (data) => {
                    this.miembro = data;
                    this.miembroMostrar[this.index] = this.miembro.nombre+' '+this.miembro.apellido;
                    this.index++;
                },
                error: (e) =>{
                  console.log('Error consultar descripcion del miembro');
                }
              }
            );
          });
        },
        error: (e) => {
          this.toastr.error(e, 'Error (listarPorEvento)', {
            timeOut: 3000, positionClass: 'toast-top-center',
          });
        },
        complete: () => console.info('Consulta de detalle de evento finalizada')
      }
    );
  }

  borrar(id: number | any){
    this.eventoDetalleService.eliminar(id).subscribe({
      error: (e) => {
        this.toastr.error(e, 'Error (borrar)', {
          timeOut: 3000, positionClass: 'toast-top-center',
        });
      },
      complete: () => {
        this.toastr.success('Evento Detalle Eliminado', 'OK', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        this.dtTrigger.unsubscribe();
        //this.cargarListaDetalleEvento();
        this.volverCargar();
      }
    });
  }

  onChange(evt: any) {
    let data: any, header;
    const target: DataTransfer = <DataTransfer>(evt.target);
    this.isExcelFile = !!target.files[0].name.match(/(.xls|.xlsx)/);
    if (target.files.length > 1) {
      this.inputFile.nativeElement.value = '';
    }
    if (this.isExcelFile) {
      this.spinnerEnabled = true;
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        /* save data */
        data = XLSX.utils.sheet_to_json<iDetalleInsertar>(ws);

        //Construyendo el objeto para almacenar la información
        this.filas = XLSX.utils.sheet_to_json<iDetalleInsertar>(ws);
        console.log(this.filas);

      };

      reader.readAsBinaryString(target.files[0]);

      reader.onloadend = (e) => {
        this.spinnerEnabled = false;
        this.keys = Object.keys(data[0]);
        this.dataSheet.next(data)
      }

    } else {
      this.inputFile.nativeElement.value = '';
    }
  }

  removeData() {
    this.inputFile.nativeElement.value = '';
    this.dataSheet.next(null);
    this.keys = [];
    this.isExcelFile = false;
  }

  volverCargar(): void {
    window.location.reload();
  }


  guardarCargaExcel(){
		let indx: number = 0;

    this.filas.forEach(x => {
        var salCom: string = '';
        var salMie: number = 0;
        var ultUser: string = this.tokenService.getUsername();

        salMie = +x.Miembro.toString();
        //console.log(salMie);

        if(x.Comentario === undefined || x.Comentario.length == 0){
          salCom = 'NA';
        }else{
          salCom = x.Comentario.toString();
        }
        //console.log(salCom);

        this.ed = new EventoDetalle(this.idEvento,salMie,salCom,ultUser);
        //console.log(this.ed);

        this.eventoDetalleExcel.push(this.ed);
        //console.log('Objeto eventoDetalle arreglo');
        //console.log(this.eventoDetalleExcel[indx]);
        indx = indx + 1;

    });

    this.eda = new EventoDetalleArray(this.eventoDetalleExcel);
        console.log('Objeto eventoDetalleArray nuevo');
        console.log(this.eda);

        this.eventoDetalleService.guardarCargaExcel(this.eda).subscribe(
          {
            complete: () => {
              console.log('Carga de Excel guardada exitosamente')
            },
            error: (e) => {
              this.toastr.error(e, 'Error al cargar Excel', {
                timeOut: 3000, positionClass: 'toast-top-center',
              });
            }
          }
        );

        this.volverCargar();
  }

  //Mostrar lista de detalle asociada al evento
  /*
  cargarListaDetalleEvento(){
    this.eventoDetalleService.listar().subscribe({
      next: (data) =>{
        this.eventoDetalle =  data;
        this.dtTrigger.next(data);
      },
      error: (e) => {
        this.toastr.error(e, 'Error (listarEventoDetalle)', {
          timeOut: 3000, positionClass: 'toast-top-center',
        });
      },
      complete: () => console.info('Consulta de detalle finalizada')
    });
  }*/

}
