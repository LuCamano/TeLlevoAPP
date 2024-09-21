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
      title: 'Buscar',
      url: '/tabs/buscar',
      icon: 'search-circle',
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
