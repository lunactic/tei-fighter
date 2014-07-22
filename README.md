# <span class="brand">DivaDiaWT</span>: a TEI web application


`TEI - Fighter` is a web framework for creating and editing `TEI` files. 
More information on [TEI Site]("http://www.tei-c.org/index.xml).

## Installation:

TEI - Fighter is a web based application. The project itself does not contain external libraries such [AngularJS]("http://angularjs.org") or [Paper.js]("http://paperjs.org"). With *Bower* package manager can be easily installed.

### Requirements for getting external libraries given bower:

- **[NodeJs](http://nodejs.org/)**. In debian based distribution `sudo apt-get install nodejs`.
- **[NPM]()** Node Package Manager in order to install bower. In Debian (Ubuntu, Mint, ...) `sudo aptitude install npm`.
- **[bower](https://github.com/bower/bower)**. `sudo npm intall -g bower`. Bower uses node binary, in some distributions node is renamed to nodejs. This can be solved adding a link `sudo ln -s /usr/bin/node{js,}`.
- **GIT**. The bower dependencies are installed via git. (Usually they rely on github).

### Install the libraries via bower
Once bower is correctly installed just use
`bower install`.

### Getting the libraries without bower
At this point, if bower is not available or not working correctly, you can download the dependency libraries of their official web. (In future version we will try to add a downloadable file with all the libraries.)

Download the libraries an add them at the src/vendor directory.

At this point the vendor directory should look like this (at least this files will be needed):
```
.
├── angular
│   ├── angular.js
│   ├── angular.min.js
├── bootstrap
│   ├── dist
│       ├── css
│       │   ├── bootstrap.css
│       │   ├── bootstrap.css.map
│       │   ├── bootstrap.min.css
│       │   ├── bootstrap-theme.css
│       │   ├── bootstrap-theme.css.map
│       │   └── bootstrap-theme.min.css
│       ├── fonts
│       │   ├── glyphicons-halflings-regular.eot
│       │   ├── glyphicons-halflings-regular.svg
│       │   ├── glyphicons-halflings-regular.ttf
│       │   └── glyphicons-halflings-regular.woff
│       └── js
│           ├── bootstrap.js
│           └── bootstrap.min.js
├── jquery
│   ├─ dist
│       └── js
│           ├── bootstrap.js
│       ├── jquery.js
│       ├── jquery.min.js
│       └── jquery.min.map
└── paper
    ├── dist
        ├── paper-core.js
        ├── paper-core.min.js
        ├── paper-full.js
        ├── paper-full.min.js
        └── paper.js
```

## Running the application in a local server.
Despite of the application can by used loading the index as a local file, it is included a very light server script (based on node) that creates an instance of the application o the port 8000 by default.

`node scripts/webserver.js`

open a web browser, type `http://localhost:8000/index.html` and enjoy!!
