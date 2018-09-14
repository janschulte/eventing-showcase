import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { EventingApiService, Subscription, SubscriptionResults } from '@helgoland/eventing';

import { eventing } from '../../../environments/credentials';

@Component({
  selector: 'app-subscription-selector',
  templateUrl: './subscription-selector.component.html',
  styleUrls: ['./subscription-selector.component.scss']
})
export class SubscriptionSelectorComponent implements OnInit {

  @ViewChild('subsElem')
  public subsElem: MatSelectionList;

  public subscriptions: SubscriptionResults;

  @Output()
  public selectedSubscriptionsChanged = new EventEmitter<Subscription[]>();

  constructor(
    private eventingApi: EventingApiService
  ) { }

  public ngOnInit() {
    this.fetchSubscriptions();
  }

  public selectionChange(change: MatSelectionListChange) {
    this.selectedSubscriptionsChanged.emit(change.source.selectedOptions.selected.map(e => e.value));
  }

  private fetchSubscriptions() {
    this.eventingApi.getSubscriptions(eventing.url)
      .subscribe(
        (subscriptions: SubscriptionResults) => this.subscriptions = subscriptions
      );
  }

}
