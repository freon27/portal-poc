import {ApplicationRef, Component, NgZone, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-route2',
  template: `
    <p>Button route 2 child</p>
    <button (click)="toggleState()">Toggle State</button>
    <div *ngIf="currentState">ON</div>
    <div *ngIf="! currentState">OFF</div>
    {{ currentState }}
    <a routerLink="/route1">Route 1</a>
  `,
  styles: [],
  encapsulation: ViewEncapsulation.Native
})
export class Route2Component implements OnInit {

  public currentState = false;

  constructor(private app: ApplicationRef, private zone: NgZone) {
    this.currentState = false;
  }

  ngOnInit() {
  }

  toggleState() {

    console.log('angular zone', NgZone.isInAngularZone());

    //this.zone.run(() => {
    this.currentState = !this.currentState;
    //});
    console.log(this.currentState);

  }
}
