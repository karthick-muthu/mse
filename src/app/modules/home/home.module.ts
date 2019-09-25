import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeService } from './home.service';
import { TopicListService } from '../topics/services/topic-list.service';

import { SharedModule } from '../../shared/shared.module';
import { HomeComponent } from './home.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [HomeComponent],
  declarations: [HomeComponent],
  providers: [HomeService, TopicListService]
})
export class HomeModule { }
