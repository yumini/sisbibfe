import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AutorComponent } from './autor/autor.component';
import { PaisComponent } from './pais/pais.component';

const appRoutes: Routes = [
    { path: 'autor', component: AutorComponent },
    { path: 'pais', component: PaisComponent }    
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);