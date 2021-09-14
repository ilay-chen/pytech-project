import './App.css';
import React from 'react';

class App extends React.Component {
  
  constructor(props) {
    super(props);
    this.link = "https://api.github.com/users?per_page=10&since="
    this.state = {
      items: [],
      isLoaded: false,
      lastId: 0
    };
  }

  trackScrolling = () => {
    const { isLoaded } = this.state;
    const wrappedElement = document.getElementById('root');
    if (this.isBottom(wrappedElement) && isLoaded) {
      console.log('header bottom reached');
      this.setState({
        isLoaded: false
      });
      // refresh the cards list
      this.loadList();
      // remove scroll EventListener untill load new cards, to avoid refreshList call multiple times.
      document.removeEventListener('scroll', this.trackScrolling);
    }
  };

  isBottom(el) {
    return el.getBoundingClientRect().bottom <= window.innerHeight;
  }

  async fetchUsersJSON() {
    const {lastId} = this.state;
    const response = await fetch(this.link + lastId);
    const users = await response.json();
    return users;
  }

  loadList() {
    this.fetchUsersJSON().then(result => {
      this.updateResult(result)
    });
  }

  updateResult(result) {
    const { items } = this.state;
    this.add = items.concat(result);
    this.set = new Set(this.add);
    this.allArr = Array.from(this.set)
      
    this.setState({
      isLoaded: true,
      items: this.allArr,
      lastId: this.allArr.at(-1).id
    });
  }

  componentDidMount() {
    window.addEventListener('scroll', this.trackScrolling);
    this.loadList();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.trackScrolling);
  };

  render() {
    const {items} = this.state;

      return (
        <div>
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
