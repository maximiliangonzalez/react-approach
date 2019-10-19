import React, { Component } from 'react'
import { render } from 'react-dom'

class App extends Component {
  constructor() {
    super();
    this.state = {
      row0: ['-', '-', '-'],
      row1: ['-', '-', '-'],
      row2: ['-', '-', '-'],
      winningPlayer: '',
      currentPlayer: 'X',
      gameOver: false,
      numberOfMoves: 0
    }
    this.toggle = this.toggle.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  componentDidUpdate() {
    const {row0, row1, row2, gameOver, numberOfMoves} = this.state;
    if (gameOver) {
      return;
    }

    const board = [row0, row1, row2];
    board.forEach(row => {
      if (row[0] !== '-' && row[0] === row[1] && row[1] === row[2]) {
        this.setState({winningPlayer: row[0], gameOver: true});
        return;
      }
    });
    
    for (let column = 0; column < 3; column++) {
      if (row0[column] !== '-' && row0[column] === row1[column] && row1[column] === row2[column]) {
        this.setState({winningPlayer: row0[column], gameOver: true});
        return;
      }
    }

    if ((row0[0] !== '-' && row0[0] === row1[1] && row1[1] === row2[2]) || (row0[2] !== '-' && row0[2] === row1[1] && row1[1] === row2[0])) {
      this.setState({winningPlayer: row1[1], gameOver: true});
      return;
    }

    if (numberOfMoves === 9 && !gameOver) {
      this.setState({gameOver: true})
    }
  }

  toggle(row, column) {
    if (this.state[row][column] === '-' && !this.state.gameOver) {
      this.setState(state => {
      const newRow = [...state[row]];
      newRow[column] = state.currentPlayer;
      return {
        [row]: newRow,
        currentPlayer: state.currentPlayer == 'X' ? 'O' : 'X',
        numberOfMoves: state.numberOfMoves + 1
      }
    });
    }
  }

  refresh() {
    this.setState({
      row0: ['-', '-', '-'],
      row1: ['-', '-', '-'],
      row2: ['-', '-', '-'],
      winningPlayer: '',
      currentPlayer: 'X',
      gameOver: false,
      numberOfMoves: 0
    });
  }

  render() {
    return (
      <div>
        <Row row='row0' values={this.state.row0} toggle={this.toggle}/>
        <Row row='row1' values={this.state.row1} toggle={this.toggle}/>
        <Row row='row2' values={this.state.row2} toggle={this.toggle}/>
        {
          this.state.winningPlayer !== '' &&
          <h1>
            {this.state.winningPlayer} wins!
          </h1>
        }
        {
          this.state.gameOver && this.state.winningPlayer === '' &&
          <h1>
            no one won, whoops
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
  return (
    <div>
      <Box row={row} column={0} value={values[0]} toggle={toggle}/>
      <Box row={row} column={1} value={values[1]} toggle={toggle}/>
      <Box row={row} column={2} value={values[2]} toggle={toggle}/>
    </div>
  )
}

const Box = ({row, column, value, toggle}) => {
  return (
    <button style={{height: "100px", width: "100px"}} onClick={() => toggle(row, column)}>
      {value}
    </button>
  )
}

render(<App />, document.getElementById('content'));
