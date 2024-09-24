import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})

export class PerfilPage implements OnInit {
  
  viajes = [
    { id:'1',fecha: '2024-09-21', conductor: 'Juan Pérez', lugar: 'Santiago' },
    { id:'2',fecha: '2024-09-22', conductor: 'María López', lugar: 'Valparaíso' },
    { id:'3',fecha: '2024-09-23', conductor: 'Carlos Díaz', lugar: 'Concepción' }
  ];

  constructor() { }

  ngOnInit() {
  }
}
