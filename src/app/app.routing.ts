import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { ComponentsComponent } from './components/components.component';
import { BasicelementsComponent } from './components/basicelements/basicelements.component';
import { Error404Component } from './error404/error404.component';

const routes: Routes =[
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home',component: ComponentsComponent },
    { path: 'basicelements',component: BasicelementsComponent},
    { path : 'Eror404 ' , component: Error404Component},
    { path : '**' , redirectTo:'Error404'}
  
  ];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes,{
      useHash: true
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
