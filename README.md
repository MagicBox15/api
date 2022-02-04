# Api project
### Used technologies:
* Node.js
* Express.js
* Mongoose
* Jsonwebtoken - for creating token and authenticate requests with cookies
* Bcryptjs - for encrypt/decrypt passwords

## Install:
* fork and clone this repository
* run `npm install` in your terminal

Server runs at ***localhost:3001***

For local development you should run `npm run dev`

For working with requests I've been using [postman](https://web.postman.co//).
With this api you can create new user, login as existent user and save passwords to your user.

### Examples
* **Registration**\
request: `POST /auth/registration`\
`{
    "username": "user1",  
    "password": "user123"  
}`

  response: `Status 200 OK`\
`{
    "message": "User successfully registered"
}`

* **Registration with errors**

***Username is already taken***\
 request: `POST /auth/registration`\
  response: `Status 400 Bad Request`\
`{
    "message": "User with this name already exists"
}`

***Empty username field***\
  request: `POST /auth/registration`\
  `{
    "username": "",
    "password": "user123"
}`\
  response: `Status 400 Bad Request`\
`"message": "Registration error",`
`"msg": "User's name can't be empty",`

***Not valid password***\
request: `POST /auth/registration`\
`{
    "username": "user1",
    "password": "123"
}`\
response: `Status 400 Bad Request`\
`"msg": "Password should be min 4 characters and max 12 characters"`

* **Login**\
***Success***\
request: `POST /auth/login`\
`{
    "username": "user1",
    "password": "user123"
}`\
response: `Status 200 OK`\
`{
    "message": "Login success"
}`

***User doesn't exists***\
request: `POST /auth/login`\
`{
    "username": "user",
    "password": "user123"
}`\
response: `Status 400 Bad Request`\
`{
    "message": "User 'user' can't be found"
}`

***User entered wrong password***\
request: `POST /auth/login`\
`{
    "username": "user",
    "password": "user1234"
}`\
response: `Status 400 Bad Request`\
`{
    "message": "Wrong password. Try again"
}`

* **Save password to server**

***Successfully***\
request: `POST /auth/passwords`\
`{
    "type": "email",
    "title": "gmail",
    "password": "gma123"
}`
response: `Status 200 OK`\
`{
    "message": "Password was successfully created"
}`\
***Not successful (password title should be unique)***\
request: `POST /auth/passwords`\
`{
    "type": "email",
    "title": "gmail",
    "password": "gma123"
}`\
response: `Status 400 Bad Request`\
`{
    "message": "Something going wrong"
}`

* **To get all passwords for authorized user**\
request: `GET /auth/passwords`

**All passwords sending encrypted**

![image](https://user-images.githubusercontent.com/92047770/152548481-3dbaa77e-028e-4aba-821a-82dd64e22ba6.png)
![image](https://user-images.githubusercontent.com/92047770/152548536-035aaa4d-66f5-4645-b464-1367c487b9a4.png)

