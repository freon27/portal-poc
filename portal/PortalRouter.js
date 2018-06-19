import Route from 'route-parser';

export class AlwaysTrueMatcher {
    match() {
        return true;
    }
}

export class PortalRouter {

    routeDefinitions = [];

    static normalisePath(pathname) {
        pathname = pathname.replace(/^\//, '');
        pathname = pathname.replace(/\/$/, '');
        return pathname;
    }

    constructor(appConfigurations) {
        this.routeDefinitions = appConfigurations.map((config) => {

            // Add /* to force it to ignore child routes
            const matchPath = `${PortalRouter.normalisePath(config.matchRoute)}/*portaldiscard`;

            return {
                appName: config.name,
                path: PortalRouter.normalisePath(config.matchRoute),
                routeMatcher: config.matchRoute === '**' ? new AlwaysTrueMatcher() : new Route(matchPath),
                basePath: config.baseHref,
            }
        });
    }

    match(appName, path) {
        path = PortalRouter.normalisePath(path);

        const appDefinition = this.routeDefinitions.find((el) => el.appName === appName);
        if(! appDefinition) {
            throw new Error('App name not found');
        }
        console.log(appName, path, appDefinition, appDefinition.routeMatcher.match(path + '/'));
        return appDefinition.routeMatcher.match(path + '/') !== false; // FIXME: sort out the / situation here!
    }

    portalLink(appName, path) {
        console.log(this.routeDefinitions);
        const app = this.routeDefinitions.find((el) => el.appName === appName);
        console.log('get link', app, path);
        if(! app) {
            throw new Error('App name not found');
        }
        return `/${PortalRouter.normalisePath(app.basePath)}/${PortalRouter.normalisePath(path)}`;
    }
}





