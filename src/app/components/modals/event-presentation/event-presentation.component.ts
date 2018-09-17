import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { TimeseriesEventMap } from '../../eventing-map/eventing-map.component';

export interface EventPresentationData {
  timeseriesEvents: TimeseriesEventMap[];
}

@Component({
  selector: 'app-event-presentation',
  templateUrl: './event-presentation.component.html',
  styleUrls: ['./event-presentation.component.scss']
})
export class EventPresentationComponent {

  constructor(
    public dialogRef: MatDialogRef<EventPresentationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EventPresentationData
  ) { }

}
