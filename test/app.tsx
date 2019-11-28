import React from 'react'

import './style.scss'

class App extends React.Component {
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
