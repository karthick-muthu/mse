import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { TranslateModule, TranslateService } from 'ng2-translate';
import { RouterModule } from '@angular/router';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MomentModule } from 'angular2-moment';
import { NgPipesModule } from 'ngx-pipes';
import { CookieModule } from 'ngx-cookie';
import { SharedService } from './shared.service';
import { ContentService } from './services/content/content.service';
import { ChangePasswordService } from './components/change-password/change-password.service';
import { TranslateLoader, TranslateStaticLoader } from 'ng2-translate/src/translate.service';

import { SearchFilterPipe } from '../modules/topics/filters/search-filter.pipe';
import { CommentPipe } from './components/comments/filters/comment.pipe';

import { SharedComponent } from './shared.component';
import { AuthHeaderComponent } from './components/header/auth-header/auth-header.component';
import { AuthFooterComponent } from './components/footer/auth-footer/auth-footer.component';
import { DetailsHeaderComponent } from './components/header/details-header/details-header.component';
import { DetailsFooterComponent } from './components/footer/details-footer/details-footer.component';
import { HeaderComponent } from './components/header/header/header.component';
import { FooterComponent } from './components/footer/footer/footer.component';
import { HeaderT1Component } from './components/header/header/header-t1/header-t1.component';
import { HeaderT2Component } from './components/header/header/header-t2/header-t2.component';
import { LogoComponent } from './components/logo/logo.component';
import { ProfileComponent } from './components/profile/profile.component';
import { TopicsTileComponent } from './components/topics-tile/topics-tile.component';
import { TopicsTileT1Component } from './components/topics-tile/topics-tile-t1/topics-tile-t1.component';
import { TopicsTileT2Component } from './components/topics-tile/topics-tile-t2/topics-tile-t2.component';
import { MyMindsparkTabsComponent } from './components/my-mindspark/my-tabs/my-tabs.component';
import { MenuComponent } from './components/menu/menu.component';
import { MenuT2Component } from './components/menu/menu-t2/menu-t2.component';
import { MenuT1Component } from './components/menu/menu-t1/menu-t1.component';
import { ProfileT1Component } from './components/profile/profile-t1/profile-t1.component';
import { ProfileT2Component } from './components/profile/profile-t2/profile-t2.component';
import { FooterT2Component } from './components/footer/footer/footer-t2/footer-t2.component';
import { FooterT1Component } from './components/footer/footer/footer-t1/footer-t1.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { CommentsComponent } from './components/comments/comments.component';
import { CommentModalComponent } from './components/comments/comment-modal/comment-modal.component';
import { NotificationComponent } from './components/notification/notification.component';
import { CommentModalService } from './components/comments/comment-modal/comment-modal.service';
import { RewardsT1Component } from './components/my-mindspark/rewards/rewards-t1/rewards-t1.component';
import { RewardsT2Component } from './components/my-mindspark/rewards/rewards-t2/rewards-t2.component';
// tslint:disable-next-line:max-line-length
import { AchievementsT2Component } from './components/my-mindspark/rewards/components/achievements/achievements-t2/achievements-t2.component';
import { HighScoreT1Component } from './components/my-mindspark/rewards/components/high-score/high-score-t1/high-score-t1.component';
import { HighScoreT2Component } from './components/my-mindspark/rewards/components/high-score/high-score-t2/high-score-t2.component';
import { ChampionsT1Component } from './components/my-mindspark/rewards/components/champions/champions-t1/champions-t1.component';
import { ChampionsT2Component } from './components/my-mindspark/rewards/components/champions/champions-t2/champions-t2.component';
// tslint:disable-next-line:max-line-length
import { AchievementsT1Component } from './components/my-mindspark/rewards/components/achievements/achievements-t1/achievements-t1.component';
import { StarredQuestionsT1Component } from './components/my-mindspark/starred-questions/starred-questions-t1/starred-questions-t1.component';
// tslint:disable-next-line:max-line-length
import { StarredQuestionsT2Component } from './components/my-mindspark/starred-questions/starred-questions-t2/starred-questions-t2.component';
import { StarredNavbarT1Component } from './components/my-mindspark/starred-questions/components/starred-navbar-t1/starred-navbar-t1.component';
// tslint:disable-next-line:max-line-length
import { StarredNavbarT2Component } from './components/my-mindspark/starred-questions/components/starred-navbar-t2/starred-navbar-t2.component';
// tslint:disable-next-line:max-line-length
import { EarnedSparkiesT1Component } from './components/my-mindspark/rewards/components/earned-sparkies/earned-sparkies-t1/earned-sparkies-t1.component';
// tslint:disable-next-line:max-line-length
import { EarnedSparkiesT2Component } from './components/my-mindspark/rewards/components/earned-sparkies/earned-sparkies-t2/earned-sparkies-t2.component';

