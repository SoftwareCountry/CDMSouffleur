import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TableToScan } from '../../../model/table-to-scan';

@Component({
  selector: 'app-table-to-scan',
  templateUrl: './table-to-scan.component.html',
  styleUrls: ['./table-to-scan.component.scss', '../../../scan-data-check.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableToScanComponent {
  @Input()
  table: TableToScan;

  get tableName() {
    return this.table.tableName;
  }

  get selected() {
    return this.table.selected;
  }

  @Output()
  checkTable = new EventEmitter<string>();
}