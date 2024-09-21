import { Component, OnInit } from '@angular/core';
import { ITabs } from '../interfaces/itabs';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  public tabs: ITabs[] = [
    {
      title: 'Home',
      url: '/tabs/home',
      icon: 'home',
      color: 'tertiary'
    },
    {
      title: 'Viajes disponibles',
      url: '/tabs/buscar',
      icon: 'airplane',
      color: 'tertiary'
    },
    {
      title: 'uber',
      url: '/tabs/uber',
      icon: 'car-sport',
      color: 'tertiary'
    },
    {
      title: 'Perfil',
      url: '/tabs/perfil',
      icon: 'person-circle',
      color: 'tertiary'
    },
    
  ];

  constructor() { }

  ngOnInit() {
  }

}
