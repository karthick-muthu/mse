import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { GamesRoutes } from './games.routing';

import { SharedModule } from '../../shared/shared.module';
import { GamesComponent } from './games.component';
import { GamesListComponent } from './components/games-list/games-list.component';
import { GamesService } from './games.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(GamesRoutes)
  ],
  exports: [
    RouterModule,
    GamesComponent,
    GamesListComponent
  ],
  declarations: [
    GamesComponent,
    GamesListComponent
  ],
  providers: [
    GamesService
  ]
})
export class GamesModule { }
