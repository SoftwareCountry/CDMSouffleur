import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

import { CommonService } from 'src/app/services/common.service';
import { IRow } from 'src/app/models/row';

import { parseArrowKey } from './business/rules';
import { Arrow } from '../models/arrow';
import { IConnector } from '../models/interface/connector.interface';

@Injectable()
export class DrawService {
  get list(): { [key: string]: IConnector } {
    return Object.assign({}, this.cache);
  }

  private cache: { [key: string]: IConnector } = {};

  get listIsEmpty(): boolean {
    return Object.keys(this.cache).length === 0;
  }

  private renderer: Renderer2;
  constructor(
    private commonService: CommonService,
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  drawLine(entityId: string, source: IRow, target: IRow): IConnector {
    const canvas = this.commonService.svgCanvas;

    const drawEntity = new Arrow(
      canvas,
      entityId,
      source,
      target,
      this.renderer
    );

    if (!this.cache[entityId]) {
      this.cache[entityId] = drawEntity;
      drawEntity.draw();
    }

    return drawEntity;
  }

  deleteAllConnectors() {
    Object.keys(this.cache).forEach(key => {
      this.deleteConnector(key);
    });
  }

  deleteConnector(key) {
    this.cache[key].remove();
    delete this.cache[key];
  }

  deleteConnectorsBoundToTable({ id, area }) {
    Object.keys(this.cache).forEach(key => {
      const { sourceTableId, targetTableId } = parseArrowKey(key);

      switch (area) {
        case 'source': {
          if (id === +sourceTableId) {
            this.deleteConnector(key);
          }
          break;
        }
        case 'target': {
          if (id === +targetTableId) {
            this.deleteConnector(key);
          }
          break;
        }
      }
    });
  }
}