import { QuestionsModule } from './components/questions/questions.module';
import { ErrorsComponent } from './components/errors/errors.component';
import { ImageErrorDirective } from './directives/imageError/imageError.directive';
import { NotificationModalComponent } from './components/notification-modal/notification-modal.component';
import { NotificationModalT2Component } from './components/notification-modal/notification-modal-t2/notification-modal-t2.component';
import { PicturePasswordComponent } from './components/login/picture-password/picture-password.component';
import { PicturePasswordSuccessComponent } from './components/login/picture-password-success/picture-password-success.component';
import { TextPasswordComponent } from './components/login/text-password/text-password.component';
import { SecretQuestionDobComponent } from './components/login/secret-question-dob/secret-question-dob.component';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { LeaderboardComponent } from './components/my-mindspark/rewards/components/high-score/leaderboard/leaderboard.component';
import { WorksheetTileComponent } from './components/worksheet-tile/worksheet-tile.component';
import { FilterWrongPipe } from './pipes/filterWrong/filter-wrong.pipe';
import { QuestionDisplayReformService } from './services/question/questionDisplayReform.service';
import { GameTileComponent } from './components/game-tile/game-tile.component';
import { DoAPICallService } from './services/doAPICall/doAPICall.service';
import { NgCircleProgressModule } from 'ng-circle-progress';

import { environment } from '../../environments/environment';
import { ContentPreviewIframeComponent } from './components/content-preview/components/content-preview-iframe/content-preview-iframe.component';

export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, './assets/i18n', '.json?v=' + environment.releaseVersion);
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    }),
    RouterModule,
    NgbModule.forRoot(),
    MomentModule,
    NgPipesModule,
    QuestionsModule,
    CookieModule.forRoot(),
    Ng2OrderModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
    })
  ],
  exports: [
    TranslateModule,
    ImageErrorDirective,
    SharedComponent,
    QuestionsModule,
    LogoComponent,
    AuthHeaderComponent,
    AuthFooterComponent,
    DetailsHeaderComponent,
    DetailsFooterComponent,
    HeaderComponent,
    HeaderT1Component,
    HeaderT2Component,
    FooterComponent,
    FooterT1Component,
    FooterT2Component,
    MenuComponent,
    ProfileComponent,
    TopicsTileComponent,
    TopicsTileT1Component,
    TopicsTileT2Component,
    MyMindsparkTabsComponent,
    MenuT1Component,
    MenuT2Component,
    ProfileT1Component,
    ProfileT2Component,
    ChangePasswordComponent,
    CommentsComponent,
    CommentModalComponent,
    NotificationComponent,
    RewardsT1Component,
    RewardsT2Component,
    AchievementsT1Component,
    AchievementsT2Component,
    HighScoreT1Component,
    HighScoreT2Component,
    ChampionsT1Component,
    ChampionsT2Component,
    StarredQuestionsT1Component,
    StarredQuestionsT2Component,
    StarredNavbarT1Component,
    StarredNavbarT2Component,
    EarnedSparkiesT1Component,
    EarnedSparkiesT2Component,
    ErrorsComponent,
    NotificationModalComponent,
    NotificationModalT2Component,
    PicturePasswordComponent,
    PicturePasswordSuccessComponent,
    TextPasswordComponent,
    SecretQuestionDobComponent,
    GameTileComponent,
    FilterWrongPipe,
    LeaderboardComponent,
    WorksheetTileComponent
  ],
  declarations: [
    ImageErrorDirective,
    SharedComponent,
    LogoComponent,
    AuthHeaderComponent,
    AuthFooterComponent,
    DetailsHeaderComponent,
    DetailsFooterComponent,
    HeaderComponent,
    HeaderT1Component,
    HeaderT2Component,
    FooterComponent,
    FooterT1Component,
    FooterT2Component,
    MenuComponent,
    ProfileComponent,
    TopicsTileComponent,
    TopicsTileT1Component,
    TopicsTileT2Component,
    MyMindsparkTabsComponent,
    MenuT1Component,
    MenuT2Component,
    ProfileT1Component,
    ProfileT2Component,
    ChangePasswordComponent,
    SearchFilterPipe,
    FilterWrongPipe,
    CommentsComponent,
    CommentModalComponent,
    CommentPipe,
    NotificationComponent,
    RewardsT1Component,
    RewardsT2Component,
    AchievementsT1Component,
    AchievementsT2Component,
    HighScoreT1Component,
    HighScoreT2Component,
    ChampionsT1Component,
    ChampionsT2Component,
    StarredQuestionsT1Component,
    StarredQuestionsT2Component,
    StarredNavbarT1Component,
    StarredNavbarT2Component,
    EarnedSparkiesT1Component,
    EarnedSparkiesT2Component,
    NotificationComponent,
    ErrorsComponent,
    NotificationModalComponent,
    NotificationModalT2Component,
    PicturePasswordComponent,
    PicturePasswordSuccessComponent,
    TextPasswordComponent,
    SecretQuestionDobComponent,
    GameTileComponent,
    LeaderboardComponent,
    WorksheetTileComponent,
    ContentPreviewIframeComponent
  ],
  providers: [
    SharedService,
    ContentService,
    ChangePasswordService,
    CommentModalService,
    QuestionDisplayReformService,
    NgbActiveModal,
    DoAPICallService
  ],
  entryComponents: [NotificationModalT2Component]
})
export class SharedModule { }
