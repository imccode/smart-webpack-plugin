import React from 'react'

import './style.scss'

class App extends React.Component {
  state = {
    text: 12
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
        <button onClick={this.handleClick}>+133</button>
      </div>
    )
  }
}

export default App