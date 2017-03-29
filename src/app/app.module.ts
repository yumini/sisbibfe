import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgForm } from '@angular/forms';
import { AppComponent } from './app.component';
import { ModalModule } from 'ng2-bootstrap';
import { TypeaheadModule } from 'ng2-bootstrap';
import { AutorComponent } from './autor/autor.component';
import { PaisComponent } from './pais/pais.component';
import { AutorService} from '../shared/dataservices/autor.service';
import { PaisService} from '../shared/dataservices/pais.service';
import { ConfigService} from '../shared/settings/config.service';
import { AlertModule } from 'ng2-bootstrap';
import { PagerService } from '../shared/dataservices/index';

import { routing } from './app.routing';

@NgModule({
  declarations: [
    AppComponent,
    AutorComponent,
    PaisComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    routing,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    TypeaheadModule.forRoot(),
    HttpModule
  
  ],

  providers: [AutorService, PaisService, ConfigService, PagerService],

  bootstrap: [AppComponent]
})
export class AppModule { }
