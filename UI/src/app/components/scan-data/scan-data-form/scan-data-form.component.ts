import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ConnectionResult } from '../model/connection-result';
import { TableToScan } from '../model/table-to-scan';
import { WhiteRabbitService } from '../../../services/white-rabbit.service';
import { DbSettings } from '../model/db-settings';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { SourceFormComponent } from './source-form/source-form.component';

@Component({
  selector: 'app-scan-data-form',
  templateUrl: './scan-data-form.component.html',
  styleUrls: ['./scan-data-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScanDataFormComponent implements OnInit {

  connectionResult: ConnectionResult = null;

  tablesToScan: TableToScan[] = [];

  connecting = false;

  @ViewChild(SourceFormComponent)
  sourceFormComponent: SourceFormComponent;

  constructor(private whiteRabbitService: WhiteRabbitService,
              private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  onTestConnection(dbSettings: DbSettings): void {
    this.connecting = true;
    this.whiteRabbitService.testConnection(dbSettings)
      .pipe(
        switchMap(connectionResult => {
          this.connectionResult = connectionResult;
          this.connecting = false;
          if (connectionResult.canConnect) {
            this.sourceFormComponent.subscribeFormChange();
            return this.whiteRabbitService.tablesInfo(dbSettings);
          } else {
            // todo open popup window with error message
            return of([]);
          }
        })
      )
      .subscribe(tablesToScan => {
        this.tablesToScan = tablesToScan;
        this.cdr.detectChanges();
      }, error => {
        this.tablesToScan = [];
      });
  }

  reset(): void {
    if (this.tablesToScan.length > 0) {
      this.tablesToScan = [];
    }
  }

  close(): void {

  }
}