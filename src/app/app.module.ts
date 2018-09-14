import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BasicAuthInformer, HelgolandBasicAuthModule } from '@helgoland/auth';
import {
  DatasetApiInterface,
  HelgolandCoreModule,
  Settings,
  SettingsService,
  SplittedDataDatasetApiInterface,
} from '@helgoland/core';
import { EventingApiService, EventingImplApiInterface } from '@helgoland/eventing';
import { HelgolandMapModule } from '@helgoland/map';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { EventingMapComponent } from './components/eventing-map/eventing-map.component';
import { FetchEventsComponent } from './components/fetch-events/fetch-events.component';
import { EventPresentationComponent } from './components/modals/event-presentation/event-presentation.component';
import { SubscriptionSelectorComponent } from './components/subscription-selector/subscription-selector.component';
import { EventingBasicAuthInformerService } from './eventing-basic-auth-informer.service';


@Injectable()
export class ExtendedSettingsService extends SettingsService<Settings> {
  constructor() {
    super();
    this.setSettings({
      datasetApis: []
    });
  }
}

@NgModule({
  declarations: [
    AppComponent,
    FetchEventsComponent,
    SubscriptionSelectorComponent,
    EventingMapComponent,
    EventPresentationComponent
  ],
  entryComponents: [
    EventPresentationComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    HelgolandBasicAuthModule,
    HelgolandCoreModule,
    HelgolandMapModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatListModule,
    MatDialogModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => new TranslateHttpLoader(http, './assets/i18n/', '.json'),
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    {
      provide: SettingsService,
      useClass: ExtendedSettingsService
    },
    {
      provide: EventingApiService,
      useClass: EventingImplApiInterface
    },
    {
      provide: BasicAuthInformer,
      useClass: EventingBasicAuthInformerService
    },
    {
      provide: DatasetApiInterface,
      useClass: SplittedDataDatasetApiInterface
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
