'use strict'

class Main extends React.Component {
  constructor(props) {
    super(props);
    // console.log('auth');
    // console.log(auth);
    // this.getAllPolls();
    if (auth === undefined) {
      auth = {id: false};
    }
    var allPolls = [];
    this.state = {auth, allPolls};
  }
  callBack(path, type, data){
    console.log('Main callBack called');
    console.log(path);
    console.log(type);
    console.log(data);

  }
  componentDidMount(){
    this.getAllPolls();
  }
  getAllPolls(){
    var url = '/api/allPolls'
    var myRequest = new Request(url);
    fetch(myRequest).then(res => {
      // console.log('allPolls fetch res');
      return res.json();
      // this.setState({user : data});
    }).then(allPolls => {
      // console.log('allPolls then');
      // console.log('data' + allPolls);
      // console.log(typeof allPolls);
      var polls = {};
      polls.allPolls = allPolls;
      // console.log(polls);
      this.setState(polls);
    });
  }
  render(){
    console.log('Main this.state');
    console.log(this.state);

    return(
      <div>
        <Header auth={this.state.auth} cb={this.callBack}/>
        <Body title="The Polls Are Open">
          <Polls polls={this.state.allPolls} cb={this.callBack}/>
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

const Polls = React.createClass({
  render(){
    console.log('Polls');
    console.log(this.props);
    var bodyPanels = BP(this.props);
    console.log('panelBody');
    console.log(bodyPanels);
    return(
        <div className="panel panel-primary">
            <div className="panel-heading">
                <h3 className="panel-title">Select a poll to cast your vote</h3>
            </div>
            {bodyPanels}
        </div>
    )
  }
});

function BP(props){
  const polls = props.polls;
  const cb = props.cb;
  const links = polls.map((poll) =>
    <div className="panel-body" key={poll.id.toString() }><NavLink
              to={'/poll/' + poll.id}
              cb={cb} >
              {poll.name}
    </NavLink></div>
  );
  return (
    <span>
      {links}
    </span>

  );
}

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
    return <a className={this.props.cn} onClick={this.clickH} id={this.props.to} href={this.props.to}>{this.props.children}</a>;

  }
});

const Header = React.createClass({
  render() {
    console.log('header props');
    console.log(this.props);
    var isAuth = this.props.auth;
    // console.log('isAuth');
    // console.log(isAuth);
    var myHeader, name;
    isAuth.id ? name = <span className="navbar-text">Signed in as {isAuth.username}</span> : null
    if (isAuth.id !== undefined && isAuth.id !== false ) {
      console.log('is logged in');
      console.log(typeof isAuth);
      myHeader = <HeaderLogout cb={this.props.cb} isAuth={isAuth}/>;
    } else {
      console.log('not logged in');
      console.log(typeof isAuth);
      myHeader = <HeaderLogin cb={this.props.cb}/>;
    }
    return (
      <div>
        <nav className="navbar navbar-inversed">
          {myHeader}
          {name}
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
    console.log('HeaderLogout');
    console.log(this.props);
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
