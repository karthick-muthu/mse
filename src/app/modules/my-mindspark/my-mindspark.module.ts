import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgPipesModule } from 'ngx-pipes';
import { MomentModule } from 'angular2-moment';
import { SharedModule } from '../../shared/shared.module';
import { MyMindsparkRoutes } from './my-mindspark.routing';

import { MyMindsparkComponent } from './my-mindspark.component';
import { RewardsComponent } from './components/rewards/rewards.component';
import { MailboxComponent } from './components/mailbox/mailbox.component';
import { MyDetailsComponent } from './components/my-details/my-details.component';
import { ReadMailComponent } from './components/read-mail/read-mail.component';
import { CommentsComponent } from '../../shared/components/comments/comments.component';
import { CommentModalComponent } from '../../shared/components/comments/comment-modal/comment-modal.component';
import { StarredQuestionsComponent } from './components/starred-questions/starred-questions.component';

import { MyDetailsService } from './components/my-details/my-details.service';
import { MailboxService } from './components/mailbox/mailbox.service';
import { RewardsService } from './components/rewards/rewards.service';
import { StarredQuestionsService } from './components/starred-questions/starred-questions.service';

import { GetFileNamePipe } from '../../shared/pipes/getFileName/getFileName.pipe';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    NgPipesModule,
    MomentModule,
    RouterModule.forChild(MyMindsparkRoutes)
  ],
  exports: [
    RouterModule,
    MyMindsparkComponent,
    RewardsComponent,
    MailboxComponent,
    ReadMailComponent,
    MyDetailsComponent,
    StarredQuestionsComponent
  ],
  declarations: [
    MyMindsparkComponent,
    RewardsComponent,
    MailboxComponent,
    ReadMailComponent,
    MyDetailsComponent,
    StarredQuestionsComponent,
    GetFileNamePipe
  ],
  providers: [
    MyDetailsService,
    MailboxService,
    RewardsService,
    StarredQuestionsService
  ],
  entryComponents: [CommentModalComponent, CommentsComponent]
})
export class MyMindsparkModule { }
