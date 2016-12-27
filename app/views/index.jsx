'use strict'

//* User Story: As an authenticated user, I can keep my polls and come back later to access them.
//* User Story: As an authenticated user, I can share my polls with my friends.
//* User Story: As an authenticated user, I can see the aggregate results of my polls.
//* User Story: As an authenticated user, I can delete polls that I decide I don't want anymore.
//* User Story: As an authenticated user, I can create a poll with any number of possible items.
//* User Story: As an unauthenticated or authenticated user, I can see and vote on everyone's polls.
//* User Story: As an unauthenticated or authenticated user, I can see the results of polls in chart form.
//    (This could be implemented using Chart.js or Google Charts.)
//* User Story: As an authenticated user, if I don't like the options on a poll, I can create a new option.

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
    console.log('Query variable %s not found', variable);
}

class Main extends React.Component {
  constructor(props) {
    super(props);
    // console.log('auth');
    // console.log(auth);
    var pollId = getQueryVariable('poll');

    this.callBack = this.callBack.bind(this);
    if (auth === undefined) {
      auth = {id: false};
    }
    var allPolls = [];
    var path = '/';
    this.state = {auth, allPolls, path : path, pollId : pollId};
  }
  callBack(path, type, data){
    // console.log('Main callBack called');
    // console.log(path);
    // console.log(type);
    // console.log(data);
    if (type === 'new') {
      var allPolls = this.state.allPolls;
      allPolls.push(data.poll);
      var obj = {'path': path, 'poll': data, allPolls : allPolls};
    } else if (type === 'delete') {
      allPolls = this.state.allPolls.filter(item => {
        if (item._id !== data) {
          return item;
        }
      });
      var obj = {'path': path, allPolls : allPolls};
    }
     else {
      var obj = {'path': path, 'poll': data};
    }
    this.setState(obj)
  }
  componentDidMount(){
    // console.log('Main componentDidMount');
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
    // console.log('Main this.state');
    // console.log(this.state);
    var route, path = this.state.path;
    // console.log('Path: ');
    // console.log(path);
    var pollRe = /\/api\/poll\/\d+/;/\/api\/poll\/\d+/;/\/api\/poll\/\d+/;/\/api\/poll\/\d+/;

    var profileRe = /\/profile\/\d+/;/\/profile\/\d+/;/\/profile\/\d+/;/\/profile\/\d+/;
    var profileNewRe = /\/profile\/\d+\/new/;/\/profile\/\d+\/new/;/\/profile\/\d+\/new/;/\/profile\/\d+\/new/;
    // http://localhost:8080/?poll=585c1507467e68331b82eedb
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
    // console.log(this.props.data);
    var myChart = new Chart(ctx, this.props.data)
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
    e.preventDefault();
    var submitted = this.state.value;
    // console.log('submitted: ' + submitted);

    if (submitted === undefined) {
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
      fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(results)
      }).then(res => {
        return res.json();
      }).then(data => {
        // console.log('poll poll fetch data');
        // console.log(data);
        this.setState({poll : data, message : 'results'})
      });
    }
  },
  handleChange(e){
    // console.log('value: ' + e.target.value);
    this.setState({value: e.target.value});
  },
  handleDelete(e){
    // console.log('poll handleDelete');
    // console.log(e.target.);
    var id = this.state.poll._id;
    var url = '/api/poll/' + id;
    fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id : id})
    }).then(res => {
      return res.json();
    }).then(data => {
      // console.log('delet poll poll api res');
      // console.log(data);
      this.props.cb('/', 'delete', this.props.poll._id);
    });
  },
  handleEdit(e){
    // console.log(e.target.id);
    var option = document.getElementById('edit').value;
    document.getElementById('edit').value = '';
    var listItem = { key : option, value : 0};
    var newPoll = this.state.poll;
    newPoll.list.push({ key : option, value : 0})
    // poll = this.state.poll;
    // console.log(document.getElementById('edit').value);
    var id = this.state.poll._id;
    listItem.name = this.state.poll.name;
    var url = '/api/poll/' + id;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(listItem)
    }).then(res => {
      return res.json();
    }).then(data => {
      // console.log('edit poll returned data');
      // console.log(data);
      // console.log('listItem');
      // console.log(listItem);
      // console.log('newPoll');
      // console.log(newPoll);
      if (data.ok === 1) {
        this.setState({poll : newPoll})
      }
      // this.props.cb('/', 'delete', this.props.poll._id);
    });
  },
  render(){
    // console.log('Poll state');
    // console.log(this.state);
    // console.log('Poll props');
    // console.log(this.props);
    var pName, pLabels = [], pTotals = [];
    pName = this.state.poll.name;
    this.state.poll.list.forEach(item => {
      pLabels.push(item.key);
      pTotals.push(item.value);
    });
    var myData = {}
    myData.type = 'bar';
    myData.data = {};
    // myData.data.labels = ['Foo', 'Bar'];
    myData.data.labels = pLabels;
    myData.data.datasets = [];
    var dataSet = {};
    dataSet.label = "Total";
    // dataSet.data = [3,4];
    dataSet.data = pTotals;
    dataSet.backgroundColor = [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
    ];
    dataSet.borderColor = [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
    ];
    dataSet.borderWidth = 1;
    myData.data.datasets.push(dataSet);
    var myOptions = { scales: { yAxes: [{ticks: { beginAtZero:true }}] }};
    myOptions.title = {};
    // myOptions.title.text = 'Foo or Bar?';
    myOptions.title.text = pName;
    myOptions.title.display = true;
    myData.options = myOptions;

    var name = this.state.poll.name;
    var list = this.state.poll.list;
    var auth = this.props.auth;

    var items = list.map(function(item){
      return item.key
    });
    // pad a blank in the list
    if (items[0]!== '') {
      items.unshift('')
    }
    // console.log('myData');
    // console.log(myData);
    if (this.state.message === 'results') {
      var form = <PollResults poll={this.state.poll} cb={this.props.cb} myData={myData}/>
    } else {
      if (auth.id === false) {
        // console.log('auth false');
        var del = null;
        var edit = null;
      } else {
        // console.log('auth true');
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
          <MyChart data={myData}>
          </MyChart>
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
    // console.log('list');
    // console.log(items);
    // var poll = this.props.poll
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
        <MyChart data={myData}></MyChart>
      </Body>
    );
  }
});

