import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgForm } from '@angular/forms';
import { AppComponent } from './app.component';
import { ModalModule } from 'ng2-bootstrap';

import { AutorComponent } from './autor/autor.component';
import { PaisComponent } from './pais/pais.component';
import { EditorialComponent } from './editorial/editorial.component';
import { MateriaComponent } from './materia/materia.component';
import { AnexoComponent } from './anexo/anexo.component';
import { AutorService} from '../shared/dataservices/autor.service';
import { PaisService} from '../shared/dataservices/pais.service';
import { EditorialService} from '../shared/dataservices/editorial.service';
import { MateriaService} from '../shared/dataservices/materia.service';
import { AnexoService} from '../shared/dataservices/anexo.service';
import { ConfigService} from '../shared/settings/config.service';
import { AlertModule } from 'ng2-bootstrap';
import { PagerService } from '../shared/dataservices/index';

import { NguiAutoCompleteModule } from '@ngui/auto-complete';

import { routing } from './app.routing';

@NgModule({
  declarations: [
    AppComponent,
    AutorComponent,
    PaisComponent,
    EditorialComponent,
    MateriaComponent,
    AnexoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    routing,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    NguiAutoCompleteModule,    
    HttpModule
  
  ],

  providers: [AutorService, PaisService, EditorialService, MateriaService, ConfigService, PagerService, AnexoService],

  bootstrap: [AppComponent]
})
export class AppModule { }
