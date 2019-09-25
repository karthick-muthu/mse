import { Routes, RouterModule } from '@angular/router';

import { MyMindsparkComponent } from './my-mindspark.component';
import { RewardsComponent } from './components/rewards/rewards.component';
import { MailboxComponent } from './components/mailbox/mailbox.component';
import { MyDetailsComponent } from './components/my-details/my-details.component';
import { ReadMailComponent } from './components/read-mail/read-mail.component';
import { StarredQuestionsComponent } from './components/starred-questions/starred-questions.component';

export const MyMindsparkRoutes: Routes = [
  { path: '', redirectTo: 'my-details', pathMatch: 'full' },
  { path: 'rewards', component: RewardsComponent },
  { path: 'mailbox', component: MailboxComponent, pathMatch: 'full' },
  { path: 'mailbox/:id', component: ReadMailComponent, pathMatch: 'full' },
  { path: 'my-details', component: MyDetailsComponent },
  { path: 'starred-questions', component: StarredQuestionsComponent },

];
