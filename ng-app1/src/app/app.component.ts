import { Component } from '@angular/core';

@Component({
  selector: 'app1-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'App 1';

  navigate(location) {
    history.pushState({}, '', location);
  }

  reverseIt() {
    this.title = this.title.split('').reverse().join('');
  }
}
