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

Could we define the base in local storage? Or props passed to loader?

