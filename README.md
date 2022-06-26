## Description

TL:DR - NPM install, NPM run start and you're good to go on localhost:3000.

- The API has been built using the [Nest](https://github.com/nestjs/nest) framework. It is written in TypeScript and is using MongoDB as the database technology. The set of provided JSON data (not the large) has been seeded into a cloud DB (MongoDB Atlas).

- For convenience, a .env file with the connection string necessary for the cloud db connection has been included. You just need to install node modules, run the app, and you're good to go.

- The app runs on `localhost: 3000`. The Accounts Module is the only one that has a controller. All endpoints are grouped under '/accounts'. As an example, to access 'get-account-information' the route will be `localhost:3000/accounts/get-account-information`. Route request verbs can be seen as decorators on the routes.

**TEST OBJECT ID's**

- Most of the endpoints need a request body where one or more ID (objectId) needs to be provided. For convenience I have included some below:

```bash
62b630f90b79300484f793c9
62b630f90b79300484f793c8
62b630f90b79300484f793ca
62b630f90b79300484f793cc
```

### Installation

```bash
$ npm install
```

### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

### Test

```bash
# unit tests
$ npm run test
```
