'use strict';

require("style!css!../../node_modules/highlight.js/styles/zenburn.css");
require("style!css!../css/reset.css");

import React from 'react';
import axios from 'axios';
import Post from './post';
import Highlight from 'highlight.js';
import {Link} from 'react-router';

let LANGS = ['php', 'javascript', 'python', 'java'];

module.exports = React.createClass({
    displayName: 'CodeReddit',
    getInitialState: function() {
      return {
        data: [],
        loading: true,
        subreddit: this.props.params.subreddit || 'frontpage',
        subreddits: [],
        lang: this.props.location.query.lang || LANGS[0]
      };
    },
    componentDidMount: function() {
      this.retrieveData();
    },
    componentWillReceiveProps: function(nextProps) {
      this.setState({subreddit: nextProps.params.subreddit || 'frontpage', lang: nextProps.location.query.lang});
    },
    componentDidUpdate: function (prevProps, prevState) {
      this.highlightCode();
      if (prevState.subreddit !== this.state.subreddit) {
        this.retrieveData();
      }
      if (prevState.lang !== this.state.lang) {
        // Reload UI
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
      this.showSubreddits();
    },
    handleLanguageChange: function() {
      var langIndex = (LANGS.indexOf(this.state.lang)+1) % LANGS.length;
      this.props.history.pushState(null, '/', {lang: LANGS[langIndex]});
    },
    showSubreddits: function() {
      axios.get('https://www.reddit.com/subreddits.json')
      .then(response => {
        var results = response.data.data.children;
        var subreddits = [];
        for(let i = 0; i < results.length; i++) {
          let subredditName = results[i].data.display_name;
          subreddits.push(subredditName);
        }
        this.setState({subreddits: subreddits});
      })
    },
    render: function() {
      var postNodes = this.state.data.map((post, i) => {
        return (
          <Post {...post.data} key={i} subredditHandler={this.switchSubreddit} lang={this.state.lang} />
        );
      });

      var subredditNodes = this.state.subreddits.map((subreddit, i) => {
        return (
          <Link key={i} to={`/${subreddit}?lang=${this.state.lang}` }>"{subreddit}"{i == this.state.subreddits.length - 1 ? '' :', '}</Link>
        );
      });

      var loadingNode = (`function loadingRedditPosts() {
  // Please be patient!
}`);
      switch (this.state.lang) {
        case 'php':
          return (
              <pre>
                <code className={this.state.lang}>
                  <Link to={`about`}>require('readme.php');</Link><br/>
                  <Link to={`/?lang=${this.state.lang}`}>$location</Link> = "{this.state.subreddit}";<br/>
                  $locations = [{subredditNodes}];<br/>
                  $language = <a onClick={this.handleLanguageChange}>"{this.state.lang}"</a>;<br/>
                  <br/>
                  {this.state.loading ? loadingNode : postNodes}
                </code>
              </pre>
          );
        case 'javascript':
          return (
              <pre>
                <code className={this.state.lang}>
                  <Link to={`about`}>import Readme from 'readme';</Link><br/>
                  <Link to={`/?lang=${this.state.lang}`}>var location</Link> = "{this.state.subreddit}";<br/>
                  var locations = [{subredditNodes}];<br/>
                  var language = <a onClick={this.handleLanguageChange}>"{this.state.lang}"</a>;<br/>
                  <br/>
                  {this.state.loading ? loadingNode : postNodes}
                </code>
              </pre>
          );
        case 'python':
          return (
              <pre>
                <code className={this.state.lang}>
                  <Link to={`about`}>from readme import *</Link><br/>
                  <Link to={`/?lang=${this.state.lang}`}>location</Link> = "{this.state.subreddit}"<br/>
                  locations = [{subredditNodes}];<br/>
                  language = <a onClick={this.handleLanguageChange}>"{this.state.lang}"</a>;<br/>
                  <br/>
                  {this.state.loading ? loadingNode : postNodes}
                </code>
              </pre>
          );
        case 'java':
          return (
              <pre>
                <code className={this.state.lang}>
                  <Link to={`about`}>import com.codereddit.Readme;</Link><br/>
                  <Link to={`/?lang=${this.state.lang}`}>String location</Link> = "{this.state.subreddit}";<br/>
                  String[] locations = {'{'}{subredditNodes}{'}'};<br/>
                  String language = <a onClick={this.handleLanguageChange}>"{this.state.lang}"</a>;<br/>
                  <br/>
                  {this.state.loading ? loadingNode : postNodes}
                </code>
              </pre>
          );
      }

    }
});
