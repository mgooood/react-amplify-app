# React To-Do App with AWS Amplify Gen 2

This project is a simple, full-stack to-do list application built with React and AWS Amplify Gen 2. It demonstrates how to quickly set up a backend with authentication and a GraphQL API, and connect it to a React frontend.

## Project Features

- **Frontend**: Built with React and Vite.
- **Backend**: Powered by AWS Amplify Gen 2.
- **Authentication**: Secure user sign-up and sign-in using Amazon Cognito.
- **Database**: A NoSQL database (Amazon DynamoDB) to store to-do items.
- **API**: A GraphQL API (AWS AppSync) for creating, reading, updating, and deleting to-do items.
- **Development Environment**: A local cloud sandbox for rapid backend development and testing.

---

## How This App Was Built

This section outlines the key steps taken to build this application from scratch.

### 1. Initializing the React Frontend

The project was started using Vite, a modern frontend build tool.

```bash
npm create vite@latest react-amplify-app -- --template react
cd react-amplify-app
npm install
```

### 2. Setting up AWS Amplify

AWS Amplify Gen 2 was initialized in the project root. This command scaffolds the necessary backend directory structure.

```bash
npm create amplify@latest
```

This created the `amplify/` directory, which contains all the backend-as-code definitions.

### 3. Adding Authentication

User authentication was the first feature added to the backend.

1.  The file `amplify/auth/resource.ts` was created and configured to allow users to sign in with their email addresses.
2.  The main backend definition at `amplify/backend.ts` was updated to include the new auth resource.
3.  The local cloud sandbox was started to deploy the auth resources locally:
    ```bash
    npx ampx sandbox
    ```
4.  The React frontend was configured in `src/main.jsx` to connect with the Amplify backend:
    ```javascript
    import { Amplify } from 'aws-amplify';
    import outputs from '../amplify_outputs.json';
    Amplify.configure(outputs);
    ```
5.  The `App.jsx` component was wrapped with the `withAuthenticator` Higher-Order Component from `@aws-amplify/ui-react` to protect the app and provide a sign-in/sign-up UI.

### 4. Defining the Data Model & API

A GraphQL API and a corresponding database table were created to manage to-do items.

1.  The data model was defined in `amplify/data/resource.ts` using TypeScript. A `Todo` model was created with `description` and `status` fields.
2.  An authorization rule, `allow.owner()`, was added to the model. This rule ensures that users can only access and modify their own to-do items.
3.  The Amplify Sandbox automatically detected the changes and deployed a local DynamoDB table and an AppSync GraphQL API.

### 5. Building the Frontend UI

The `App.jsx` component was updated to provide the full CRUD (Create, Read, Update, Delete) functionality for the to-do list.

1.  The `generateClient` function from `aws-amplify/api` was used to create a type-safe API client.
2.  React's `useState` and `useEffect` hooks were used to manage the list of to-dos.
3.  Async functions were written to handle:
    - `fetchTodos`: Listing the current user's to-dos.
    - `createTodo`: Creating a new to-do.
    - `deleteTodo`: Deleting a to-do.
    - `updateTodoStatus`: Toggling a to-do's status between "pending" and "completed".
4.  The UI was built with a form for creating new items and an unordered list to display them.

### 6. Preparing for Deployment

To prepare for cloud deployment, the project was initialized as a Git repository.

1.  The `.gitignore` file was updated to exclude the `.amplify/` directory and the `amplify_outputs.json` file, as these contain environment-specific and sensitive information.
2.  A new Git repository was initialized and the code was committed.

---

## How to Run This Project Locally

1.  **Clone the repository:**

    ```bash
    git clone <your-repo-url>
    cd react-amplify-app
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Start the Amplify Sandbox** (in a separate terminal):
    This will deploy a local version of the backend resources (auth, database, API).

    ```bash
    npx ampx sandbox
    ```

4.  **Start the React development server** (in another terminal):

    ```bash
    npm run dev
    ```

5.  Open your browser to `http://localhost:5173`. You will be greeted with the sign-in page. Create an account and start managing your to-dos!
