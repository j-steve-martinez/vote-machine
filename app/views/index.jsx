'use strict'

function BP(props){
  const polls = props.polls;
  const cb = props.cb;
  const links = polls.map((poll) =>
    <div className="panel-body" key={poll.id.toString() }><NavLink
              to={'/api/poll/' + poll.id}
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

function NewPollResults(props){
  let items = props.items;
  let title = items[0];
  let poll = items.filter((value, key) => {
    if (key > 0) {
      return value;
    }
  });
  let listItems = poll.map((value, key) =>
    <li key={key.toString()}>
     {value}
    </li>
  );
  return (
    <div>
      <h4>{title}</h4>
      <ul>{listItems}</ul>
    </div>

  );
}

class Main extends React.Component {
  constructor(props) {
    super(props);
    // console.log('auth');
    // console.log(auth);
    // this.getAllPolls();
    this.callBack = this.callBack.bind(this);
    if (auth === undefined) {
      auth = {id: false};
    }
    var allPolls = [];
    var path = '/';
    this.state = {auth, allPolls, path : path};
  }
  callBack(path, type, data){
    console.log('Main callBack called');
    console.log(path);
    console.log(type);
    console.log(data);
    var obj = {'path': path, 'poll': data}
    this.setState(obj);
  }
  componentDidMount(){
    this.getAllPolls();
  }
  getAllPolls(){
    var url = '/api/allPolls'
    var myRequest = new Request(url);
    fetch(myRequest).then(res => {
      return res.json();
    }).then(allPolls => {
      var polls = {};
      polls.allPolls = allPolls;
      // console.log(polls);
      this.setState(polls);
    });
  }
  render(){
    console.log('Main this.state');
    console.log(this.state);
    var route, path = this.state.path;
    console.log('Path: ');
    console.log(path);
    // \/poll\/\d
    // \/profile\/\d+
    var pollRe = /\/api\/poll\/\d+/;
    var profileRe = /\/profile\/\d+/;
    var profileNewRe = /\/profile\/\d+\/new/;

    // console.log(path.match(pollRe));
    // console.log(path.match(profileRe));

    switch (path) {
      case '/':
        route =(<Polls polls={this.state.allPolls} cb={this.callBack}/>)
        break;
      case '/about':
        route = (<About />)
        break;
      case (path.match(pollRe) || {}).input:
        route = (<Poll main={this.state} cb={this.callBack}>Poll Test</Poll>)
        break;
      case (path.match(profileNewRe) || {}).input:
        route = (<NewPoll auth={this.state.auth} cb={this.callBack}/>)
        break;
      case (path.match(profileRe) || {}).input:
        route = (<Profile data={this.state} cb={this.callBack}/>)
        console.log('Case match Profile' + path);
        break;
      default:
        route = (<Body title='Default Route'>Route not Found</Body>)
    }
    return(
      <div>
        <Header auth={this.state.auth} cb={this.callBack}/>
        {route}
      </div>
    )
  }
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
    // console.log('panelBody');
    // console.log(bodyPanels);
    return(
      <Body title="The Polls Are Open">
        <div className="panel panel-primary">
            <div className="panel-heading">
                <h3 className="panel-title">Select a poll to cast your vote</h3>
            </div>
            {bodyPanels}
        </div>
      </Body>
    )
  }
});

const Poll = React.createClass({
  getInitialState(){
    var mockData = {
      uid: 1,
      title: 'Best Thing',
      list : [
        {key: 'item1', value: 2},
        {key: 'item2', value: 5},
        {key: 'item3', value: 9}
      ]};
    return (
      {data: mockData, message: ''}
    )
  },
  handleSubmit(event){
    event.preventDefault();
    var submitted = this.state.value;
    console.log('submitted: ' + submitted);

    if (submitted === undefined) {
      var message = 'Please make a selection'
      this.setState({message: message})
    } else {
      console.log('form select...');
      console.log(submitted);

      var data = this.state.data;
      console.log(data);
    }
  },
  handleChange(event){
    console.log('value: ' + event.target.value);
    this.setState({value: event.target.value});
  },
  render(){
    console.log('Poll');
    console.log(this.state);
    console.log(this.props);
    // var num = this.props.params.num;
    var num = 1;
    var title = this.state.data.title;
    var list = this.state.data.list;
    var items = list.map(function(item){
      return item.key
    });

    if (items[0]!== '') {
      items.unshift('')
    }

    const myOptions = items.map((item, index) =>
     <option ref={item} key={index} value={item}>
       {item}
     </option>
    );
    var form =
      (<Body title={title}>
        <div>ID: {num}</div>
        <form onSubmit={this.handleSubmit}>
          <select value={this.state.value} onChange={this.handleChange}>
            {myOptions}
          </select>
          <div>
            <button type="submit">Submit</button>
          </div>
        </form>
        {this.state.message}
      </Body>)

    return (
      <div>
        {form}
      </div>
    )
  }
})

