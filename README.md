# UCSC Boardwalk


## Prerequisites
UCSC Boardwalk is an [Angular 5 app](http://angular.io), built with the [Angular CLI tool](https://github.com/angular/angular-cli).

The only prerequisite is a recent version of nodejs and npm say node 10.0.0 for example.

## Environment Setup

### 1. Clone the UCSC Boardwalk Repo

        git clone git@github.com:DataBiosphere/cgp-boardwalk.git [folder_name]


### 2. Install Client-Side Dependencies

Navigate to the `spa` directory and install client-side dependencies.

		npm install

### 4. Start the Development Server

To start the Angular.js development server, run the following from the `spa` directory:

		npm start

You can hit the server at `http://localhost:4200`


## Deploying

Deploying is done with the .travis.yml script. Currently the there is only one environment. See the .travis.yml file for details. 