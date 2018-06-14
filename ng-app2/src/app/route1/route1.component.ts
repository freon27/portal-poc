import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-route1',
  template: `
    <p>
      route1 works!
    </p>
    <a routerLink="/route2">Route 2</a>
  `,
  styles: [],
  encapsulation: ViewEncapsulation.Native
})
export class Route1Component implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
