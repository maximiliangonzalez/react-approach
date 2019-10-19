// note that in a real project, you'd have all your components in SEPARATE FILES, which makes things much cleaner
// you use import statements like the ones below so you can use your components within other components

import React, { Component } from 'react'
import { render } from 'react-dom'

// App is a class because it holds application state and uses lifecycle methods (methods that control the process of rendering and rerendering the component)
// (note that in recent versions of React, you can do these things in functional components too. Look up React hooks, specifically useState and useEffect)
// (only do that extra research if you're comfortable with the code already on this page. if you're still wrapping your head around it, just focus on this for now. hooks are very new and lots of companies aren't using them yet)
class App extends Component {
    // the constructor is where you store your component's state and bind methods that belong to the class (not unique to React)
    constructor() {
      // super (the constructor of the parent class, what the child extends - in this case, React.Component) must be called before the `this` keyword can be used in a class. this is a JavaScript thing, not a React specific thing.
      super();
      // normally your state will be an object literal, but I want to give users the opportunity to restart their game, so I use this function to return the initial state in the places I need it so I don't repeat myself. see the getFreshState() method below to see what this state will look like.
      // NEVER write this.state.property = value. ALWAYS use this.setState() and pass in an object with the properties and new values you want to update. this is how React knows when to rerender. 
      // if you want a child component to update the state of a parent, write a method that calls this.setState and pass it down as props to your child component
      this.state = this.getFreshState();
      // class methods must be bound in the constructor so they refer to `this` properly (again, a JavaScript / class thing, not a React specific thing)
      this.toggle = this.toggle.bind(this);
      this.refresh = this.refresh.bind(this);
      this.getFreshState = this.getFreshState.bind(this);
    }

    // componentDidUpdate is a lifecycle method available only in class components (see useEffect for functional components if you're interested in doing further research)
    // componentDidUpdate runs every time a component rerenders (after this.setState is called and changes its state)
    // it will also run every time a component's parent renders and passes it props again (unless you use React.memo or React.PureComponent, or implement the shouldComponentUpdate() lifecycle methods)
    componentDidUpdate() {
      // destructuring assignment, so I don't have to write this.state over and over
      const {row0, row1, row2, gameOver} = this.state;

      // without the check in the below if statement, we will enter an infinite loop upon winning or filling up the board
      // when gameOver is true, that means one of the three winning conditions is met or the board is full, which will fulfill one of the conditions below
      // under those conditions, we call this.setState(), which updates the component, which will call the componentDidUpdate() method again, which will call this.setState() again
      // basically, infinite loop and your browser probably crashes
      // if you use this.setState() within componentDidUpdate(), you MUST wrap it in an effective conditional to avoid an infinite loop
      if (!gameOver) {
        // check for a winning row
        const board = [row0, row1, row2];
        board.forEach(row => {
          // I always make sure the first box's value isn't '-' because in the beginning, all rows, columns, and diagonals have that value, so these would all evaluate to true and cause the game to end before anyone's made a move
          if (row[0] !== '-' && row[0] === row[1] && row[1] === row[2]) {
            // calling this.setState merges the current state with the object you pass in, and triggers a rerender so the updated information can be displayed
            this.setState({winningPlayer: row[0], gameOver: true});
            return;
          }
        });

        // check for a winning column
        for (let column = 0; column < 3; column++) {
          if (row0[column] !== '-' && row0[column] === row1[column] && row1[column] === row2[column]) {
            this.setState({winningPlayer: row0[column], gameOver: true});
            return;
          }
        }

        // check for a winning diagonal
        if ((row0[0] !== '-' && row0[0] === row1[1] && row1[1] === row2[2]) || (row0[2] !== '-' && row0[2] === row1[1] && row1[1] === row2[0])) {
          // use row1[1] to get the winning letter because this is guaranteed to have the value of the winning player in both cases
          this.setState({winningPlayer: row1[1], gameOver: true});
          return;
        }

        // check for full board without a winner so the player can reset the board (if this point in the code is reached, no one has won yet)
        if ([...row0, ...row1, ...row2].every(value => value !== '-')) {
          this.setState({gameOver: true});
        }
      }
    }

    // what the state should look like at the beginning of the game. we initialize the state to this method's return value in the constructor 
    // and we also use the return value in this.setState() when the game ends so the user can refresh the game to its original condition
    getFreshState() {
      return {
        row0: ['-', '-', '-'],
        row1: ['-', '-', '-'],
        row2: ['-', '-', '-'],
        winningPlayer: '',
        currentPlayer: 'X',
        gameOver: false
      }
    }

