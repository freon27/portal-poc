import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { platformSingleSpa } from 'single-spa-angular-cli';

if (environment.production) {
  enableProdMode();
}

platformSingleSpa.mount('app2').subscribe(({ props, attachUnmount }) => {
  platformBrowserDynamic().bootstrapModule(AppModule).then((module) => {
    attachUnmount(module);
    // Do something with props if you want
    // Ex : module.instance.setSomething(...)
  }).catch(error => { console.log(error )});
});
