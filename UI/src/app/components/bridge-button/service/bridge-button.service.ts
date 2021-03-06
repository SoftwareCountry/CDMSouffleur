// Legacy
import { Injectable, ElementRef } from '@angular/core';

import { IConnector } from '../../../models/interface/connector.interface';
import { OverlayService } from 'src/app/services/overlay/overlay.service';
import { TransformRulesData } from '../../popaps/rules-popup/model/transform-rules-data';
import { RulesPopupComponent } from '../../popaps/rules-popup/rules-popup.component';
import { TransformConfigComponent } from '../../vocabulary-transform-configurator/transform-config.component';
import { OverlayConfigOptions } from 'src/app/services/overlay/overlay-config-options.interface';
import { BridgeButtonData } from '../model/bridge-button-data';
import { ConceptService, isConceptTable } from '../../comfy/services/concept.service';
import { CommonService } from 'src/app/services/common.service';

@Injectable()
export class BridgeButtonService {
  drawEntity: IConnector;
  active = false;

  private payloadObj: TransformRulesData;
  private insnantiationType = {
    transform: RulesPopupComponent,
    lookup: TransformConfigComponent
  };
  private component: any;

  private dialogOptions: OverlayConfigOptions;
  private ancor: any;

  constructor(
    private overlayService: OverlayService,
    private commonService: CommonService
  ) {}

  init(payload: BridgeButtonData, element: Element) {
    this.payloadObj = {
      connector: payload.connector,
      arrowCache: payload.arrowCache
    };

    this.dialogOptions = {
      disableClose: true,
      hasBackdrop: true,
      backdropClass: 'custom-backdrop',
      panelClass: 'transformation-unit',
      positionStrategyFor: 'simple-transform',
      payload: this.payloadObj
    };

    this.component = this.insnantiationType.transform;
    this.ancor = element;

    if (isConceptTable(payload.connector.target.tableName)) {
      this.component = this.insnantiationType.lookup;
      this.dialogOptions.positionStrategyFor = 'advanced-transform';
      this.ancor = this.commonService.mappingElement.nativeElement;
    }
  }

  openRulesDialog() {
    this.payloadObj.connector.select();

    const dialogRef = this.overlayService.open(
      this.dialogOptions,
      this.ancor,
      this.component
    );

    dialogRef.close$.subscribe((configOptions: any) => {
      const { deleted } = configOptions;
      if (!deleted) {
        this.payloadObj.connector.deselect();
      }
    });
  }
}
