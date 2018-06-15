import {ApplicationRef, Component, NgZone, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-route2',
  template: `
    <h3>Route 2</h3>
    <p>Click the button to see me update component state</p>
    <button class="{{ currentState ? 'toggle-on' : 'toggle-off' }}" (click)="toggleState()">{{ currentState ? 'On' : 'Off' }}</button>
  `,
  styles: []
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
