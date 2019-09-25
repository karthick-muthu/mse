import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MomentModule } from 'angular2-moment';
import { NgPipesModule } from 'ngx-pipes';
import { AppRoutingModule } from './app.routing.module';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MindsparkInterceptor } from './shared/mindsparkInterceptor';
import { ProgressBarModule } from 'ng2-progress-bar';
import { AppComponent } from './app.component';
import { HomeModule } from './modules/home/home.module';
import { TopicsModule } from './modules/topics/topics.module';
import { WorksheetsModule } from './modules/worksheets/worksheets.module';
import { GamesModule } from './modules/games/games.module';
import { MyMindsparkModule } from './modules/my-mindspark/my-mindspark.module';
import { SharedModule } from './shared/shared.module';
import { MyProgressModule } from './modules/my-progress/my-progress.module';
import { IdleTimeoutComponent } from './shared/components/idle-timeout/idle-timeout.component';
import { Ng2DeviceDetectorModule } from 'ng2-device-detector';

@NgModule({
  declarations: [
    AppComponent, IdleTimeoutComponent
  ],
  imports: [
    NgbModule.forRoot(),
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MomentModule,
    NgPipesModule,
    AppRoutingModule,
    HomeModule,
    TopicsModule,
    WorksheetsModule,
    GamesModule,
    MyMindsparkModule,
    SharedModule,
    MyProgressModule,
    NgIdleKeepaliveModule,
    ProgressBarModule,
    Ng2DeviceDetectorModule.forRoot()
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: MindsparkInterceptor,
    multi: true,
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
