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
import { DatasetApiInterface } from '@helgoland/core';
import { Event, EventingApiService } from '@helgoland/eventing';
import { CachedMapComponent, MapCache } from '@helgoland/map';
import { Point } from 'geojson';
import { circleMarker, divIcon, marker } from 'leaflet';

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
  public eventSelected = new EventEmitter<Event>();

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
  }

  public ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (changes.events && this.events && this.events.length > 0) {
      this.renderEvents();
    }
  }

  private renderEvents() {
    if (!this.eventingUrl) {
      console.error('EventingMapComponent needs a eventingUrl as input.');
      return;
    }
    this.events.forEach(event => {
      this.eventingApi.getPublication(event.publication.id, this.eventingUrl).subscribe(pub => {
        const id = pub.id;
        const url = pub.seriesHref.substr(0, pub.seriesHref.indexOf('timeseries'));
        this.datasetApi.getSingleTimeseries(id, url).subscribe(series => {
          const point = series.station.geometry as Point;
          // circleMarker({ lat: point.coordinates[1], lng: point.coordinates[0] })
          //   .addTo(this.map)
          //   .on('click', (evt) => this.eventSelected.emit(event));
          marker({ lat: point.coordinates[1], lng: point.coordinates[0] }, {
            icon: divIcon({
              className: 'my-div-icon',
              iconSize: [30, 30],
              html: `<img class="warn-marker" src="./assets/warn.png"/>`
                    //  <span class="warn-marker-label">1</span>`
            }),
          })
            .addTo(this.map)
            .on('click', (evt) => this.eventSelected.emit(event));
        });
      });
    });
  }

}