import { Injectable } from '@angular/core';
import { DatasetOptions, DatasetService, ColorService } from '@helgoland/core';

@Injectable({
  providedIn: 'root'
})
export class DiagramDatasetService extends DatasetService<DatasetOptions> {

  constructor(
    private color: ColorService
  ) {
    super();
  }

  protected createStyles(internalId: string): DatasetOptions {
    const option = new DatasetOptions(internalId, this.color.getColor());
    option.pointRadius = 3;
    option.lineWidth = 2;
    return option;
  }

  protected saveState(): void { }
  protected loadState(): void { }

}