const Profile = React.createClass({
  render() {
    // console.log('Profile');
    // console.log(this.props);
    // var uid = this.props.params.uid;
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
    console.log(typeof this.state.items);
    console.log(this.state.items);
    if (this.state.items.length <= 0) {
      var message = "Please supply a name and options";
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

      // console.log('Sending Poll:');
      // console.log(poll);

      // console.log('new poll submit id: ' + uid);
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
        // console.log('new poll fetch data');
        // console.log(data);
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
      // console.log('data posted');
    }
  },
  handleClick(e){
    const text = this.refs.atext.value;
    // console.log('form text...');
    // console.log(text);
    let items = text.split(',');
    // console.log(items);
    this.setState({items: items, buttonText: 'Update'})
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
          <form >
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
        this.props.cb(e.target.id, 'type test', 'data test');
      }
    }
  },
  getData(url){
    var myRequest = new Request(url);
    fetch(myRequest).then(res => {
      return res.json();
    }).then(data => {
      var type, urlArr = url.split('/');
      // console.log('url data');
      // console.log(urlArr);
      if (urlArr[3] === 'profile') {
        // console.log('profile');
        url = '/profile/' + urlArr[2];
        type = urlArr[3];
      }
      this.props.cb(url, type , data);
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
          {name}
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
            <NavLink cb={this.props.cb} cn='nav-link' to="/">All Polls</NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              cb={this.props.cb}
              cn='nav-link'
              to="/auth/twitter">
              Login with Twitter
            </NavLink>
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
    var uid = this.props.auth.id;
    // var profile = '/api/profile/' + uid;
    var profile = '/api/' + uid + '/profile';
    var profileNew = '/profile/' + uid + '/new';
    return(
    <div
        className="collapse navbar-collapse"
        id="header-links">
      <ul className="nav navbar-nav navbar-right">
        <li className="nav-item">
          <NavLink cb={this.props.cb} cn='nav-link' to="/">All Poll</NavLink>
        </li>
        <li className="nav-item">
          <NavLink cb={this.props.cb} cn='nav-link' to={profile}>My Polls</NavLink>
        </li>
        <li className="nav-item">
          <NavLink cb={this.props.cb} cn='nav-link' to={profileNew}>New Poll</NavLink>
        </li>
        <li className="nav-item">
          <NavLink cb={this.props.cb} cn='nav-link' to="/logout">Logout</NavLink>
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
      </p>
      <div id="credits">
        <div>
          <span className="credit">Created By: </span>
            <a href="https://github.com/j-steve-martinez" target="_blank">
            J. Steve Martinez
          </a>
        </div>
        <div>
          <div className="credit">Heroku:</div>
             <a href="#">
            vote-machine@heroku.com
          </a>
        </div>
        <div>
          <div className="credit">GitHub:</div>
             <a href="#">
            repo@github.com
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
