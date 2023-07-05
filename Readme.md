Login/SignUp Documentation

JSAuth Server is an Express.js server that provides authentication APIs for user registration and login. It utilizes MongoDB as the database for storing user information.

Installation
To install the dependencies, run the following command:
npm install

Configuration
Before running the server, make sure to set the following environment variables:

MONGODB_URL: The MongoDB connection URL for the database.
CLIENT_URL: The URL of the client application for CORS configuration.
API Endpoints
The server provides the following API endpoints:

Authentication Endpoints
POST /api/auth/signup: Creates a new user account.

Request body parameters:
name: The name of the user.
email: The email address of the user.
password: The password for the user account.
confirmPassword: The confirmation password for the user account.
Returns:
success: Indicates if the operation was successful.
data: The created user data.
message: Error message if the operation failed.
POST /api/auth/signin: Authenticates a user and generates a JWT token.

Request body parameters:
email: The email address of the user.
password: The password for the user account.
Returns:
success: Indicates if the operation was successful.
data: The user data (excluding password).
message: Error message if the operation failed.
token: JWT token to be used for subsequent authenticated requests (sent via a cookie).
Miscellaneous Endpoints
GET /: Returns a simple JSON response indicating that the server is running.
Usage
To start the server, run the following command:
npm start
By default, the server runs on port 3000. You can access the API endpoints using the specified routes.

Note: Make sure to have MongoDB running and the configuration variables set correctly before starting the server.

Create a .env file in the root directory of the project.
Define the required environment variables in the .env file. For example:
PORT: The port number on which the server should listen (default: 5000).
Other environment variables required for your specific configuration, such as MONGODB_URL and CLIENT_URL.
API Endpoints
The server provides the following API endpoints:

Authentication Endpoints
POST /api/auth/signup: Creates a new user account.

Request body parameters:
name: The name of the user.
email: The email address of the user.
password: The password for the user account.
confirmPassword: The confirmation password for the user account.
Returns:
success: Indicates if the operation was successful.
data: The created user data.
message: Error message if the operation failed.
POST /api/auth/signin: Authenticates a user and generates a JWT token.

Request body parameters:
email: The email address of the user.
password: The password for the user account.
Returns:
success: Indicates if the operation was successful.
data: The user data (excluding password).
message: Error message if the operation failed.
token: JWT token to be used for subsequent authenticated requests (sent via a cookie).
Miscellaneous Endpoints
GET /: Returns a simple JSON response indicating that the server is running.
By default, the server runs on the specified port (default: 5000). You can access the API endpoints using the specified routes.

Routes
Sign Up - POST /signup
Creates a new user account.

Request Method: POST
Request URL: /signup
Request Body Parameters:
name (required): The name of the user.
email (required): The email address of the user.
password (required): The password for the user account.
confirmPassword (required): The confirmation password for the user account.
Sign In - POST /signin
Authenticates a user and generates a JWT token.

Request Method: POST
Request URL: /signin
Request Body Parameters:
email (required): The email address of the user.
password (required): The password for the user account.
Get User - GET /user
Retrieves user information for an authenticated user.

Request Method: GET
Request URL: /user
Authorization: Bearer Token (JWT token)
Response: The user data (excluding password) for the authenticated user.
Logout - GET /logout
Logs out an authenticated user by invalidating the JWT token.

Request Method: GET
Request URL: /logout
Authorization: Bearer Token (JWT token)
Response: Success message indicating the user has been logged out.
Middlewares
The following middleware is used in the authRouter:

jwtAuth
A custom middleware that verifies the JWT token for authenticated routes.

Middleware: jwtAuth
Usage: Applied to the routes that require authentication (/user, /logout).
Functionality: Verifies the JWT token provided in the Authorization header.
Behavior:
If the token is valid and not expired, the user is considered authenticated and allowed to access the protected routes.
If the token is missing, invalid, or expired, the user is denied access and receives an error response.

User Model Documentation
The userModel represents the schema and methods for the User model in the MongoDB database.

Schema
The User schema defines the structure of the User model with the following fields:

