require("style!css!../../node_modules/highlight.js/styles/default.css");
require("style!css!../css/reset.css");

let React = require('react');
let axios = require('axios');
let Post = require('./post');
let Highlight = require('highlight.js');

module.exports = React.createClass({
    displayName: 'CodeReddit',
    getInitialState: function() {
      return {data: [], subreddit: 'frontpage'};
    },
    componentDidMount: function() {
      this.retrieveData('frontpage');
    },
    componentDidUpdate: function (prevProps, prevState) {
      this.highlightCode();
    },
    highlightCode: function() {
      let domNode = this.getDOMNode();
      let nodes = domNode.querySelectorAll('pre code');
      if (nodes.length > 0) {
        for (let i = 0; i < nodes.length; i=i+1) {
          Highlight.highlightBlock(nodes[i]);
        }
      }
    },
    switchSubreddit: function(event) {
        this.retrieveData(event.target.innerHTML);
    },
    retrieveData: function(subreddit) {
      let url = "http://www.reddit.com/";
      if (subreddit === 'frontpage') {
        url += ".json";
      } else {
        url += "r/" + subreddit + ".json"
      }
      axios.get(url)
        .then(function(response) {
            this.setState({data: response.data.data.children, subreddit: subreddit});
        }.bind(this))
        .catch(function(response) {
            this.setState({error: "error"});
        }.bind(this));
    },
    render: function() {
      var postNodes = this.state.data.map(post => {
        return (
          <Post {...post.data} subredditHandler={this.switchSubreddit} />
        );
      });
      return (
          <pre>
            <code className='php'>
              <a href="about.html">require('readme.php');</a><br/>
              $location = "{this.state.subreddit}";<br/>
              $language = <a onClick={this.handleLanguage}>"php"</a>;<br/>
              <br/>
              {postNodes}
            </code>
          </pre>
      );
    }
});