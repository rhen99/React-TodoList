import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import PropTypes from 'prop-types';
//import uuid from 'uuid'

import './App.css';
import Axios from 'axios';


//App
function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    Axios.get('https://jsonplaceholder.typicode.com/todos?_limit=10').then(res => setTodos(res.data))
  }, []);

  const markComplete = id => {
    const newTodos = [...todos];
    newTodos.map(todo => {
      if (todo.id === id) {
        todo.completed = !todo.completed;
      }
      return todo
    });
    setTodos(newTodos);


  }


  const addTodo = (title) => {
    Axios.post('https://jsonplaceholder.typicode.com/todos', { title, completed: false }).then(res => setTodos([...todos, res.data]));
  }


  const delTodo = (id) => {
    Axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`);
    setTodos([...todos.filter(todo => todo.id !== id)]);
  }
  return (
    <Router>
      <div className="App">
        <Header />
        <Route exact path="/" render={() => (
          <React.Fragment>
            <TodoForm addTodo={addTodo} />
            <Todos todos={todos} markComplete={markComplete} delTodo={delTodo} />
          </React.Fragment>
        )} />
        <Route path="/about" component={About} />
      </div>
    </Router>
  );
}



//Header
function Header() {
  const header = {
    backgroundColor: '#333',
    color: '#fff',
    padding: '10px',
    textAlign: 'center'
  };
  const linkStyle = {
    color: '#fff',
    textDecoration: 'none'
  };
  return (
    <header style={header}>
      <h1>TodoList</h1>
      <Link to="/" style={linkStyle}>Home</Link> | <Link to="/about" style={linkStyle}>About</Link>
    </header>
  );
}




//About
function About() {
  return (
    <React.Fragment>
      <h1>About</h1>
      <p>This is the TodoList app v1.0</p>
    </React.Fragment>
  );
}






//TodoForm
function TodoForm({ addTodo }) {

  const [value, setValue] = useState('');
  const handleSubmit = e => {
    e.preventDefault();
    if (!value) return;
    addTodo(value);
    setValue('');
  }
  return (
    <form style={{ display: 'flex' }} onSubmit={handleSubmit}>
      <input type="text" placeholder="Add Todo..." style={{ flex: '10', padding: '5px' }} name="title" value={value} onChange={e => setValue(e.target.value)} />

      <button type="submit" className="btn" style={{ flex: '1' }}>Submit</button>
    </form>
  );
}






//Todos
function Todos({ todos, markComplete, delTodo }) {
  return (
    <div className="todo-list">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} markComplete={markComplete} delTodo={delTodo} />
      ))}
    </div>
  );
}







//TodoItem
function TodoItem({ todo, markComplete, delTodo }) {
  const itemStyles = () => {
    return {
      backgroundColor: '#f4f4f4',
      textDecoration: todo.completed ? 'line-through' : 'none',
      padding: '10px',
      borderBottom: '1px dotted #ccc'
    }
  }
  const buttonStyle = {
    backgroundColor: '#ff0000',
    color: "#fff",
    border: 'none',
    borderRadius: '50%',
    padding: '5px 8px',
    float: 'right',
    cursor: 'pointer'
  }

  return (
    <div style={itemStyles()}>
      <p>
        <input type="checkbox" name="check" onChange={() => markComplete(todo.id)} />{' '}
        {todo.title}
        <button onClick={() => delTodo(todo.id)} style={buttonStyle}>x</button>
      </p>
    </div>
  );
}






//Set PropTypes

Todos.propTypes = {
  todos: PropTypes.array.isRequired,
  delTodo: PropTypes.func.isRequired,
  markComplete: PropTypes.func.isRequired,
}
TodoItem.propTypes = {
  todo: PropTypes.object.isRequired,
  delTodo: PropTypes.func.isRequired,
  markComplete: PropTypes.func.isRequired,
}
TodoForm.propTypes = {
  addTodo: PropTypes.func.isRequired
}

export default App;

