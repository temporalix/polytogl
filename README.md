# \<polytog\>

polymer toggl client

## Install Node

First, make sure you have the [Node](https://nodejs.org/en/) installed.

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `polymer serve` to serve your application locally.


## Setup

1. install node modules with 

```
$ npm install
```

2. navigate to client folder and install bower components with

```
$ bower install
```

3. add your toggl token

```
$ change #toggltoken# to your token located in your toggl settings
```

4. run the http server, after which you can polymer serve to view the application

```
$ npm run start
```

## Viewing Your Application

```
$ polymer serve
```

## Building Your Application

```
$ polymer build
```

This will create builds of your application in the `build/` directory, optimized to be served in production. You can then serve the built versions by giving `polymer serve` a folder to serve from:

```
$ polymer serve build/default
```

## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.
