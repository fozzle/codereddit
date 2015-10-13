'use strict';

require("style!css!../../node_modules/highlight.js/styles/default.css");
require("style!css!../css/reset.css");

import React from 'react';
import axios from 'axios';
import Post from './post';
import Highlight from 'highlight.js';
import {Link} from 'react-router';

module.exports = React.createClass({
    displayName: 'CodeReddit',
    getInitialState: function() {
      return {data: [], loading: true, subreddit: this.props.params.subreddit || 'frontpage'};
    },
    componentDidMount: function() {
      this.retrieveData();
    },
    componentWillReceiveProps: function(nextProps) {
      this.setState({subreddit: nextProps.params.subreddit || 'frontpage'});
    },
    componentDidUpdate: function (prevProps, prevState) {
      this.highlightCode();
      if (prevState.subreddit !== this.state.subreddit) {
        this.retrieveData();
      }
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
    retrieveData: function() {
      let url = "http://www.reddit.com/";
      let subreddit = this.state.subreddit;
      if (subreddit === 'frontpage') {
        url += ".json";
      } else {
        url += "r/" + subreddit + ".json";
      }
      this.setState({loading: true});
      axios.get(url)
        .then(function(response) {
            this.setState({data: response.data.data.children, loading: false});
        }.bind(this))
        .catch(function(response) {
            this.setState({error: "error", loading: false});
        }.bind(this));
    },
    render: function() {
      var postNodes = this.state.data.map((post, i) => {
        return (
          <Post {...post.data} key={i} subredditHandler={this.switchSubreddit} />
        );
      });

      var loadingNode = (`function loadingRedditPosts() {
  // Please be patient!
}`);
      return (
          <pre>
            <code className='php'>
              <Link to={`about`}>require('readme.php');</Link><br/>
              <Link to={`/`}>$location</Link> = "{this.state.subreddit}";<br/>
              $language = <a onClick={this.handleLanguage}>"php"</a>;<br/>
              <br/>
              {this.state.loading ? loadingNode : postNodes}
            </code>
          </pre>
      );
    }
});
