# Project e-commerce

## Description 😲
Implementation of RESTful APIs for E-commerce.
Data Modelling: Efficient data modeling techniques for handling products, users, orders, category.

# Features 🎖️
- Authentication with JWT RefreshToken & AcessToken (Reset Password with email)
- Login (User/Admin)
- Register
- Forgot Password
- Admin Routes
- CRUD Operations 
- Pagination and search where necessary
- API Security (NoSQL Injections, XSS Attacks, http param pollution etc)
- Add products to the shopping cart
- Delete products from the shopping cart
- Display the shopping cart
- To checkout, a user must be logged in
- Add products to the shopping cart
- Delete products from the shopping cart
- Display the shopping cart
- To checkout, a user must be logged in
- Email Notifications: Sending emails for various events like sign-up, password reset using Nodemailer  & gmail

# Technologies Used
- Node.js: JavaScript runtime built on Chrome's V8 JavaScript engine.
- Express: Fast, unopinionated, minimalist web framework for Node.js.
- Mongoose: Elegant MongoDB object modeling for Node.js.
- MongoDB: NoSQL database for storing data.
- JWT: JSON Web Token for secure user authentication.
- Pug: Template engine for server-side rendering.
- Nodemailer: Module for sending emails from Node.js applications.
- Helmet: Secure HTTP headers middleware.
- CORS: Middleware to enable Cross-Origin Resource Sharing.
- Dotenv: Module to load environment variables from a .env file.
- Bcrypt: Library to hash passwords.
- Validator: Library to validate and sanitize strings.
- mongoSanitizer: Data sanitization against nosql query injection

# API Documentation 
Postman Doc [here](https://web.postman.co/workspace/My-Workspace~cfcd2dc7-c94a-48a7-885c-9245a114ac86/collection/32765959-66211146-d360-4dc6-bb40-ac7bba68a0c5).


# 🚀 Getting Started
1. **Clone this repository to your local machine**
    ```sh
    git clone https://github.com/abdoelsaeed/e-commerce.git
    ```

2. **Install Dependencies**
    ```sh
    npm install
    ```

3. **Set Up Environment Variables**:
    Create a `.env` file in the root directory of the project and configure the required environment variables.

4. **Start the Development Server**:
    ```sh
    npm start
    ```
# Contributing
I welcome contributions! Please fork the repository and create a pull request with your changes.