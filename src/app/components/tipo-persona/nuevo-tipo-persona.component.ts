import { Observable } from 'rxjs';
import { Iglesia } from './../../models/iglesia';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nuevo-tipo-persona',
  templateUrl: './nuevo-tipo-persona.component.html',
  styleUrls: ['./nuevo-tipo-persona.component.scss']
})
export class NuevoTipoPersonaComponent implements OnInit {

  descripcion = '';
  estado = 'ACTIVO';
  fecha: number;
  formTipoPersona: FormGroup;
  events: string[] = [];

  iglesia_id: number | any;
  Iglesias: Iglesia[] = [];

  myControl = new FormControl();
  options: string[] = [];
  filteredOptions: Observable<string[]>;

  constructor() { }

  ngOnInit(): void {
  }

}
