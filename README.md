# Overseer
A project management tool meant to be used in tandem with [Kanbanik](http://kanbanik.github.io/kanbanik/)

## Installation 

### Configuration Files
  There are 3 files that need to be modified depending on where everything is located (Kanbanik, Database, and Where you want to deploy)
    '~/server.js' - The IP and port variables will need to be set, this is where the app will be deployed

    '~/config.json' - This is the IP where the MongoDB is located

    '~/app/ApiConfigInfo.js' - This is where the OverseerAPI is located (server.js ip and port) and where Kanbanik is running

### Dependencies (For just running the project remotely)
  NodeJS - Installed, check this by executing 'node' in the terminal`

  Compiled project (node_modules/, bower_components/ public/minified/ folders all full of files)

Dependencies (For working on the project, changing things etc etc)

  NodeJS - Installed locally in the home with the path set. Check this by executing 'node' in the terminal

  NPM - Configured to work with the firewall at COMPANY

  Bower - Configured to work with the firewall at COMPANY

    These configuration files can be found in the PackageManagementConfig folder 
      (Windows: Place them into your accounts root folder, Linux: Google it)

  Grunt - Installed globally

  Kanbanik - Needs to be running or the config file 'app/ApiConfigInfo.js' has to be configured to access Kabanik remotely

  MongoDB - Needs to be running or the config file 'config.json' has to be configured to look at the DB remotely

## How To Configure NPM and Bower to work with the firewall
  Take the files located in the PackageManagementConfig folder and drop them into your root folder

## Fresh Installation Instructions (node_modules/, bower_components/, public/minified/js/, public/minified/css/ folders empty/non-exsistant)
  Once you have NPM and Bower configured: 

    in the terminal of the root folder of the project (where server.js is located)

    execute 'npm install' without the quotes.  This will install all the dependencies required for the entire project

  Chances are both Grunt and Bower will install wrong, so if you cannot run the commands

    'bower install' or 'grunt'  

    then install them globally by running the command 'npm install –g bower' and 'npm install -g grunt'

## What is NPM, Bower and Grunt?
    NPM is the Node Package Manager, I am using it to pull the dependencies required for the API such as ExpressJS, Grunt, Mongoose, etc etc

    Bower is another package manager typically used for the front end of the site.  I am using it to pull in dependencies such as Angular and JQuery

    GruntJS is a JavaScript task runner.  And is used to "compile" the Angular app

      It is performing tasks to run tools such as  

        JSHint - A tool that helps detect errors and potential problems in the JavaScript code

        JSCS - A tool that makes sure all the code adheres to a specific code style (I am using Google's coding style)  

        NGAnnotate - A tool that allow Angular code to be minified (uglified)

        Uglify - Compiles multiple JavaScript and CSS files into a single file, this drastically increases speed when loading web pages

        Less - Compiles .less files into CSS.  This enables the uses of variables in CSS
        
  Okay I have NPM, Bower, and Grunt all installed, now what?

    Run 'grunt clean default'

      This will clear out previously minified files and recompile everything

    Run 'node server.js'

      The server should boot without errors and you should be able to see the Angular app on localhost:8081 (Or wherever you ip is set in server.js)


## Overseer - "Architecture"
Overseer is built with what is known as the MEAN stack (MongoDB, ExpressJS, AngularJS, NodeJS)

  The project is split in 2 parts: 

    API (MongoDB, ExpressJS, NodeJS) and an

    App (AngularJS)
### API
    The API's function is to READ from the DB, reconfigure the data, hold it in memory and serve it when asked for the data via a GET request

### APP
    The Apps function is to GET data from both the OverseerAPI and the KanbanikAPI and display this data to the user
    It also enables modifying and creating new data(tasks) by POSTing that data out to the KanabanikAPI

### API - "Architecture"
   One huge problem that I found with Kabanik was the fact that you could not fetch a single project, instead you have to get an entire board
    If you want the tasks a project has, you have to get an entire board and go through each task and match it to a projectId
    I wanted to get rid of all this complexity so that I can just access a users projects, or all tasks in one project etc etc. 
    That is the purpose of the API

    The Api uses 3 main tools, 
      NodeJS for executing JavaScript on the server
      ExpressJS for handling the routing and REST commands given to the API
      MongooseJS a wrapper class for MongoDB, simplifies fetching data from the DB

    Routing is handled by Controllers which access data through a Service

    Accessing data has 2 parts the Model and the Service
      Model - Imitates the Schema, provides functions for accessing the Data from the DB
      Service - Executes functions found in the Model and returns the JSON data from the DB, in some cases uses a helper to construct new objects
        Helpers - Construct in memory objects that enable finer filtering of data

    API Routes available. example using localhost ':_id' implies a variable

      Board
        'localhost:8080/api/board/'               fetches all boards as they are in the DB
        'localhost:8080/api/board/:_id'           fetches a board by id as it is in the db
        'localhost:8080/api/board/:_id/projects'  fetches a board with it's associated projects (constructed and kept in memory, not found in DB)
        'localhost:8080/api/board/:_id/tasks'     fetches all the tasks on the board 

      Project
        localhost:8080/api/project/               fetches all projects found on every board (constructed and kept in memory, not found in DB)
        localhost:8080/api/project/:_id           fetches a project by it's projectId (constructed and kept in memory, not found in DB)

      User
        localhost:8080/api/user/                  fetches all users found in the DB
        localhost:8080/api/user/:_id              fetches a user by id found in the db
        localhost:8080/api/user/:_id/projects     fetches all projects that a user has a task in (constructed and kept in memory, not found in DB)
        localhost:8080/api/user/:_id/tasks        fetches all tasks from the DB that are assigned to this user

      Status (classOfService in Kanbanik)
        localhost:8080/api/status/                fetches all the classOfService objects in the db
        localhost:8080/api/status/:_id            fetches the classOfService object with the associated id

    Folder Structure   
      The app enter at server.js
      'api/controllers/' handles all of the routing found above, based on a route it calls a method in a service
      'api/services/' when called upon the service calls a function found in the Model, which will fetch an object(s) from the DB
      'api/models/' store the schema of an object in the DB and inherits methods for fetching these from the MongooseJS framework
      'api/helpers/' used by the services to create the objects that are kept in memory, namely the projects
  
  
### APP - "Architecture"
    The app is a very standard AngularJS application, I tried to follow the standards when it comes to naming convention and folder structure
      More information on can be found here 'https://github.com/mgechev/angularjs-style-guide'

    The gist of it is that AngularJS there is the main '~/app/app.js' file that starts up the app and handles the routing
      Routing - What view(html) and controller(JS) to use when the user goes to specific url

    The folder structure is as follows
      '~/app/' is the root of the AngularJS app, and if you look at '~/server.js' you'll see that '/app/' is the default route
        This means that if the route 'localhost:8080/' is requested ExpressJS will serve the app.js file found in /app/
          As a result the AngularJS app will get served to the client, and voila you are now in the Angular app

      'app/assets/'             contains the images, JavaScript files that can't be found with bower, and the LESS style sheets
      'app/common/' contains    files that can be used on any page, and by any controller, they are commonly used by everything
      '   /common/directives/'  contains the navigation bar that is injected on every page 
      '   /common/services/'    contains our "data accesors" and manipulators these are the pieces of code GETting and POSTing data to our API's
      'app/dashboard/'          contains the controller and view for everything associated with the dashboard
      '   /dashboard/modals'    contains the controller and view for the modals that are used on the dashboard page
      'app/login/'              contains the controller and view for everything associated with the login page
      'app/public/'             contains all the minified 'compiled' files and the font files for FontAwesome

    Controllers - 'https://docs.angularjs.org/guide/controller'
      controllers handle all the 'business' logic found on an individual page.  I believe that this is the wrong paradigm, but it is what it is

    Services - 'https://docs.angularjs.org/guide/services'
      Handle the controlling of data, they are used to GET from the OverseerAPI and POST to the KanbanikAPI
        They are also used for converting edited/new tasks to a KanbanikTask object that is a datatype friendly with the KanbanikAPI

    Views(templates) - 'https://docs.angularjs.org/guide/templates'
      Are the HTML files, the user facing code

    Directives - 'https://docs.angularjs.org/guide/directive'
      Self contained views and controllers that are very easily 'injected' into a page

## TODO
  Refactor the projectHelper in the API
  Status on tasks are Read-Only and captured on the front end.  This should really be involved in the projectHelper section
  Completley remove Kanbanik and make this a stand alone application
  Refactor the entire backend
  Update to Angular2
