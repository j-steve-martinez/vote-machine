// var React = require('react');
// var ReactDom = require('react-dom');
function login(){
    console.log('login started');
    var myHeaders = new Headers();

    var myInit = { method: 'GET',
               headers: myHeaders,
               mode: 'cors',
               cache: 'default' };

    var url = '/auth/github'
    var myRequest = new Request(url, myInit);
    fetch(myRequest).then(res => {
      console.log('fetch res');

      return res.json();
      // this.setState({user : data});
    }).then(myBlob => {
      console.log('myBlob');
      console.log(myBlob);
      // this.setState(myBlob);
    });
}

// var apiUrl = appUrl + '/api/:id';
// console.log(apiUrl);
// var auth;
// ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, function (data) {
//   console.log('ajaxFunction start');
//   console.log(data);
//   auth = data;
// }));

// const Polls = React.createClass({
class Main extends React.Component {
  constructor(props) {
    super(props);
    console.log('auth');
    console.log(auth);
    if (auth === undefined) {
      auth = {id: false};
    }
    this.state = {auth};
  }
  // componentWillMount(){
  //   console.log('componentWillMount');
  //   // console.log('isAuthenticated');
  //   // console.log(isAuth());
  //   var url = '/api/:id'
  //   fetch(url).then(res => {
  //     console.log('fetch res');
  //     // console.log(res.json());
  //     // console.log(res.text());
  //     return res.json();
  //     // this.setState({user : data});
  //   }).then(myBlob => {
  //     console.log('myBlob');
  //     console.log(myBlob);
  //     this.setState(myBlob);
  //   });
  // }
  callBack(path, type, data){
    console.log('callBack called');
    console.log(path);
    console.log('auth');
    console.log(auth);
    if (path === '/login') {
      console.log('login was called');
    }
  }
  render(){
    console.log('render this.state');
    console.log(this.state);
    // this is the mock up
    // grab the data from mongo
    return(
      <div>
        <Header auth={this.state.auth} cb={this.callBack}/>
        <Body title="The Polls Are Open">
          <div className="panel panel-primary">
              <div className="panel-heading">
                  <h3 className="panel-title">Select a poll to cast your vote</h3>
              </div>
              <div className="panel-body">
                <NavLink to="/api/poll/1">Poll number 1</NavLink>
              </div>
              <div className="panel-body">
                <NavLink to="/api/poll/2">Poll number 2</NavLink>
              </div>
              <div className="panel-body">
                <NavLink to="/api/poll/3">Poll number 3</NavLink>
              </div>
          </div>
        </Body>
      </div>

    )
  }
// end class
}

const Body = React.createClass({
  render() {
    // console.log('Body');
    // console.log(this.props);
    var heading = this.props.title;
    var body = this.props.children;

    return (
      <div className="jumbotron">
        <div>
          <h2>{heading}</h2>
          {body}
        </div>
      </div>
    );
  }
});

const NavLink = React.createClass({
  render() {
    return <a href={this.props.to}>{this.props.children}</a>
  }
});

const Header = React.createClass({
  hc: function(e){
    console.log(e.target);
  },
  render() {
    console.log('header');
    console.log(this.props);
    var myHeader;
    // console.log('Header props isLoggedIn: ');
    // console.log(this.props.isLoggedIn);
    if (this.props.auth.id !== false) {
      // console.log('is logged in');
      myHeader = <HeaderLogout cb={this.props.cb} hc={this.hc}/>;
    } else {
      // console.log('not logged in');
      myHeader = <HeaderLogin cb={this.props.cb} hc={this.hc}/>;
    }
    return (
      <div>
        <nav className="navbar navbar-light bg-faded">
          {myHeader}
        </nav>
      </div>

    );
  }
})

const HeaderLogin = React.createClass({
  myClick(e){
    if (e.target.name !== '/login') {
      e.preventDefault();
    }

    console.log('HeaderLogin myClick');
    console.log(e.target.name);
    this.props.cb(e.target.name)
  },
  render(){
    console.log('HeaderLogin');
    console.log(this.props);
    return(
      <ul className="nav navbar-nav">
        <li className="nav-item active">
          <a className="nav-link" name='/' href="/" onClick={this.myClick}>Home <span className="sr-only">(current)</span></a>
        </li>
        <li className="nav-item">
          <a className="nav-link" name='/login' href='/auth/github' onClick={this.myClick}>Login with GitHub</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" name='/about' href="/about" onClick={this.myClick}>About</a>
        </li>
      </ul>
    )
  }
})

const HeaderLogout = React.createClass({
  render(){
    console.log('HeaderLogout');
    console.log(this.props);
    return(
      <ul className="nav navbar-nav">
        <li className="nav-item active">
          <a className="nav-link" href="/">Home <span className="sr-only">(current)</span></a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">New Poll</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/profile/:id">Profile</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/logout">Logout</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/about">About</a>
        </li>
      </ul>
    )
  }
})

ReactDOM.render(
  <Main />,
  document.getElementById('content')
);
