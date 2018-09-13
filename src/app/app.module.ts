import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BasicAuthInformer, HelgolandBasicAuthModule } from '@helgoland/auth';
import { HelgolandCoreModule, Settings, SettingsService } from '@helgoland/core';
import { EventingApiService, EventingImplApiInterface } from '@helgoland/eventing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { EventingBasicAuthInformerService } from './eventing-basic-auth-informer.service';
import { FetchEventsComponent } from './fetch-events/fetch-events.component';


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
    FetchEventsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    HelgolandBasicAuthModule,
    HelgolandCoreModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatListModule,
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
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
