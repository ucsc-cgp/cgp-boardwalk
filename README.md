# UCSC Boardwalk


## Prerequisites
UCSC Boardwalk is an [Angular 2 app](http://angular.io), built with the [Angular CLI tool](https://github.com/angular/angular-cli).

The only prerequisite is [Node 4](https://nodejs.org/en/blog/release/v4.0.0/).

## Environment Setup

### 1. Clone the UCSC Boardwalk Repo

        git clone git@github.com:clevercanary/ucsc-boardwalk.git [folder_name]


### 2. Install Server-Side Dependencies

Use NPM to install server-side dependencies.

		npm install

From the `server` directory, install server-side typings:

		typings install


### 3. Install Client-Side Dependencies

Install Angular CLI if you don't have it already installed. Both of the following steps must be done with npm@3

		npm install -g angular-cli

Navigate to the `spa` directory and install client-side dependencies.

		npm install

### 4. Front End (Only) Development Server

To start the Angular 2 development server, run the following from the `spa` directory:

		npm start

You can hit the server at `http://localhost:4200`. Requests to `http://localhost:4200/api` will be proxied to `http://localhost:3000/api` according to the configuration in `proxy.conf.json`. More information can be found in the [angular-cli repository](https://github.com/angular/angular-cli).

### 5. Back End (Only) Development Server

To start Express, run the following from the root directory:

		grunt workon

This will run the express server on `http://localhost:3000`

### 6. Local HTTP-Proxy to Facet Service


The URL for the back end Azul Facet Service is configurable from the environment property ```BW_DATA_URL```. This can be set to the url of the server running the back end in the Gruntfile to run locally or on the boardwalk node.js server.

If this value is not set, the Boardwalk Angular client will assume the Facet Server is at the same url that served the front end, and make a relative request to /api/v1 to retrieve the facets and other configuration. 

To support this, on localhost, run the proxy.json file with `node proxy.json` This will start a proxy server at port 3001. ```proxy.conf.json``` in ```/spa``` is configured to forward requests to /api to the local node.js server at port 3000 and to send /api/v1 to requests to the proxy listening at port 3001.

The HTTP-Proxy on port 3001 is configured to send all requests to https://ucsc-cgp.org but this can be chaned as required.


``````
//
// Create a HTTP Proxy server with a HTTPS target
//
httpProxy.createProxyServer({
    target: 'https://ucsc-cgp.org',
    agent  : https.globalAgent,
    headers: {
        host: 'ucsc-cgp.org'
    }
}).listen(3001);
