import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { BasicAuthServiceMaintainer } from '@helgoland/auth';
import { HttpRequestOptions } from '@helgoland/core';
import { EventFilter, EventingApiService, EventResults, Subscription } from '@helgoland/eventing';
import { latLng, latLngBounds } from 'leaflet';

import { eventing } from '../../../environments/credentials';
import { TimeseriesEventMap } from '../../components/eventing-map/eventing-map.component';
import { EventPresentationComponent } from '../../components/modals/event-presentation/event-presentation.component';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements OnInit {

  public events: EventResults;
  public loadingEvents: boolean;
  public loadingError: string;
  public bounds: L.LatLngBoundsExpression;

  public eventingUrl = eventing.url;

  public subscriptions: Subscription[] = [];

  public displayedColumns: string[] = ['id', 'timestamp', 'label', 'eventType', 'publication', 'subscription'];

  constructor(
    private basicAuthServiceMaintainer: BasicAuthServiceMaintainer,
    private eventingApi: EventingApiService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.basicAuthServiceMaintainer.registerService(eventing.url);
    this.bounds = latLngBounds(latLng(51, 7), latLng(52, 8));
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

  public showEvent(timeseriesEvents: TimeseriesEventMap[]) {
    this.dialog.open(EventPresentationComponent, {
      data: { timeseriesEvents }
    });
  }

}
