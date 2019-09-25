import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './modules/home/home.component';
import { TopicsComponent } from './modules/topics/topics.component';
import { QuestionsComponent } from './shared/components/questions/questions.component';
import { WorksheetsComponent } from './modules/worksheets/worksheets.component';
import { GamesComponent } from './modules/games/games.component';
import { MyMindsparkComponent } from './modules/my-mindspark/my-mindspark.component';

import { TopicsRoutes } from './modules/topics/topics.routing';
import { WorksheetsRoutes } from './modules/worksheets/worksheets.routing';
import { GamesRoutes } from './modules/games/games.routing';
import { MyMindsparkRoutes } from './modules/my-mindspark/my-mindspark.routing';
import { MyProgressComponent } from './modules/my-progress/my-progress.component';
import { ErrorsComponent } from './shared/components/errors/errors.component';
import { ContentPreviewComponent } from './shared/components/content-preview/content-preview.component';
import { ContentPreviewIframeComponent } from './shared/components/content-preview/components/content-preview-iframe/content-preview-iframe.component';

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'topics', component: TopicsComponent, children: TopicsRoutes },
    { path: 'content', component: QuestionsComponent },
    { path: 'worksheets', component: WorksheetsComponent, children: WorksheetsRoutes },
    { path: 'games', component: GamesComponent, children: GamesRoutes },
    { path: 'my-mindspark', component: MyMindsparkComponent, children: MyMindsparkRoutes },
    { path: 'my-progress', component: MyProgressComponent },
    { path: 'error/:type', component: ErrorsComponent },
    { path: 'contentPreviewIframe', component: ContentPreviewComponent },
    { path: 'contentPreview', component: ContentPreviewIframeComponent },
    { path: '**', component: ErrorsComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
