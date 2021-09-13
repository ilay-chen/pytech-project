import logo from './logo.svg';
import './App.css';
import React, { useRef, useEffect, Component, createRef  } from 'react';

var link = "https://api.github.com/users?per_page=10&since="

class App extends React.Component {
  
  constructor(props) {
    super(props);
    this.listInnerRef = createRef();
    this.state = {
      items: [],
      isLoaded: false,
      listInnerRef: this.listInnerRef,
      lastId: 0
    };
  }
  
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  };

  trackScrolling = () => {
    const { isLoaded } = this.state;
    const wrappedElement = document.getElementById('root');
    if (this.isBottom(wrappedElement) && isLoaded) {
      console.log('header bottom reached');
      this.setState({
        isLoaded: false
      });
      this.refreshList();
      document.removeEventListener('scroll', this.trackScrolling);
    }
  };

  isBottom(el) {
    return el.getBoundingClientRect().bottom <= window.innerHeight;
  }

  refreshList() {
    const { items, lastId } = this.state;

    fetch(link + lastId)
      .then(res => res.json())
      .then(result => {
        let primes = items.concat(result);
        var set = new Set(primes);
        var arr = Array.from(set)
        this.setState({
          isLoaded: true,
          items: arr,
          lastId: arr.at(-1).id
        });
        console.log(arr)
      });
  }

  componentDidMount() {
    window.addEventListener('scroll', this.trackScrolling);

    fetch(link)
      .then(res => res.json())
      .then(result => {
        console.log(result)
        this.setState({
          isLoaded: true,
          items: result,
          lastId: result.at(-1).id
        });
      });
  }

  render() {
    const { items, isLoaded, listInnerRef } = this.state;

      return (
        <div onScroll={this.onScroll} ref={this.listInnerRef}>
          <ul>
            {items.map(item => (
              <li key={item.id}>
                <div class="card">
                  <img src={item.avatar_url} alt="Avatar" style={{ width:"100%" }} />
                  <div class="container">
                    <h4><b>{item.login}</b></h4> 
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      );
  }
}

export default App;
