import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { Ng2PageScrollModule} from 'ng2-page-scroll';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { RezoService } from './rezo.service'

import { ComponentsModule } from './components/components.module';
import { Error404Component } from './error404/error404.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    Error404Component
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,
    RouterModule,
    ComponentsModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    Ng2PageScrollModule
    
  ],
  providers: [RezoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
