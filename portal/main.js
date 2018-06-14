import { registerApplication, start } from 'single-spa';
import { loader } from 'single-spa-angular-cli';
import 'babel-polyfill';

const applications = require('./applications.config.json');

function normalisePathName (pathname) {
    pathname = pathname.replace(/^\//, '')
    pathname = pathname.replace(/\/$/, '');
    return pathname;
}

for (const application of applications) {
    console.log(`registering ${application.name}`);
    registerApplication(
        application.name,
        (() => {
            const lifecycles = loader({
                name: application.name,
                selector: application.selector,
                baseHref: application.baseHref
            });
            return {
                bootstrap: [lifecycles.bootstrap],
                mount: [lifecycles.mount],
                unmount: [lifecycles.unmount],
                unload: [lifecycles.unload],
            };
        })(),
        () => {
            window["webpackJsonp"] = null; //FIXME: THIS IS NOT GOOD!
            return normalisePathName(window.location.pathname).startsWith(application.matchRoute);
        }
    );
}

start();
