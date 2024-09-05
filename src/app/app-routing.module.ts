import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AboutPageComponent } from './shared/pages/about-page/about-page.component';
import { ContactPageComponent } from './shared/pages/contact-page/contact-page.component';
import { HomePageComponent } from './shared/pages/home-page/home-page.component';

const routes: Routes = [
  // {
  //   path: '',
  //   component: HomePageComponent
  // },
  {
    path: 'about',
    component: AboutPageComponent
  },
  {
    path: 'contact',
    component: ContactPageComponent
  },
  // Voy a hacer la importacion de las rutas (CountriesRoutingModule) que ya tengo importada en contries.module
  // Asignamos un path para que cargue el modulo que estamos importando. Cuando alguien entra a Countries ya carga el module. Como este module tiene su configuracion de rutas ya sabe que rutas va a disponer al router, por ende Angular va a saber que hacer cuando se solicite un recurso a countries
  {
    path: 'countries',
    loadChildren: () => import('./countries/countries.module').then( m => m.CountriesModule )
  },
  {
    // Basicamente si el user navega a cualquier ruta que no sea las que tengo establecidas, o sea Home y About, va a ser redirigido hacia la ruta Home
    path: '**',
    redirectTo: 'countries'
  }
];

@NgModule({
  imports: [
    // Si es el unico y principal router de nuestra aplicacion le vamos a poner el "forRoot(routes)"
    RouterModule.forRoot(routes)
  ],
  // Lo exportamos para que app.module.ts pueda tener todo a su disposicion
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
