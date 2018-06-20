#Seamless Integration

##Interapp Communication

    - Redux?
    - NG Service that listens for portal events and dispatches change?

##Dynamic routing

- Have to have fixed mapping for app base to server. App name will stay the same but routing can vary. 
- How do we handle wildcards in paths?
- Get routes from backend

`/:test/:best/app`

    How can we set the app base when we don't know what it is?

`/app/:test/:best`

    this would work fine

We could define the base in local storage? Or possibly in props passed to loader?



If we have wildcards in paths then how does the webserver proxy correctly?
It would have to implement wildcard re-routing:
    
    1. Could that work?
    2. The webstart would have to download the service list so it could build 
       its own   