name (String, required): The name of the user.
email (String, required): The email address of the user.
password (String, required): The hashed password of the user.
forgetPasswordToken (String): Token used for password reset.
forPasswordExpiryDate (Date): Expiry date for the password reset token.
timestamps (Boolean, default: true): Adds createdAt and updatedAt fields to track document timestamps.
Middleware
The following middleware is used in the userSchema:

pre('save')
A pre-save middleware that encrypts the password before saving the user.

Middleware: pre('save')
Usage: Automatically executed before saving a user to the database.
Functionality: Hashes the user's password using bcrypt with a salt factor of 10.
Behavior: If the password field is modified, the password is hashed; otherwise, the middleware moves to the next middleware.
Methods
The userSchema defines a jwtToken method used to generate a JWT token for the user.

jwtToken()
Generates a JWT token for the user.

Method: jwtToken()
Usage: Invoked on a user instance to generate a JWT token.
Returns: The JWT token containing the user's ID and email, signed with the secret key defined in the environment variable process.env.SECRET.
Expiry: The token expires after 24 hours.
Model
The userModel is created using the userSchema and represents the User model in the MongoDB database.

JWT Authentication Middleware Documentation
The jwtAuth middleware is used for verifying and authenticating user access using JSON Web Tokens (JWT).

Middleware
The jwtAuth middleware is responsible for the following functionality:

Verifying the presence and validity of the JWT token in the request cookies.
Extracting the payload from the token and setting it in the req.user object for further use in the request handling.
Usage
The jwtAuth middleware is typically used as a middleware function in routes that require authentication. It can be added to any route or router using the app.use() or router.use() methods.

Export
The userModel is exported as the default module.

app.use('/protectedRoute', jwtAuth, protectedRouteHandler);

Authorization
The middleware checks for the presence of a valid JWT token in the request cookies. If a token is not found or is invalid, the middleware sends a 400 status response with a failure message, indicating that the user is not authorized.

Payload Extraction
If a valid token is found, the middleware verifies the token using the secret key specified in the environment variable process.env.SECRET. Upon successful verification, the middleware extracts the payload from the token and sets it in the req.user object. The payload typically contains the user's ID and email.

req.user = { id: payload.id, email: payload.email };

req.user = { id: payload.id, email: payload.email };

Export
The jwtAuth middleware is exported as the default module.

Authentication Controller Documentation
The authentication controller handles user signup, signin, getting user details, and user logout.

Signup
The signup function is responsible for creating a new user account in the database.

Method: POST
Route: /signup
Request Body
name (String): User's name (required)
email (String): User's email (required)
password (String): User's password (required)
confirmPassword (String): Confirm password (required)
Response
Success: 200

success (Boolean): true
data (Object): Created user object
Failure: 400

success (Boolean): false
message (String): Error message
Signin
The signin function is responsible for user authentication and generating a JWT token.

Method: POST
Route: /signin
Request Body
email (String): User's email (required)
password (String): User's password (required)
Response
Success: 200

success (Boolean): true
data (Object): Authenticated user object
token (String): JWT token in a cookie
Failure: 400

success (Boolean): false
message (String): Error message
Get User
The getUser function is responsible for retrieving user details.

Method: GET
Route: /user
Middleware: jwtAuth (JWT authentication middleware)
Response
Success: 200

success (Boolean): true
data (Object): User object
Failure: 400

success (Boolean): false
message (String): Error message
Logout
The logout function is responsible for logging out the user by clearing the token cookie.

Method: GET
Route: /logout
Middleware: jwtAuth (JWT authentication middleware)
Response
Success: 200

success (Boolean): true
message (String): "Logged Out"
Failure: 400

success (Boolean): false
message (String): Error message

Database Connection Configuration Documentation
The database connection configuration handles the connection to the MongoDB database.

Database Connect
The databaseConnect function is responsible for establishing a connection to the MongoDB database.

Method
mongoose.connect() is used to connect to the database.
Environment Variables
MONGODB_URL (String): MongoDB connection URL. If not provided, it defaults to 'mongodb://localhost:27017/pw_signin_up_database'.

const databaseConnect = require('./config/databaseConnect');

databaseConnect();
const databaseConnect = require('./config/databaseConnect');

databaseConnect();
