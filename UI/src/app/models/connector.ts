import { IRow } from 'src/app/models/row';
import { getSVGPoint } from '../services/utilites/draw-utilites';
import { DomAnalyzer } from '../services/dom-analyzer.service';

export interface IConnector {
  id: string;
  canvas: any;
  line: Element;
  button: Element;
  source: IRow;
  target: IRow;

  drawLine(): void;
  remove(): void;
  fixPosition(): void;
  active(): void;
  inactive(): void;
}

// What is Connector?
export class Connector implements IConnector {
  public canvas: any;
  public line: SVGLineElement;
  public button: Element;


  private domanalizer = new DomAnalyzer();

  constructor(public id: string, public source: IRow, public target: IRow) {
    this.canvas = document.querySelector('.canvas');
  }

  drawLine() {
    const source = this.domanalizer.checkAndChangeHtmlElement(this.source);
    const target = this.domanalizer.checkAndChangeHtmlElement(this.target);
    // TODO Check htmlElement for existance
    const sourceSVGPoint = getSVGPoint(source, this.canvas);
    const targetSVGPoint = getSVGPoint(target, this.canvas);

    const id = this.id;

    const { x: x1, y: y1 } = sourceSVGPoint;
    const { x: x2, y: y2 } = targetSVGPoint;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');

    line.setAttribute('x1', x1 + '');
    line.setAttribute('y1', y1 + '');
    line.setAttribute('x2', x2 - 6 + '');
    line.setAttribute('y2', y2 + '');
    line.setAttribute('id', id);
    line.setAttribute('marker-end', 'url(#arrow)');

    this.line = line;
    this.canvas.appendChild(line);
  }

  remove() {
    if (this.source) {
      this.source.removeConnections();
    }
    if (this.line) {
      this.line.remove();
    }
    if (this.button) {
      this.button.remove();
    }
  }

  fixPosition() {
    const sourceSVGPoint = getSVGPoint(this.source, this.canvas);
    const targetSVGPoint = getSVGPoint(this.target, this.canvas);

    const { x: x1, y: y1 } = sourceSVGPoint;
    const { x: x2, y: y2 } = targetSVGPoint;

    this.line.setAttribute('x1', x1 + '');
    this.line.setAttribute('y1', y1 + '');
    this.line.setAttribute('x2', x2 - 6 + '');
    this.line.setAttribute('y2', y2 + '');
  }

  // TODO Move
  active() {
    this.line.classList.add('line-active');
    this.line.removeAttribute('marker-end');
    this.line.setAttribute('marker-end', 'url(#arrow-active)');
    this.source.htmlElement.classList.add('row-active');
    this.target.htmlElement.classList.add('row-active');
  }

  // TODO Move
  inactive() {
    this.line.classList.remove('line-active');
    this.line.removeAttribute('marker-end');
    this.line.setAttribute('marker-end', 'url(#arrow)');
    this.source.htmlElement.classList.remove('row-active');
    this.target.htmlElement.classList.remove('row-active');
  }


}
