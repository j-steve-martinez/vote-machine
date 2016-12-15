'use strict'
// const Polls = React.createClass({
class Main extends React.Component {
  constructor(props) {
    super(props);
    // console.log('auth');
    // console.log(auth);
    if (auth === undefined) {
      auth = {id: false};
    }
    this.state = {auth};
  }
  callBack(path, type, data){
    console.log('Main callBack called');
    console.log(path);
    console.log(type);
    console.log(data);
    // console.log('auth');
    // console.log(auth);
    // if (path === '/login') {
    //   console.log('login was called');
    // }
  }
  render(){
    console.log('Main this.state');
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
                <NavLink cb={this.callBack} to="/api/poll/1">Poll number 1</NavLink>
              </div>
              <div className="panel-body">
                <NavLink cb={this.callBack} to="/api/poll/2">Poll number 2</NavLink>
              </div>
              <div className="panel-body">
                <NavLink cb={this.callBack} to="/api/poll/3">Poll number 3</NavLink>
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
  clickH(e){
    // e.preventDefault();
    // console.log('myClick');
    // console.log(e.target.id);
    // prevent default for everything except login and logout
    if (e.target.id.indexOf('log') <= 0 && e.target.id.indexOf('github') <= 0) {
      e.preventDefault();
      this.props.cb(e.target.id, 'type test', 'data test');
    }
  },
  render() {
    // console.log('NavLink');
    // console.log(this.props);
    return <a onClick={this.clickH} id={this.props.to} href={this.props.to}>{this.props.children}</a>
  }
});

const Header = React.createClass({
  render() {
    // console.log('header props');
    // console.log(this.props);
    var isAuth = JSON.parse(this.props.auth);
    // console.log('isAuth');
    // console.log(isAuth);
    var myHeader;

    if (isAuth.id !== undefined && isAuth.id !== false ) {
      // console.log('is logged in');
      myHeader = <HeaderLogout cb={this.props.cb}/>;
    } else {
      // console.log('not logged in');
      myHeader = <HeaderLogin cb={this.props.cb}/>;
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
  render(){
    // console.log('HeaderLogin');
    // console.log(this.props);
    return(
      <ul className="nav navbar-nav">
        <li className="nav-item active">
          <NavLink cb={this.props.cb} cn='nav-link' to="/">Home</NavLink>
        </li>
        <li className="nav-item">
          <NavLink cb={this.props.cb} cn='nav-link' to="/auth/github">Login with GitHub</NavLink>
        </li>
        <li className="nav-item">
          <NavLink cb={this.props.cb} cn='nav-link' to="/about">About</NavLink>
        </li>
      </ul>
    )
  }
})

const HeaderLogout = React.createClass({
  render(){
    // console.log('HeaderLogout');
    // console.log(this.props);
    return(
      <ul className="nav navbar-nav">
        <li className="nav-item active">
          <NavLink cb={this.props.cb} cn='nav-link' to="/">Home</NavLink>
        </li>
        <li className="nav-item">
          <NavLink cb={this.props.cb} cn='nav-link' to="/profile/:id/new">New Poll</NavLink>
        </li>
        <li className="nav-item">
          <NavLink cb={this.props.cb} cn='nav-link' to="/profile/:id">Profile</NavLink>
        </li>
        <li className="nav-item">
          <NavLink cb={this.props.cb} cn='nav-link' to="/logout">Logout</NavLink>
        </li>
        <li className="nav-item">
          <NavLink cb={this.props.cb} cn='nav-link' to="/about">About</NavLink>
        </li>
      </ul>
    )
  }
})

ReactDOM.render(
  <Main />,
  document.getElementById('content')
);
