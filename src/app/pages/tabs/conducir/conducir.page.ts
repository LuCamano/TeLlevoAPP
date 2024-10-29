import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-conducir',
  templateUrl: './conducir.page.html',
  styleUrls: ['./conducir.page.scss'],
})
export class ConducirPage implements OnInit {

  viajes = [
    {
      destino: 'Talcahuano',
      fecha: new Date('2020-09-20T09:00:00'),
      pasajeros: 3,
      distancia: 15,
    },
    {
      destino: 'Concepción',
      fecha: new Date('2020-09-20T18:00:00'),
      pasajeros: 2,
      distancia: 10,
    },
    {
      destino: 'Chiguayante',
      fecha: new Date('2020-09-21T09:00:00'),
      pasajeros: 1,
      distancia: 20,
    },
  ];

  constructor() { }

  ngOnInit() {
  }

}
