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


## Hosting Setup

Boardwalk is setup to be hosted in "serverless" manner using S3 buckets to host the index.html and other site artifacts. This S3 bucket is setup to be behind an AWS Cloudfront instance that provides caching and also allows the related documentation portal to be deployed on the same sub domain as the Boardwalk application.


## Deploying

Deploying is done with the .travis.yml script. Currently the there is only one environment for the `serverless` git branch. See the .travis.yml file for details. The script runs automatically on pushing to the serverless branch on github.

Pushing to the git repo triggers a build and then a deploy. The build is run using the Angular CLI. The deploy is run by pushing the build artifacts to the the AWS S3 bucket for the appropriate environment and then invalidates the cache.



