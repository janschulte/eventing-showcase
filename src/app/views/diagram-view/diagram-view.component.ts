import { Component, OnInit } from '@angular/core';
import { DatasetOptions, HttpRequestOptions, Timespan } from '@helgoland/core';
import { D3PlotOptions } from '@helgoland/d3';
import { EventFilter, EventingApiService, EventResults, Subscription } from '@helgoland/eventing';

import { eventing } from '../../../environments/credentials';
import { EventingIcon } from '../../components/eventing-diagram/eventing-diagram.component';

@Component({
  selector: 'app-diagram-view',
  templateUrl: './diagram-view.component.html',
  styleUrls: ['./diagram-view.component.scss']
})
export class DiagramViewComponent implements OnInit {

  // diagram component
  public datasetIds = [];
  public datasetOptions = new Map<string, DatasetOptions>();
  public timespan: Timespan;
  public graphOptions: D3PlotOptions = {
    showTimeLabel: false
  };
  public eventingIcon: EventingIcon = {
    height: 30,
    width: 30,
    url: 'assets/warn.png'
  };

  // subscription component
  public subscriptions: Subscription[] = [];

  // events button
  public events: EventResults;
  public loadingEvents: boolean;
  public loadingError: string;

  constructor(
    private eventingApi: EventingApiService,
  ) { }

  ngOnInit() {
    const id = 'http://fluggs.wupperverband.de/sos2/api/v1/__64';
    this.datasetIds.push(id);
    const options = new DatasetOptions(id, 'red');
    this.datasetOptions.set(id, options);
    const end = new Date().getTime();
    const start = end - 1000 * 60 * 60 * 24 * 2;
    this.timespan = new Timespan(start, end);
  }

  public selectedSubscriptions(subs: Subscription[]) {
    this.subscriptions = subs;
  }

  public fetchEvents() {
    this.loadingEvents = true;
    const params: EventFilter = {
      latest: true,
      limit: 100,
      subscriptions: this.subscriptions.map(e => e.id).join(',')
    };
    const options: HttpRequestOptions = {};
    this.eventingApi.getEvents(eventing.url, params, options)
      .subscribe(
        (events: EventResults) => this.events = events,
        error => this.loadingError = error,
        () => this.loadingEvents = false
      );
  }

}
