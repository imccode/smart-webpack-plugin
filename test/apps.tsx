import React from 'react'
import './style.scss'

type State = {
  text: number
}

class App extends React.Component<{}, State> {
  state = {
    text: 1
  }

  handleClick = () => {
    this.setState(state => ({
      text: state.text + 1
    }))
  }

  render() {
    return (
      <div>
        {this.state.text}
        <button onClick={this.handleClick}>+1</button>
      </div>
    )
  }
}

export default App