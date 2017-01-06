'use strict'
var React = require('react');
var ReactDOM = require('react-dom');
var Chart = require('chart.js');

function BP(props){
  const polls = props.polls;
  const cb = props.cb;
  const links = polls.map((poll) =>
    <div className="panel-body bg-warning" key={poll._id.toString() }><NavLink
              to={'/api/poll/' + poll._id}
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

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    // console.log('Query variable %s not found', variable);
}

function getColors(num){
  // console.log('getting colors');
  var data = {c : [], bg : []};
  var myColors = Please.make_color({
    format: 'rgb',
    colors_returned: num
  });
  myColors.forEach(item => {
    var color = 'rgba(' + item.r + ', ' + item.g + ', ' + item.b + ', ' + '1)';
    var bg = 'rgba(' + item.r + ', ' + item.g + ', ' + item.b + ', ' + '0.2)';
    data.c.push(color);
    data.bg.push(bg);
  });
  // console.log(data);
  return data;
}

class Main extends React.Component {
  constructor(props) {
    super(props);
    // console.log('Main init');
    this.callBack = this.callBack.bind(this);
    var pollId = getQueryVariable('poll');
    var allPolls = [];
    var path = '/';
    // TODO: used for debugging set to false
    // var auth = {id : 243224486};
    var auth = {id : false};
    this.state = {auth, allPolls, path : path, pollId : pollId};
  }
  callBack(path, type, data){
    // console.log('Main callBack called');
    // console.log('path ' + path);
    // console.log('type ' + type);
    // console.log(data);
    switch (type) {
      case 'new':
        var allPolls = this.state.allPolls;
        allPolls.push(data.poll);
        var obj = {'path': path, 'poll': data, allPolls : allPolls};
        break;
      case 'delete':
        // console.log('cb delete');
        this.getAllPolls(path);
        break;
      case 'all':
        // console.log('cb all');
        var obj = {'path': path, allPolls : data};
        break;
      default:
        var obj = {'path': path, 'poll': data};
    }
    this.setState(obj)
  }
  getAllPolls(path){
    var path = path;
    var apiUrl = window.location.origin + '/api/allPolls';
    $.ajax({
      url : apiUrl,
      method: 'GET'
    }).then(allPolls => {
      var polls = {};
      polls.allPolls = allPolls;
      polls.path = path;
      this.setState(polls);
    });
  }
  componentDidMount(){
    // console.log('Main componentDidMount');
    this.getAllPolls('/');
  }
  componentWillMount(){
    // console.log('Main componentWillMount');
    var apiUrl = window.location.origin + '/api/:id';
    $.ajax({
      url : apiUrl,
      method: 'GET'
    }).then(auth => {
      this.setState({auth})
    })
  }
  render(){
  // console.log('Main this.state');
  // console.log(this.state);
    var route, path = this.state.path;
  // console.log('Path: ');
  // console.log(path);
    var pollRe = /\/api\/poll\/\w+/;
    var profileRe = /\/profile\/\w+/;
    var profileNewRe = /\/profile\/\w+\/new/;
    if (this.state.poll === undefined) {
      if (this.state.pollId !== undefined) {
        if (this.state.allPolls.length > 0) {
          var tmp = this.state.allPolls.filter(item => {
            // console.log('item');
            // console.log(item._id);
            if (item._id === this.state.pollId.toString()) {
              return item;
            }
          });
          var poll = tmp[0];
          path = '/api/poll/' + poll._id;
        }
      }
    } else {
      // console.log('this.state.poll');
      var poll = this.state.poll;
    }
    // console.log('using poll');
    // console.log(poll);

    switch (path) {
      case '/':
        route =(<Polls title="The Polls Are Open" polls={this.state.allPolls} cb={this.callBack}/>)
        break;
      case '/about':
        route = (<About />)
        break;
      case (path.match(pollRe) || {}).input:
        route = (<Poll auth={this.state.auth} poll={poll} cb={this.callBack}>Poll Test</Poll>)
        break;
      case (path.match(profileNewRe) || {}).input:
        route = (<NewPoll auth={this.state.auth} cb={this.callBack}/>)
        break;
      case (path.match(profileRe) || {}).input:
        route = (<Profile polls={this.state.poll} cb={this.callBack}/>)
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
    var one = (
            <div>
              <div  className="jumbotron center">
                <h2>{heading}</h2>
              </div>
              <div>{body}</div>
              <canvas id="myChart" width="400" height="400"></canvas>
            </div>
          );
    // console.log('Heading');
    // console.log(heading);
    if (heading.indexOf('Polls') >= 0 && heading.indexOf('Open') >= 0) {
      // console.log('Polls Open');
      var body = one;
    } else if (heading.indexOf('Polls') >= 0 && heading.indexOf('Your')) {
      // console.log('Results');
      var body = one;
    } else if (heading.indexOf('Vote Machine') >= 0) {
      var body = one;
    } else {
      // console.log('Poll');
      var body = (
        <div>
          <div className="jumbotron">
            <h2>{heading}</h2>
          </div>
            <div className="row">
              <div className="col-sm-6 poll" >
                {body}
              </div>
              <div className="col-sm-6 chart">
                <canvas id="myChart" width="400" height="400"></canvas>
              </div>
            </div>
        </div>
      );
    }
    return body
  }
});

const MyChart = React.createClass({
  componentDidMount(){
    var ctx = document.getElementById("myChart");
    // console.log('ctx');
    // console.log(ctx);
    // console.log(this.props);
    var pName, myChart,
    pLabels = [],
    pTotals = [],
    chartData = {},
    data = {},
    options = {},
    colors = getColors(this.props.poll.list.length);

    pName = this.props.poll.name;
    this.props.poll.list.forEach(item => {
      pLabels.push(item.key);
      pTotals.push(item.value);
    });

    data.label = "Total";
    data.data = pTotals;
    data.backgroundColor = colors.bg;
    data.borderColor = colors.c;
    data.borderWidth = 1;

    options = { scales: { yAxes: [{ticks: { beginAtZero:true }}] }};
    options.title = {};
    options.title.text = pName;
    options.title.display = true;

    chartData.type = 'bar';
    chartData.data = {};
    chartData.data.labels = pLabels;
    chartData.data.datasets = [];
    chartData.data.datasets.push(data);
    chartData.options = options;
  // console.log(chartData);
    myChart = new Chart(ctx, chartData)
  },
  render(){
    return null;
  }
});

const Polls = React.createClass({
  render(){
    // console.log('Polls');
    // console.log(this.props);
    var bodyPanels = BP(this.props);
    return(
      <Body title={this.props.title}>
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
    var poll = this.props.poll;
    return (
      {poll: poll, message: ''}
    )
  },

  handleSubmit(e){
    // console.log('poll handleSubmit');
    e.preventDefault();
    var submitted = this.state.value;
    // console.log('submitted: ' + submitted);
    // console.log(typeof submitted);

    if (submitted === undefined || submitted === '') {
      var message = 'Please make a selection'
      this.setState({message: message})
    } else {
      // console.log('form select...');
      // console.log(submitted);
      var results = {
        id : this.state.poll._id,
        name : this.state.poll.name,
        key : submitted
      }
      // console.log(results);
      var url = '/api/poll/' + results.id;
      $.ajax({
        url : url,
        data: JSON.stringify(results),
        method: 'PUT',
        contentType: "application/json",
        dataType: 'json'
      }).then(data => {
        // console.log('submitted done');
        // console.log(data);
        this.setState({poll : data, message : 'results'})
      });
    }
  },
  handleChange(e){
    e.preventDefault();
    // console.log('poll handleChange');
    // console.log('value: ' + e.target.value);
    this.setState({value: e.target.value});
  },
  handleDelete(e){
    e.preventDefault();
    // console.log('poll handleDelete');
    // console.log(e.target.);
    var pollId = this.state.poll._id;
    var apiUrl = window.location.origin + '/api/:id/' + pollId;
    $.ajax({
      url : apiUrl,
      method: 'DELETE'
    }).then(data => {
    // console.log('delete done');
    // console.log(data);
      this.props.cb('/', 'delete', data._id);
    })
  },
  handleEdit(e){
    e.preventDefault();
    // console.log('poll handleEdit');
    // console.log(e.target);
    var option = document.getElementById('edit').value;
    document.getElementById('edit').value = '';
    var listItem = { key : option, value : 0};
    var newPoll = this.state.poll;
    newPoll.list.push({ key : option, value : 0})

    var pollId = this.state.poll._id;
    listItem.name = this.state.poll.name;
    var uid = this.state.poll.uid;
    var apiUrl = window.location.origin + '/api/:id/' + pollId;

    $.ajax({
      url : apiUrl,
      // data: listItem,
      data: JSON.stringify(listItem),
      method: 'PUT',
      contentType: "application/json",
      dataType: 'json'
    }).then(data => {
      // console.log('edit done');
      // console.log(data);
      if (data.nModified === 1) {
        this.setState({poll : newPoll})
      }
    })
  },
  render(){
    // console.log('Poll state');
    // console.log(this.state);
    // console.log('Poll props');
    // console.log(this.props);
    var poll = this.state.poll
    var name = poll.name;
    var list = poll.list;
    var uid  = poll.uid;
    var auth = this.props.auth;

    var items = list.map(function(item){
      return item.key
    });
    // pad a blank in the list
    if (items[0]!== '') {
      items.unshift('')
    }

    if (this.state.message === 'results') {
      var form = <PollResults poll={this.state.poll} cb={this.props.cb}/>
    } else {
      if (auth.id === false || auth.id !== uid) {
        var del = null;
        var edit = null;
      } else {
        var del = (<button className='btn btn-danger btn-sm' onClick={this.handleDelete} type='button' name='delete'>Delete</button>);
        var edit = (
          <div className="form-group">
            <h5>Add a new option to the Poll:</h5>
            <button className='btn btn-warning btn-sm' onClick={this.handleEdit} type='button' name='edit'>Add Option</button>
            <input type="text" className="form-control" id="edit"></input>
          </div>
        )
      }
      const myOptions = items.map((item, index) =>
       <option ref={item} key={index} value={item}>
         {item}
       </option>
      );
      var form =
      (
        <Body title={name}>
          <form
            className="form-group"
            onSubmit={this.handleSubmit}>

            <h5>Please make a selection:</h5>
            <select
              autoFocus
              className="form-control"
              id="take-poll"
              value={this.state.value}
              onChange={this.handleChange}>
              {myOptions}
            </select>
            <button
              className='btn btn-success btn-sm'
              type='button'
              type="submit">Submit</button>
            {del}
            {edit}
          </form>
          <Tweet poll={this.state.poll}/>
          <h3>
            {this.state.message}
          </h3>
          <MyChart poll={this.state.poll}></MyChart>
        </Body>
      )
    }

    return (
      <div>
        {form}
      </div>
    )
  }
})

const PollResults = React.createClass({
  render(){
    // console.log('Poll Results');
    // console.log(this.props);
    var myData = this.props.myData;

    var items = this.props.poll.list.map((data, key) => {
      return (
          <div className="panel-body"  key={key}>
            <span>
              {data.key}
            </span>
            <span className="badge">
              {data.value}
            </span>
          </div>
      )
    })

    return (
      <Body title={this.props.poll.name}>
        <div className="panel panel-primary">
          <div className="panel-heading">
            <h3 className="panel-title">
              Results
            </h3>
          </div>
        </div>
        {items}
        <MyChart poll={this.props.poll}></MyChart>
      </Body>
    );
  }
});

const Profile = React.createClass({
  render() {
    // console.log('Profile');
    // console.log(this.props);
    return (<Polls title="These Are Your Polls" polls={this.props.polls} cb={this.props.cb}/>);
  }
});

const NewPoll = React.createClass({
  getInitialState() {
    return {
      items: [],
      buttonText : 'Create',
      message : ''
    }
  },
  handleSubmit(e){
    e.preventDefault();
    var message,uid,poll,name, list = [];
    uid = this.props.auth.id;
    // console.log(typeof this.state.items);
    // console.log(this.state.items);
    if (this.state.items.length < 3) {
      var message = "Please supply a title and a minimum of two options using the Create button!";
      this.setState({message : message});
    } else {
      this.state.items.forEach((value, key) => {
        var obj = {key : value, value : 0};
        key === 0 ? name = value : list.push(obj);
      });
      // console.log(name);
      // console.log(list);
      // console.log(uid);
      poll = {name : name, uid : uid, list : list}

      var url = '/api/:id/new';
      $.ajax({
        url : url,
        data: JSON.stringify(poll),
        method: 'POST',
        contentType: "application/json",
        dataType: 'json'
      })
      .then(data => {
        if (data.isExists) {
          message = "Poll Name Already Taken!";
          this.setState({message : message});
        } else {
          if (data.isSaved) {
            var url = '/';
            this.props.cb(url, 'new', data);
          } else {
            message = "Error saving data";
            this.setState({message : message});
          }
        }
      });
    }
  },
  handleClick(e){
    const text = this.refs.atext.value;
    let items = text.split(',');
    if (items.length < 3) {
      var message = "Please supply a title and a minimum of two options using the Create button!";
      // this.setState({message : message});
    } else {
      var message = '';
    }
    // console.log(items);
    this.setState({items: items, buttonText: 'Update', message : message})
    e.preventDefault()
  },
  render() {
    // console.log('NewPoll');
    // console.log(this.state);
    // console.log(this.props);
    if (this.state.items.length <= 0) {
      var ret = ''
    } else {
      var ret = <NewPollResults items={this.state.items} />
    }
    return (
      <Body title='New Poll'>
        <div>Enter a comma seperated list of items to poll.  The first item should be the poll title</div>
        <div>The first item should be the poll title. Example:</div>
        <span className="text-danger bg-warning">[ Title, Item1, Item2, Item3 ]</span>
        <h4>{this.state.message}</h4>
        {ret}
          <form >
            <textarea ref='atext' autoFocus></textarea>
            <div>
              <button ref='poll' className='btn btn-primary' onClick={this.handleClick}>{this.state.buttonText}</button>
              <button ref='submit' className='btn btn-success' onClick={this.handleSubmit}>Submit</button>
            </div>
          </form>
      </Body>
    )
  }
})

const NavLink = React.createClass({
  clickH(e){
    // console.log('NavLink myClick');
    // console.log(e.target.id);

    // prevent default for everything except login and logout
    if (e.target.id.indexOf('log') <= 0 && e.target.id.indexOf('auth') <= 0) {
      e.preventDefault();
      // if api call get data or just call the callback
      if (e.target.id.indexOf('api') !== -1) {
        // console.log('NavLink api called');
        this.getData(e.target.id)

      } else {
        // console.log('NavLink other called');
        this.props.cb(e.target.id, 'header', false);
      }
    }
  },
  getData(data){
    var id,url,method,type,route;
    // console.log('url');
    // console.log(data);
    var arr = data.split('/');
    // console.log(arr);
    if (arr[2] === 'poll') {
      // console.log('poll');
      id = arr[3];
      url = '/api/poll/' + id;
      route = url;
      method = 'GET';
      type = 'poll';
    } else if (arr[2] === 'allPolls') {
      // console.log('allPolls');
      id = 'none'
      url = '/api/allPolls';
      method = 'GET';
      type = 'all'
      route = '/'
    } else {
      id = arr[2];
      url = '/api/:id/profile';
      route = '/profile/' + id;
      method = 'GET';
      type = 'profile';
    }

    // console.log('navlink all data');
    // console.log(id);
    // console.log(url);
    // console.log(route);
    // console.log(method);
    // console.log(type);

    $.ajax({
      url : url,
      method: method
    })
    .then(res => {
      this.props.cb(route, type, res);
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
    // console.log('header props');
    // console.log(this.props);
    var auth = this.props.auth;
    // console.log('auth');
    // console.log(auth);
    var myHeader;
    if (auth.id !== undefined && auth.id !== false ) {
      // console.log('is logged in');
      myHeader = <HeaderLogout cb={this.props.cb} auth={auth}/>;
    } else {
      // console.log('not logged in');
      myHeader = <HeaderLogin cb={this.props.cb}/>;
    }
    return (
      <div>
        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <div className="navbar-header">
              <button
                type="button"
                className="navbar-toggle collapsed"
                data-toggle="collapse"
                data-target="#header-links"
                aria-expanded="false">
                <span className="sr-only">
                  Toggle navigation
                </span>
                <span className="icon-bar">
                </span>
                <span className="icon-bar">
                </span>
                <span className="icon-bar">
                </span>
              </button>
              <NavLink cb={this.props.cb} cn='navbar-brand' to="/">Vote Machine</NavLink>
            </div>
          {myHeader}
          </div>
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
      <div
        className="collapse navbar-collapse"
        id="header-links">
        <ul className="nav navbar-nav navbar-right">
          <li className="nav-item">
            <NavLink cb={this.props.cb} cn='nav-link' to='/api/allPolls'>Polls</NavLink>
          </li>
          <li className="dropdown">
            <a href="#"
               className="dropdown-toggle"
               data-toggle="dropdown"
               role="button"
               aria-haspopup="true"
               aria-expanded="false">Login<span className="caret"></span></a>
            <ul className="dropdown-menu">
              <li className="nav-item">
                <NavLink
                  cb={this.props.cb}
                  cn='nav-link'
                  to="/auth/twitter">
                  Twitter
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  cb={this.props.cb}
                  cn='nav-link'
                  to="/auth/github">
                  Github
                </NavLink>
              </li>
            </ul>
          </li>
          <li className="nav-item">
            <NavLink
              cb={this.props.cb}
              cn='nav-link'
              to="/about">About</NavLink>
          </li>
        </ul>
      </div>
    )
  }
})

const HeaderLogout = React.createClass({
  render(){
    // console.log('HeaderLogout');
    // console.log(this.props);
    var username = this.props.auth.username;
    var uid = this.props.auth.id;
    var profile = '/api/' + uid + '/profile';
    var profileNew = '/profile/' + uid + '/new';
    return(
    <div className="collapse navbar-collapse" id="header-links">
      <ul className="nav navbar-nav navbar-right">
        <li className="nav-item">
          <NavLink cb={this.props.cb} cn='nav-link' to='/api/allPolls'>Polls</NavLink>
        </li>
        <li className="dropdown">

          <a href="#"
             className="dropdown-toggle"
             data-toggle="dropdown"
             role="button"
             aria-haspopup="true"
             aria-expanded="false">{username}<span className="caret"></span></a>
          <ul className="dropdown-menu">
            <li className="nav-item">
              <NavLink cb={this.props.cb} cn='nav-link' to={profile}>My Polls</NavLink>
            </li>
            <li className="nav-item">
              <NavLink cb={this.props.cb} cn='nav-link' to={profileNew}>New Poll</NavLink>
            </li>
            <li role="separator" className="divider"></li>
            <li className="nav-item">
              <NavLink cb={this.props.cb} cn='nav-link' to="/logout">Logout</NavLink>
            </li>
          </ul>
        </li>
        <li className="nav-item">
          <NavLink cb={this.props.cb} cn='nav-link' to="/about">About</NavLink>
        </li>
      </ul>
    </div>
    )
  }
})

const About = React.createClass({
  render(){
    return (
      <Body title="Vote Machine">
        <p className='about bg-warning'>
          This web site is for the <a href="https://www.freecodecamp.com" target="_blank">freeCodeCamp </a>
        Dynamic Web Applications Project:
        <a href="https://www.freecodecamp.com/challenges/build-a-voting-app" target="_blank"> Build a Voting App</a>.
          <br></br>
          <br></br>
        It is a full stack web application that uses
        <a href="https://www.mongodb.com/" target="_blank"> mongoDB </a>
         for the back end database,
        <a href="https://nodejs.org" target="_blank"> Node.js </a>
         for the web server and
         <a href="https://facebook.github.io/react/" target="_blanks"> React.js </a>
          to render html in the client browser.
        <br></br>
        <br></br>
        The app also uses
        <a href="http://getbootstrap.com" target="_blank"> Bootstrap </a>
          for the style sheets and
        <a href="http://www.chartjs.org" target="_blank"> Chart.js </a> to render the data in a bar chart.
        <br></br>
        <br></br>
        <span id='warning'>
          This application is for educational purposes only.  Any and all data may be removed at anytime without warning.
        </span>
      </p>
      <div id="credits">
        <div>
          <span className="credit">Created By: </span>
            <a className='link' href="https://github.com/j-steve-martinez" target="_blank">
            J. Steve Martinez
          </a>
        </div>
        <div>
          <div className="credit">Heroku:</div>
             <a className='link' href="https://vote-machine-jsm.herokuapp.com/">
            https://vote-machine-jsm.herokuapp.com
          </a>
        </div>
        <div>
          <div className="credit">GitHub:</div>
             <a className='link' href="https://github.com/j-steve-martinez/vote-machine">
            https://github.com/j-steve-martinez/vote-machine
          </a>
        </div>
      </div>

    </Body>
    )
  }
})

const Tweet = React.createClass({
  componentDidMount(){
    // console.log(this.props.poll);
    var id = this.props.poll._id;
    var name = 'New Poll: ' + this.props.poll.name;
    var url = window.location.href + '?poll=' + id;
    var elem = document.getElementById('twit-share');
    var data = {};
    data.text = name;
    data.size = 'large';
    twttr.widgets.createShareButton(url, elem, data);
  },
  render(){
    return <a id='twit-share'></a>
  }
});

ReactDOM.render(
  <Main />,
  document.getElementById('content')
);
