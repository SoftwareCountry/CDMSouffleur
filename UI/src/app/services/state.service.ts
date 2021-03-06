import { Injectable } from '@angular/core';
import { ITable} from '../models/table';
import { ConceptService } from '../components/comfy/services/concept.service';

export interface IState {
  source: StateItem;
  target: StateItem;
}

export interface StateItem {
  tables: ITable[];
}

@Injectable()
export class StateService {
  get Target(): any {
    return this.target;
  }

  set Target(target: any) {
    this.target = target;
  }

  private target = {};

  get initialized(): boolean {
    return (
      this._state.source.tables.length > 0 &&
      this._state.target.tables.length > 0
    );
  }

  get state(): IState {
    if (this._state) {
      return this._state;
    }
  }

  private _state: IState = {
    source: {
      tables: []
    },
    target: {
      tables: []
    }
  };

  private switched = false;

  constructor(private conceptService: ConceptService) {

  }

  initialize(tables: any[], area: string) {
    this._state[area].tables = tables;

    if (area === 'target' && this._state[area].tables.length > 0) {
      const res = this.conceptService.initSpecialtables();
      this._state[area].tables = res.concat.apply(res, this._state[area].tables);
    }
  }

  findTable(name: string): ITable {
    const index1 = this.state.target.tables.findIndex(t => t.name === name);
    const index2 = this.state.source.tables.findIndex(t => t.name === name);
    if (index1 > -1) {
      return this.state.target.tables[index1];
    } else if (index2 > -1) {
      return this.state.source.tables[index2];
    }

    return null;
  }

  switchSourceToTarget() {
    if (!this.switched) {
      this.switched = true;
      const temp = [...this.state.source.tables];
      this.state.source.tables = [...this.state.target.tables];
      this.state.target.tables = temp;
    }

  }

  // switchTargetToSource() {
  //   const temp = [...this.state.target.tables];
  //   this.state.target.tables = [...this.state.source.tables];
  //   this.state.source.tables = temp;
  // }
}