    // this is the method that changes dashes to an X or O depending on who the current player is, and then changes the current player so the next player can take a turn
    // we pass it down as props to each row, and then from each row to each box, so boxes can trigger an update of Board's state
    toggle(row, column) {
      // we only want to change a box's value if its value is '-' and if no one has won yet
      if (this.state[row][column] === '-' && this.state.winningPlayer === '') {
        // when an update to state depends on the previous state, it's best practice to use a callback and return the new state from the callback
        this.setState(state => {
          const newRow = [...state[row]];
          newRow[column] = state.currentPlayer;
          return {
            [row]: newRow,
            currentPlayer: state.currentPlayer === 'X' ? 'O' : 'X'
          };
        });
      }
    }

    // method to call when the game is over so the board can be refreshed
    refresh() {
      this.setState(this.getFreshState());
    }

    // a class component's render method is what gets called every time it renders. return the JSX (code that looks like HTML) that you want the component to display
    render() {
      // you can do other work outside of the return, like loops and conditionals which you can't do inside the return. here we don't need that, but it's a thing you can do.
      return (
        // JSX: a fun mix of normal looking HTML elements like div and h1, and then your own custom components like Row
        <div>
          <h1>Tic Tac Toe</h1>
          <Row row='row0' values={this.state.row0} toggle={this.toggle}/>
          <Row row='row1' values={this.state.row1} toggle={this.toggle}/>
          <Row row='row2' values={this.state.row2} toggle={this.toggle}/>
          {
            // you can't use if, while, or for statements within the return value of a component because these aren't expressions that evaluate to something
            // if you want to render something conditionally, you can use `condition && returnValue` (like if) or the ternary operator `condition ? returnValueIfTrue : returnValueIfFalse` (like if, else)
            // if you really want to use if/else structure or loops, just do so outside of your return value and save whatever value you want to return in a variable that you can reference inside of the return value
            // any looping used to generate a value can be done outside of the return value (you can use loop-like functions like forEach, map, filter, etc inside of JSX because they do evaluate to something, but it's still often cleaner to put those outside of your return statement too)
            // if you save something into an array (like `const headers = array.map(el => <h1>el.value</h1>)`), you can just plop the array in your JSX ({headers}) and it'll spread them out for you
            // remember: inject any JavaScript you want to put in your JSX inside of curly braces
            this.state.winningPlayer !== '' &&
            <h1>
              {this.state.winningPlayer} wins!
            </h1>
            // this h1 will only be part of the return statement if this.state.winningPlayer has a nonempty string as a value. the conditional below works similarly.
          }
          {
            this.state.gameOver &&
            <button onClick={this.refresh}>
              Play again?
            </button>
          }
        </div>
      )
    }
}




// Row and Box are functions because they don't have state or use lifecycle methods
// Whatever you return from a functional component is what gets rendered.
// You can have other code inside of a functional component, but I didn't need any, so I let the arrow function implicitly return all the JSX in the components instead of having a return statement
// (note that in the most recent versions of React, functional components CAN have state and control their render cycle with useEffect)
// (also note that these components rerender whenever their parents rerender, even if their props are exactly the same. this can be prevented with React.memo for functions, or React.PureComponent for classes in more recent versions of React)
const Row = ({row, values, toggle}) => (
  // I passed 'row' down as a prop to reach Row, and I'm passing it down again as a prop to each Box, so when the box calls 'toggle' it can change the right value. I'm not using anywhere else here.
  // This is called 'prop drilling'. Sometimes Redux can make it better, sometimes it can't.
  <div>
    <Box row={row} column={0} value={values[0]} toggle={toggle}/>
    <Box row={row} column={1} value={values[1]} toggle={toggle}/>
    <Box row={row} column={2} value={values[2]} toggle={toggle}/>
  </div>
);




const Box = ({row, column, value, toggle}) => (
  // You can't directly change the state of a parent component within its child (or grandchild, etc.)
  // Instead, you can pass down a function that calls this.setState, defined in the parent component, and call it in the child component
  // this.setState (or the function returned by the useState hook in functional components) is how React knows when to rerender or update a component
  
  // when you see double curly braces like on the line below, that means an object literal. the outside braces are just the ones required to inject JavaScript into JSX
  // you can inline CSS like this with a style object but I normally prefer having a separate CSS file to keep everything modular
  // this just takes a little more setup with gulp or webpack or whatever build tools you're using
  // class is a reserved word in JavaScript so to give an element a CSS class use `className` instead
  <button style={{height: '100px', width: '100px'}} onClick={() => toggle(row, column)}>
    {value}
  </button>
);

render(<App />, document.getElementById('content'));
