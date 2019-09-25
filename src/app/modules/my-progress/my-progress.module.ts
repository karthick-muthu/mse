import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentModule } from 'angular2-moment';
import { NgPipesModule } from 'ngx-pipes';
import { MyProgressComponent } from './my-progress.component';
import { MonthlyProgressComponent } from './components/monthly-progress/monthly-progress.component';
import { WeeklyProgressComponent } from './components/weekly-progress/weekly-progress.component';
import { MyProgressService } from './my-progress.service';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MomentModule,
    NgPipesModule
  ],
  exports: [
    MyProgressComponent,
    MonthlyProgressComponent,
    WeeklyProgressComponent
  ],
  declarations: [
    MyProgressComponent,
    MonthlyProgressComponent,
    WeeklyProgressComponent
  ],
  providers: [MyProgressService]
})
export class MyProgressModule {

}
