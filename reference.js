import React, { Component } from 'react'
import { render } from 'react-dom'

class App extends Component {
  constructor() {
    super();
    this.toggle = this.toggle.bind(this);
    this.refresh = this.refresh.bind(this);
    this.getFreshState = this.getFreshState.bind(this);
    this.state = this.getFreshState();
  }

  componentDidUpdate() {
    const {row0, row1, row2, gameOver} = this.state.board; 

    // without this check, we will enter an infinite loop upon winning
    if (!gameOver) {
      // check for a winning row
      const board = [row0, row1, row2];
      board.forEach(row => {
        // I always make sure the first box's value isn't '-' because in the beginning, all rows, columns, and diagonals have that value, so these would all evaluate to true and cause the game to end
        if (row[0] !== '-' && row[0] === row[1] && row[1] === row[2]) {
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
        // use row1[1] because this is guaranteed to be the winning player in both cases
        this.setState({winningPlayer: row1[1], gameOver: true});
        return;
      }

      // check for full board without a winner (if this point in the code is reached, no one has won)
      if ([...row0, ...row1, ...row2].every(value => value !== '-')) {
        this.setState({gameOver: true});
      }
    }
  }

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

  toggle(row, column) {
    // we only want to change a box's value if its value is '-' and if no one has won yet
    if (this.state[row][column] === '-' && this.state.winningPlayer === '') {
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

  refresh() {
    this.setState(this.getFreshState());
  }

  render() {
    const rows = [0,1,2].map(num => <Row row={`row${num}`} values={this.state[`row${num}`]} toggle={this.toggle}/>);
    return (
    <div>
      <h1>Tic Tac Toe</h1>
      {/* <Row row='row0' values={this.state.row0} toggle={this.toggle}/>
      <Row row='row1' values={this.state.row1} toggle={this.toggle}/>
      <Row row='row2' values={this.state.row2} toggle={this.toggle}/> */}
      {rows}
      {
        this.state.winningPlayer !== '' &&
        <h1>
          {this.state.winningPlayer} wins!
        </h1>
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




const Row = ({row, values, toggle}) => {
  const boxes = [0,1,2].map(num => <Box row={row} column={num} value={values[num]} toggle={toggle}/>);
  console.log(`${row} is rendering`)
  return (
  <div>
    {boxes}
    {/* <Box row={row} column={0} value={values[0]} toggle={toggle}/>
    <Box row={row} column={1} value={values[1]} toggle={toggle}/>
    <Box row={row} column={2} value={values[2]} toggle={toggle}/> */}
  </div>
  )
};





const Box = ({row, column, value, toggle}) => (
  <button style={{height: '100px', width: '100px'}} onClick={() => toggle(row, column)}>
  {console.log(`${row} box${column} is rendering`)}
    {value}
  </button>
);

render(<App />, document.getElementById('content'));
