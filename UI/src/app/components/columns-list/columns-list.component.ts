import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges
} from '@angular/core';
import { IRow } from 'src/app/models/row';
import { DataService } from 'src/app/services/data.service';
import { ValuesPopupComponent } from '../popaps/values-popup/values-popup.component';
import { OverlayService } from 'src/app/services/overlay/overlay.service';
import { OverlayConfigOptions } from 'src/app/services/overlay/overlay-config-options.interface';

@Component({
  selector: 'app-columns-list',
  templateUrl: './columns-list.component.html',
  styleUrls: ['./columns-list.component.scss']
})
export class ColumnsListComponent implements OnInit, OnChanges {
  @Input() sourceRows: IRow[];

  @Output() columnsSelected = new EventEmitter<string[]>();

  selectedColumns = [];

  constructor(
    private dataService: DataService,
    private overlayService: OverlayService
  ) {}

  ngOnInit() {}

  ngOnChanges() {}

  onSelectColumn(name: string) {
    const idx = this.selectedColumns.findIndex(x => x === name);
    if (idx > -1) {
      this.selectedColumns.splice(idx, 1);
    } else {
      this.selectedColumns.push(name);
    }

    this.selectedColumns = Object.assign([], this.selectedColumns);
    this.columnsSelected.emit(this.selectedColumns);
  }

  showTop10Values(event: any, htmlElement: any, item: IRow) {
    event.stopPropagation();

    const { tableName, name } = item;
    this.dataService.getTopValues(tableName, name).subscribe(result => {
      const component = ValuesPopupComponent;

      const dialogOptions: OverlayConfigOptions = {
        hasBackdrop: true,
        backdropClass: 'custom-backdrop',
        positionStrategyFor: 'values',
        payload: { items: result }
      };

      this.overlayService.open(dialogOptions, htmlElement, component);
    });
  }
}
