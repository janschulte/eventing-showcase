import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  KeyValueDiffers,
  OnChanges,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { DatasetApiInterface, Station, Timeseries } from '@helgoland/core';
import { Event, EventingApiService } from '@helgoland/eventing';
import { CachedMapComponent, MapCache } from '@helgoland/map';
import { Point } from 'geojson';
import { divIcon, FeatureGroup, featureGroup, marker } from 'leaflet';
import { forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';

interface EventGroup {
  station: Station;
  timeseriesMap: Map<string, TimeseriesEventMap>;
}

export interface TimeseriesEventMap {
  series: Timeseries;
  events: Event[];
}

@Component({
  selector: 'app-eventing-map',
  templateUrl: './eventing-map.component.html',
  styleUrls: ['./eventing-map.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EventingMapComponent extends CachedMapComponent implements AfterViewInit, OnChanges {

  @Input()
  public eventingUrl: string;

  @Input()
  public events: Event[];

  @Output()
  public eventSelected = new EventEmitter<TimeseriesEventMap[]>();

  private eventMap = new Map<string, EventGroup>();
  private markerGroup: FeatureGroup = featureGroup();

  constructor(
    protected mapCache: MapCache,
    protected differs: KeyValueDiffers,
    protected eventingApi: EventingApiService,
    protected datasetApi: DatasetApiInterface
  ) {
    super(mapCache, differs);
  }

  public ngAfterViewInit(): void {
    this.createMap();
    this.markerGroup.addTo(this.map);
  }

  public ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (changes.events && this.events && this.events.length > 0) {
      this.renderEvents();
    }
  }

  private renderEvents() {
    this.clearAll();
    if (!this.eventingUrl) {
      console.error('EventingMapComponent needs a eventingUrl as input.');
      return;
    }
    const getPubs = [];
    const getSeries = [];
    this.events.forEach(event => {
      if (event.publication.id === '608') { return; }
      getPubs.push(this.eventingApi.getPublication(event.publication.id, this.eventingUrl).pipe(tap(pub => {
        const url = pub.seriesHref.substr(0, pub.seriesHref.indexOf('timeseries'));
        getSeries.push(this.datasetApi.getSingleTimeseries(pub.id, url).pipe(tap(series => {
          this.addTimeseries(series, event);
        })));
      })));
    });
    forkJoin(getPubs).subscribe(() => {
      forkJoin(getSeries).subscribe(() => {
        this.eventMap.forEach(entry => {
          const point = entry.station.geometry as Point;
          const seriesList = Array.from(entry.timeseriesMap.values());
          const eventCount = seriesList.map(ts => ts.events.length).reduce((a, b) => a + b, 0);
          marker({ lat: point.coordinates[1], lng: point.coordinates[0] }, {
            icon: divIcon({
              className: 'my-div-icon',
              iconSize: [30, 30],
              html: `<img class="warn-marker" src="./assets/warn.png"/>
               <span class="warn-marker-label">${eventCount}</span>`
            }),
          }).addTo(this.markerGroup)
            .on('click', (evt) => this.eventSelected.emit(seriesList));
        });
      });
    });
  }

  private clearAll() {
    this.markerGroup.clearLayers();
    this.eventMap = new Map<string, EventGroup>();
  }

  private addTimeseries(series: Timeseries, event: Event) {
    if (this.eventMap.has(series.station.properties.id)) {
      const group = this.eventMap.get(series.station.properties.id);
      if (group.timeseriesMap.has(series.id)) {
        group.timeseriesMap.get(series.id).events.push(event);
      } else {
        group.timeseriesMap.set(series.id, { series, events: [event] });
      }
    } else {
      this.eventMap.set(series.station.properties.id, {
        station: series.station,
        timeseriesMap: new Map<string, TimeseriesEventMap>().set(series.id, { series: series, events: [event] })
      });
    }
  }

}
