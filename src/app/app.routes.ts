import { Routes } from '@angular/router';

import { SuperheroListComponent } from './features/superhero/superhero-list/superhero-list.component';
import { SuperheroDetailComponent } from './features/superhero/superhero-detail/superhero-detail.component';
import { SuperheroComponent } from './features/superhero/superhero/superhero.component';
import { Error404Component } from './shared/components/error-404/error-404.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/superheroes',
        pathMatch: 'full'
    },
    {
        path: 'superheroes',
        component: SuperheroComponent,
        children: [
            { path: '', component: SuperheroListComponent },
            { path: 'new', component: SuperheroDetailComponent },
            { path: ':id', component: SuperheroDetailComponent }
        ]
    },
    {
        path: 'error-404',
        component: Error404Component
    },
    {
        path: '**',
        redirectTo: '/error-404',
        pathMatch: 'full'
    }
];
