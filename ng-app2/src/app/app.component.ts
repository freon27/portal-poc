import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app2-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class AppComponent {
  title = 'App 2';

  navigate(location) {
    history.pushState({}, '', location);
  }

  reverseIt() {
    this.title = this.title.split('').reverse().join('');
  }
}
