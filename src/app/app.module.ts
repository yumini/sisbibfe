import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {NgForm} from '@angular/forms';
import { AppComponent } from './app.component';
import { ModalModule } from 'ng2-bootstrap';
import { AutorComponent } from './autor/autor.component';
import { AutorService} from '../shared/dataservices/autor.service';
import { ConfigService} from '../shared/settings/config.service';
import { AlertModule } from 'ng2-bootstrap';
import { PagerService } from '../shared/dataservices/index';

@NgModule({
  declarations: [
    AppComponent,
    AutorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    HttpModule
  
  ],
  providers: [AutorService, ConfigService, PagerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
