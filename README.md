# About ClassLink

ClassLink is a MERN (MongoDB, Express, React, Node.js) based educational resource and event organizer application. It allows users to create accounts, upload educational resources, and view/list events along with a forums feature for doubts. The app supports JWT authentication.

## Features

**User Authentication**: Secure login/signup using JWT.

**Resource Uploads**: Users can upload educational resources (PDFs, images, small sized video clips).

**Resource Display**: Uploads are shown on the resources page as cards with the recents ones also being shown on the home page.

**Event Management**: Users can create and view events.

**Forum**: Discussion area for users to ask questions and share ideas.

## Tech Stack

**Frontend**: React

**Backend**: Node.js, Express

**Database**: MongoDB

**File Uploads**: Multer, GridFS

**Authentication**: JWT (JSON Web Token)

**Styling**: React-Boostrap + Vanilla CSS

## Installation

Clone the repository

```console
git clone git clone https://github.com/m-deb-16/ClassLink.git
cd ClassLink
```

Install dependencies for Backend (server)
Navigate to the server folder:

```console
cd server
```

Install dependencies:

```console

npm install
```

Install dependencies for Frontend (client)
Navigate to the client folder:

```console
cd ../client
```

Install dependencies:

```console
npm install
```

## Running the Application

**_Backend_**\
To run the backend, navigate to the server directory and run:

```console
npm run dev
```

Nodemon has been used in the backend. To run it without nodemon simply run:

```console
node server.js
```

**_Frontend_**\
To run the frontend, navigate to the client directory and run:

```console
npm run dev
```

This will start the app at http://localhost:3000.

**_Run Both Together_**\
You can run both frontend and backend simultaneously by running the following command in the root directory:

```console
npm start
```

This will use concurrently to run both the frontend and backend at the same time.
