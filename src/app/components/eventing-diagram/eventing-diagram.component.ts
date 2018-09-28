import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { D3TimeseriesGraphComponent } from '@helgoland/d3';
import { DataYRange, InternalDataEntry, YRanges } from '@helgoland/d3/lib/d3-timeseries-graph/d3-timeseries-graph.component';
import { Event } from '@helgoland/eventing';
import * as d3 from 'd3';
import * as moment from 'moment';

export interface EventingIcon {
  width: number;
  height: number;
  url: string;
}

@Component({
  selector: 'app-eventing-diagram',
  templateUrl: './eventing-diagram.component.html',
  styleUrls: ['./eventing-diagram.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EventingDiagramComponent extends D3TimeseriesGraphComponent implements OnChanges, AfterViewInit, OnDestroy {

  @Input()
  public events: Event[];

  @Input()
  public eventingIcon: EventingIcon;

  @Output()
  public eventSelected: EventEmitter<Event> = new EventEmitter();

  private tooltipDiv: d3.Selection<d3.BaseType, {}, HTMLElement, any>;

  public ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (changes.events && this.events) {
      // TODO maybe clear prepared data
      this.plotGraph();
    }
  }

  public ngAfterViewInit() {
    super.ngAfterViewInit();
    this.createTooltip();
  }

  public ngOnDestroy() {
    super.ngOnDestroy();
    this.tooltipDiv.remove();
  }

  protected drawGraphLine(entry: InternalDataEntry) {
    super.drawGraphLine(entry);
    this.drawEvents(entry);
  }

  private drawEvents(entry: InternalDataEntry) {
    if (this.eventingIcon && this.events && this.events.length > 0) {
      const yAxisRange = this.getYaxisRange(entry);
      this.graphBody.selectAll('.icon')
        .data(this.events.filter((d) => !isNaN(d.eventDetails.value)))
        .enter()
        .append('svg:image')
        .attr('transform', (d: Event) => this.calcEventPoint(d, yAxisRange))
        .attr('width', this.eventingIcon.width)
        .attr('height', this.eventingIcon.height)
        .attr('xlink:href', this.eventingIcon.url)
        .on('mouseover', (event: Event) => this.showTooltip(event))
        .on('mouseout', () => this.hideTooltip())
        .on('click', (event: Event) => this.eventSelected.emit(event));
    }
  }

  private calcEventPoint(d: Event, yAxisRange: YRanges | DataYRange) {
    const xDiagCoord = this.xScaleBase(d.timestamp);
    const yDiagCoord = yAxisRange.yScale(d.eventDetails.value);
    return 'translate(' + (xDiagCoord - this.eventingIcon.width / 2) + ',' + (yDiagCoord - this.eventingIcon.height / 2) + ')';
  }

  private createTooltip() {
    this.tooltipDiv = d3.select('body').append('div')
      .attr('class', 'event-tooltip')
      .style('opacity', 0);
  }

  private showTooltip(event: Event) {
    this.tooltipDiv.transition()
      .duration(200)
      .style('opacity', .9);
    this.tooltipDiv.html(
      event.label + '<br/>' +
      'Time:' + moment(event.timestamp).format('HH:mm') + '<br/>' +
      'Value:' + event.eventDetails.value
    )
      .style('left', (d3.event.pageX) + 'px')
      .style('top', (d3.event.pageY - 28) + 'px');
  }

  private hideTooltip() {
    this.tooltipDiv.transition()
      .duration(500)
      .style('opacity', 0);
  }
}
