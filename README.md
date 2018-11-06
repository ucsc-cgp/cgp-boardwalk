# UCSC Boardwalk


## Prerequisites
UCSC Boardwalk is an [Angular 5 app](http://angular.io), built with the [Angular CLI tool](https://github.com/angular/angular-cli).

The only prerequisite is [Node 4](https://nodejs.org/en/blog/release/v4.0.0/).

## Environment Setup

### 1. Clone the UCSC Boardwalk Repo

        git clone git@github.com:clevercanary/ucsc-boardwalk.git [folder_name]


### 2. Install Client-Side Dependencies

Install Angular CLI if you don't have it already installed. Both of the following steps must be done with npm@5+

		npm install -g angular-cli

Navigate to the `spa` directory and install client-side dependencies.

		npm install

### 4. Front End (Only) Development Server

To start the Angular 2 development server, run the following from the `spa` directory:

		npm start

You can hit the server at `http://localhost:4200`. Requests to `http://localhost:4200/api` will be proxied to `http://localhost:3000/api` according to the configuration in `proxy.conf.json`. More information can be found in the [angular-cli repository](https://github.com/angular/angular-cli).



```npm start``` in the /spa directory will launch the http-proxy for you and also start the local Angular dev server.


``````
