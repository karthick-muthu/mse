import { Routes, RouterModule } from '@angular/router';

import { WorksheetsComponent } from './worksheets.component';
import { WorksheetsListComponent } from './components/worksheets-list/worksheets-list.component';
import { WorksheetReportComponent } from './components/worksheet-report/worksheet-report.component';
import { QuestionsComponent } from '../../shared/components/questions/questions.component';

export const WorksheetsRoutes: Routes = [
  { path: '', component: WorksheetsListComponent, pathMatch: 'full' },
  { path: 'report', component: WorksheetReportComponent, pathMatch: 'full' },
];
