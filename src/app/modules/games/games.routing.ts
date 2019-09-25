import { Routes, RouterModule } from '@angular/router';

import { GamesComponent } from './games.component';
import { GamesListComponent } from './components/games-list/games-list.component';

export const GamesRoutes: Routes = [
  { path: '', component: GamesListComponent, pathMatch: 'full' },
  { path: ':id', component: GamesListComponent },
];
