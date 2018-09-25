import { Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { D3TimeseriesGraphComponent } from '@helgoland/d3';
import { InternalDataEntry } from '@helgoland/d3/lib/d3-timeseries-graph/d3-timeseries-graph.component';
import { Event } from '@helgoland/eventing';

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
export class EventingDiagramComponent extends D3TimeseriesGraphComponent implements OnChanges {

  @Input()
  public events: Event[];

  @Input()
  public eventingIcon: EventingIcon;

  public ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (changes.events && this.events) {
      debugger; // TODO maybe clear prepared data
      this.plotGraph();
    }
  }

  protected plotGraph() {
    // TODO maybe prepare data
    // TODO enable tooltips: http://bl.ocks.org/d3noob/a22c42db65eb00d4e369
    super.plotGraph();
  }

  protected drawGraphLine(entry: InternalDataEntry) {
    super.drawGraphLine(entry);
    this.drawEvents(entry);
  }

  private drawEvents(entry: InternalDataEntry) {
    if (this.eventingIcon && this.events && this.events.length > 0) {
      const events = [
        [new Date(2018, 8, 18, 6).getTime(), 4]
      ];
      const yAxisRange = this.getYaxisRange(entry);
      this.graphBody.selectAll('.icon')
        .data(events.filter((d) => {
          return !isNaN(d[1]);
        }))
        .enter()
        .append('svg:image')
        .attr('transform', (d) => {
          const xDiagCoord = this.xScaleBase(d[0]);
          const yDiagCoord = yAxisRange.yScale(d[1]);
          return 'translate(' + (xDiagCoord - this.eventingIcon.width / 2) + ',' + (yDiagCoord - this.eventingIcon.height / 2) + ')';
        })
        .attr('width', this.eventingIcon.width)
        .attr('height', this.eventingIcon.height)
        .attr('xlink:href', this.eventingIcon.url)
        .on('mouseover', function (a, b, c) {
          debugger;
        })
        .on('mouseout', function (a, b, c) {
          debugger;
        })
        .on('mousedown', function (a, b, c) {
          debugger;
        });
    }
  }
}
