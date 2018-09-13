import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelectionList } from '@angular/material/list';
import { BasicAuthServiceMaintainer } from '@helgoland/auth';
import { HttpRequestOptions } from '@helgoland/core';
import { EventFilter, EventingApiService, EventResults, Subscription, SubscriptionResults } from '@helgoland/eventing';

import { eventing } from '../../environments/credentials';

@Component({
  selector: 'app-fetch-events',
  templateUrl: './fetch-events.component.html',
  styleUrls: ['./fetch-events.component.scss']
})
export class FetchEventsComponent implements OnInit {

  @ViewChild('subsElem')
  public subsElem: MatSelectionList;

  public events: EventResults;
  public loadingEvents: boolean;
  public loadingError: string;

  public displayedColumns: string[] = ['id', 'timestamp', 'label', 'eventType', 'publication', 'subscription'];

  public subscriptions: SubscriptionResults;

  public subsControl = new FormControl();

  constructor(
    private basicAuthServiceMaintainer: BasicAuthServiceMaintainer,
    private eventingApi: EventingApiService
  ) { }

  ngOnInit() {
    this.basicAuthServiceMaintainer.registerService(eventing.url);
    this.fetchSubscriptions();
  }

  public fetchSubscriptions() {
    this.eventingApi.getSubscriptions(eventing.url)
      .subscribe(
        (subscriptions: SubscriptionResults) => this.subscriptions = subscriptions
      );
  }

  public fetchEvents() {
    const subIds = this.subsElem.selectedOptions.selected.map(e => (e.value as Subscription).id).join(',');
    this.loadingEvents = true;
    const params: EventFilter = {
      limit: 100,
      subscriptions: subIds
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
