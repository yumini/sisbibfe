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
    HttpModule
  ],
  providers: [AutorService, ConfigService],
  bootstrap: [AppComponent]
})
export class AppModule { }
