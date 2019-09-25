import { Component } from '@angular/core';
import { SlugifyPipe } from 'ngx-pipes';
import { TopicsTileComponent } from '../topics-tile.component';
import { TopicsTileT2Component } from '../topics-tile-t2/topics-tile-t2.component';

@Component({
  selector: 'ms-topics-tile-t1',
  templateUrl: './topics-tile-t1.component.html',
  styleUrls: ['./topics-tile-t1.component.scss'],
  providers: [SlugifyPipe, TopicsTileComponent]
})
export class TopicsTileT1Component extends TopicsTileT2Component { }
