## WebParty - A web application made for parties

---

### Backend structure

The backend structure is composed of 5 directories :

- `models` :
This directory contains all the models of the database 
> (e.g.: the user, post, ...)

- `middlewares` :
This directory consists of all the middlewares that will intercept requests
> (e.g.: an authentication middleware to manage private routes)

- `routes` :
This directory contains all the routes of the API. 
It does not include the logic of each route, but only the routes.
> (e.g.: a '/login' route will be stored here, but the logic of this route will be found at `services/login.ts`)

- `controllers` :
This directory contains the logic of each route.
> (e.g.: to create a user, there will be a file `controllers/users/post` with a function `postUser(...)` that will first check the data received and then create the user.)

- `services` :
This directory contains the functions to manage the database.
> (e.g.: the creation of a user in a file at `services/user/create.ts`).