const Profile = React.createClass({
  render() {
    console.log('Profile');
    console.log(this.props);
    // var uid = this.props.params.uid;
    return (
      <Body title='User Profile'>
        <div>Get a list of the user polls and put here!</div>
      </Body>
    )
  }

});

const NewPoll = React.createClass({
  getInitialState() {
    return {
      items: [],
      buttonText : 'Create'
    }
  },
  handleSubmit(event){
    var poll = this.state.items;
    console.log('Poll:');
    console.log(poll);
    var uid = this.props.auth.id;
    console.log('new poll submit id: ' + uid);
    var url = '/api/' + uid + '/new'
    // var url = '/api/:id/new';
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(poll)
    }).then(res => {
      return res.json();
    }).then(data => {
      console.log('new poll fetch data');
      console.log(data);
      var url = '/api/poll/' + data.pollId;
      this.props.cb(url);
    });
    // fetch(myRequest).then(res => {
    //   return res.json();
    // }).then(allPolls => {
    //   var polls = {};
    //   polls.allPolls = allPolls;
    //   // console.log(polls);
    //   this.setState(polls);
    // });
    console.log('data posted');
    // ajaxRequest(method, url, callback);
    // ajaxRequest('POST', '/api/', callback);
    event.preventDefault()
  },
  handleClick(event){
    const text = this.refs.atext.value;
    // console.log('form text...');
    // console.log(text);
    let items = text.split(',');
    // console.log(items);
    this.setState({items: items, buttonText: 'Update'})
    event.preventDefault()
  },
  render() {
    console.log('NewPoll');
    console.log(this.state);
    console.log(this.props);
    if (this.state.items.length <= 0) {
      var ret = ''
    } else {
      var ret = <NewPollResults items={this.state.items} />
    }
    return (
      <Body title='New Poll'>
        <div>Enter a comma seperated list of items to poll.  The first item should be the poll title</div>
        <div>The first item should be the poll title. Example:</div>
        <code>Title, item1, item2, item3</code>
          <form action='/api/1/test'>
            <textarea ref='atext'></textarea>
            <div>
              <button ref='poll' onClick={this.handleClick}>{this.state.buttonText}</button>
            </div>
            {ret}
            <button ref='submit' onClick={this.handleSubmit}>Submit</button>
          </form>
      </Body>
    )
  }
})

const NavLink = React.createClass({
  clickH(e){
    // e.preventDefault();
    console.log('myClick');
    console.log(e.target.id);
    // prevent default for everything except login and logout
    if (e.target.id.indexOf('log') <= 0 && e.target.id.indexOf('github') <= 0) {
      e.preventDefault();
      // if api call get data or just call the callback
      if (e.target.id.indexOf('api') !== -1) {
        console.log('api called');
        this.getData(e.target.id)
      } else {
        console.log('other called');
        this.props.cb(e.target.id, 'type test', 'data test');
      }
    }
  },
  getData(url){
    // var url = '/api/allPolls'
    var myRequest = new Request(url);
    fetch(myRequest).then(res => {
      return res.json();
    }).then(data => {
      // var polls = {};
      // polls.allPolls = allPolls;
      // console.log('fetch: ' + url);
      // console.log(data);
      // console.log('NavLink calling callBack');
      this.props.cb(url, 'type test', data);
      // this.setState(polls);
    });

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
    var auth = this.props.auth;
    // console.log('auth');
    // console.log(auth);
    var myHeader, name;
    auth.id ? name = <span className="navbar-text">Signed in as {auth.username}</span> : null
    if (auth.id !== undefined && auth.id !== false ) {
      // console.log('is logged in');
      // console.log(typeof auth);
      myHeader = <HeaderLogout cb={this.props.cb} auth={auth}/>;
    } else {
      // console.log('not logged in');
      // console.log(typeof auth);
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
    var uid = this.props.auth.id;
    var profile = '/api/profile/' + uid;
    var profileNew = '/profile/' + uid + '/new';
    return(
      <ul className="nav navbar-nav">
        <li className="nav-item active">
          <NavLink cb={this.props.cb} cn='nav-link' to="/">Home</NavLink>
        </li>
        <li className="nav-item">
          <NavLink cb={this.props.cb} cn='nav-link' to={profileNew}>New Poll</NavLink>
        </li>
        <li className="nav-item">
          <NavLink cb={this.props.cb} cn='nav-link' to={profile}>Profile</NavLink>
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

const About = React.createClass({
  render(){
    return (
      <Body title="About App">
        <div>The Voting Machine</div>
        <div>By:<a href="https://github.com/j-steve-martinez" target="_blank">J. Steve Martinez</a></div>
      </Body>
    )
  }
})

ReactDOM.render(
  <Main />,
  document.getElementById('content')
);
