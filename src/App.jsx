import { useState, useEffect } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/api';

// The generateClient function is the main entry point to the Gen 2 client.
// It reads the amplify_outputs.json file and generates a client with
// the shape of your backend schema.
const client = generateClient();

function App({ signOut, user }) {
  const [todos, setTodos] = useState([]);

  // Function to fetch todos
  async function fetchTodos() {
    // The client.models.Todo.list() method fetches all records from the Todo model.
    // Because we have an authorization rule on the model, this will only
    // return the records that belong to the currently signed-in user.
    try {
      const { data: items } = await client.models.Todo.list();
      setTodos(items);
    } catch (err) {
      console.error('error fetching todos', err);
    }
  }

  // Use the useEffect hook to call fetchTodos when the component mounts.
  useEffect(() => {
    fetchTodos();
  }, []);

  // Function to create a new todo
  async function createTodo(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const description = form.get('description');

    if (!description) {
      alert('Please enter a description.');
      return;
    }

    // The client.models.Todo.create() method creates a new record.
    await client.models.Todo.create({
      description: description,
      status: 'pending',
    });

    fetchTodos(); // Refetch todos to update the list
    event.target.reset(); // Clear the form
  }

  // Function to delete a todo
  async function deleteTodo(id) {
    await client.models.Todo.delete({ id });
    fetchTodos(); // Refetch todos to update the list
  }

  // New function to update a todo's status
  async function updateTodoStatus(id, currentStatus) {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';

    // The client.models.Todo.update() method updates a record by its id.
    await client.models.Todo.update({
      id: id,
      status: newStatus,
    });

    fetchTodos(); // Refetch todos to update the list
  }

  return (
    <main style={{ maxWidth: '720px', margin: '2rem auto' }}>
      <h1>My To-Do App</h1>
      <h2>
        Hello, {user?.signInDetails?.loginId}{' '}
        <button onClick={signOut}>Sign Out</button>
      </h2>

      {/* Form for creating new todos */}
      <form onSubmit={createTodo} style={{ marginBottom: '1rem' }}>
        <input
          name='description'
          placeholder='Add a new to-do'
          style={{ marginRight: '0.5rem' }}
        />
        <button type='submit'>Create</button>
      </form>

      {/* List of todos */}
      <h3>My To-Dos:</h3>
      {todos.length === 0 ? (
        <p>No to-dos yet! Add one above.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {todos.map((todo) => (
            <li
              key={todo.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '0.5rem',
              }}
            >
              {/* Checkbox to toggle the status */}
              <input
                type='checkbox'
                checked={todo.status === 'completed'}
                onChange={() => updateTodoStatus(todo.id, todo.status)}
                style={{ cursor: 'pointer' }}
              />
              {/* Apply a line-through style when completed */}
              <p
                style={{
                  margin: 0,
                  flexGrow: 1,
                  textDecoration:
                    todo.status === 'completed' ? 'line-through' : 'none',
                }}
              >
                {todo.description}
              </p>
              <button onClick={() => deleteTodo(todo.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

const AuthenticatedApp = withAuthenticator(App);

export default AuthenticatedApp;
