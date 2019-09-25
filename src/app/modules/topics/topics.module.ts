import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { TopicsRoutes } from './topics.routing';

import { TopicsComponent } from './topics.component';
import { TopicsListComponent } from './components/topics-list/topics-list.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TopicDetailsComponent } from './components/topic-details/topic-details.component';
import { TopicTrailComponent } from './components/topic-trail/topic-trail.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(TopicsRoutes),
        FormsModule,
        NgbModule.forRoot()
    ],
    exports: [
        RouterModule,
        TopicsComponent,
        TopicsListComponent,
        TopicDetailsComponent,
        TopicTrailComponent
    ],
    declarations: [
        TopicsComponent,
        TopicsListComponent,
        TopicDetailsComponent,
        TopicTrailComponent
    ]
})
export class TopicsModule { }
