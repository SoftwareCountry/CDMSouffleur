import {
  Component,
  Input,
  OnInit,
  ViewChild,
  OnChanges,
  Output,
  EventEmitter
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteTrigger, MatAutocomplete } from '@angular/material';
import { BaseComponent } from '../base/base.component';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-comfy-search-by-name',
  templateUrl: './comfy-search-by-name.component.html',
  styleUrls: ['./comfy-search-by-name.component.scss']
})
export class ComfySearchByNameComponent extends BaseComponent
  implements OnInit, OnChanges {
  @Input() criteria = '';
  @Input() placeholder = '';

  @Output() complete = new EventEmitter<Criteria>();
  @Output() reset = new EventEmitter<Criteria>();

  @ViewChild('nameSearchInput', { read: MatAutocompleteTrigger })
  private autoCmpltTrg: MatAutocompleteTrigger;

  @ViewChild(MatAutocomplete)
  private autoCmplt: MatAutocomplete;

  private model: any;

  dbNameFormControl: FormControl = new FormControl();
  filteredNames: string[];

  ngOnInit() {
    if (!this.criteria) {
      this.criteria = '';
    }

    this.dbNameFormControl.setValue(this.criteria);

    this.dbNameFormControl.valueChanges.subscribe(criteria => {
      this.criteria = criteria;
    });

    this.autoCmplt.optionSelected
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(token => {
        this.criteria = token.option.value;
        this.search(this.criteria);
      });
  }

  ngOnChanges() {
    this.dbNameFormControl.setValue(this.criteria);
  }

  search(textCriteria: string) {
    const searchCriteria: Criteria = {
      filtername: 'by-name',
      criteria: textCriteria
    };
    this.complete.emit(searchCriteria);
    this.autoCmpltTrg.closePanel();
  }

  clear(): void {
    this.dbNameFormControl.reset();

    this.criteria = '';

    const searchCriteria: Criteria = {
      filtername: 'by-name',
      criteria: this.criteria
    };

    this.reset.emit(searchCriteria);
  }
}

export interface Criteria {
  filtername: string;
  criteria: string;
}
