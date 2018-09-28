import { Component, OnInit } from '@angular/core';
import { Timespan } from '@helgoland/core';
import { D3PlotOptions, HoveringStyle } from '@helgoland/d3';
import { EventFilter, EventingApiService, EventResults, Subscription } from '@helgoland/eventing';

import { eventing } from '../../../environments/credentials';
import { EventingIcon } from '../../components/eventing-diagram/eventing-diagram.component';
import { DiagramDatasetService } from '../../diagram-dataset.service';

const ID_prefix = 'http://fluggs.wupperverband.de/sos2/api/v1/__';
@Component({
  selector: 'app-diagram-view',
  templateUrl: './diagram-view.component.html',
  styleUrls: ['./diagram-view.component.scss']
})
export class DiagramViewComponent implements OnInit {

  // diagram component
  public timespan: Timespan;

  public graphOptions: D3PlotOptions = {
    showTimeLabel: false,
    hoverStyle: HoveringStyle.point
  };

  public overviewOptions: D3PlotOptions = {
    overview: true,
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
    public datasetSrvc: DiagramDatasetService
  ) { }

  ngOnInit() {
    const end = new Date().getTime();
    const start = end - 1000 * 60 * 60 * 24 * 2;
    this.timespan = new Timespan(start, end);
  }

  public selectedSubscriptions(subs: Subscription[]) {
    this.subscriptions = subs;
    this.addDatasets();
  }

  private addDatasets() {
    const ids = this.subscriptions.map(e => ID_prefix + e.notification.publication.id).filter((e, i, a) => a.indexOf(e) === i);
    // remove old datasets
    this.datasetSrvc.datasetIds.filter(e => ids.indexOf(e) < 0).forEach(e => { this.datasetSrvc.removeDataset(e); });
    ids.forEach(id => {
      if (this.datasetSrvc.datasetIds.indexOf(id) < 0) {
        this.datasetSrvc.addDataset(id);
      }
    });
  }

  public fetchEvents() {
    this.loadingEvents = true;
    const params: EventFilter = {
      latest: true,
      limit: 100,
      subscriptions: this.subscriptions.map(e => e.id),
      expanded: true
    };
    this.eventingApi.getEvents(eventing.url, params)
      .subscribe(
        (events: EventResults) => this.events = events,
        error => this.loadingError = error,
        () => this.loadingEvents = false
      );
  }

}
