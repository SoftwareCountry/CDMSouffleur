import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { CommonService } from 'src/app/services/common.service';
import { IComment } from 'src/app/models/comment';

@Injectable()
export class CommentsService {
  comments = {
    source: {},
    target: {}
  }

  constructor(
    private commonService: CommonService,
    private store: Store<any>,
  ) {}

  prepareForCommenting() {
    // const {area, table, row} = this.commonService.activeRow;
    // const comments = this.comments;

    // if (!(table in comments[area])) {
    //   comments[area][table] = {};
    // }

    // const panelTable = comments[area][table];
    // if (!(row in panelTable)) {
    //   const r: any = panelTable[row] = {};
    //   r.comments = [];
    // }
  }

  addComment(destination, comment: IComment) {
    
    //this.comments[area][table][row].comments.push(comment);
  }

  hasComment(area: string, table: string, row: string) {
    //return this.commonService.state[area].ta
    // try {
    //   return !!this.comments[area][table][row].comments.length;
    // } catch (err) {
    //   return false;
    // }
  }

}
