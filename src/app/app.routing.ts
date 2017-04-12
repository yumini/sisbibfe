import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AutorComponent } from './autor/autor.component';
import { PaisComponent } from './pais/pais.component';
import { EditorialComponent } from './editorial/editorial.component';
import { MateriaComponent } from './materia/materia.component';
import { AnexoComponent } from './anexo/anexo.component';

const appRoutes: Routes = [
    { path: 'autor', component: AutorComponent },
    { path: 'pais', component: PaisComponent },
    { path: 'editorial', component: EditorialComponent },
    { path: 'materia', component: MateriaComponent },
    { path: 'anexo', component:  AnexoComponent}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);