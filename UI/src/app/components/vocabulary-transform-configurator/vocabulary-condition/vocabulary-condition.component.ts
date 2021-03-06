import { Component, OnInit, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BaseComponent } from '../../base/base.component';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-vocabulary-condition',
  templateUrl: './vocabulary-condition.component.html',
  styleUrls: ['./vocabulary-condition.component.scss']
})
export class VocabularyConditionComponent extends BaseComponent
  implements OnInit {
  @Input() sourcefields: string[];
  @Input() operators = ['>', '<', '=', '!='];

  conditionValue = new FormControl();

  result: VocabularyConditionResult = {};

  constructor() {
    super();
  }

  ngOnInit() {
    this.conditionValue.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(value => {
        this.result.criteria = value;
      });
  }

  onSourceFieldSelected(field: any) {
    this.result.field = field.name;
  }
}

export interface VocabularyConditionResult {
  criteria?: any;
  field?: string;
  operator?: string;
}
