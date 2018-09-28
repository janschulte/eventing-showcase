import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BasicAuthInformer, HelgolandBasicAuthModule } from '@helgoland/auth';
import { HelgolandCachingModule } from '@helgoland/caching';
import {
  DatasetApiInterface,
  HelgolandCoreModule,
  Settings,
  SettingsService,
  SplittedDataDatasetApiInterface,
} from '@helgoland/core';
import { HelgolandD3Module } from '@helgoland/d3';
import { EventingApiService, EventingImplApiInterface } from '@helgoland/eventing';
import { HelgolandMapModule } from '@helgoland/map';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { EventingDiagramComponent } from './components/eventing-diagram/eventing-diagram.component';
import { EventingMapComponent } from './components/eventing-map/eventing-map.component';
import { EventPresentationComponent } from './components/modals/event-presentation/event-presentation.component';
import { SubscriptionSelectorComponent } from './components/subscription-selector/subscription-selector.component';
import { EventingBasicAuthInformerService } from './eventing-basic-auth-informer.service';
import { DiagramViewComponent } from './views/diagram-view/diagram-view.component';
import { MapViewComponent } from './views/map-view/map-view.component';

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
    SubscriptionSelectorComponent,
    EventingMapComponent,
    EventPresentationComponent,
    MapViewComponent,
    DiagramViewComponent,
    EventingDiagramComponent
  ],
  entryComponents: [
    EventPresentationComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    HelgolandBasicAuthModule,
    HelgolandCachingModule,
    HelgolandCoreModule,
    HelgolandD3Module,
    HelgolandMapModule,
    MatButtonModule,
    MatDialogModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatTabsModule,
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
