'use strict';

import React from 'react';
import axios from 'axios';
import { Link } from 'react-router';
import Comment from './comment';
import Highlight from 'highlight.js';

module.exports = React.createClass({
    displayName: 'CodeReddit Post',
    getInitialState: function () {
      return {
        comments: []
      };
    },
    componentDidUpdate: function (prevProps, prevState) {
      this.highlightCode();
    },
    highlightCode: function() {
      let domNode = this.getDOMNode();
      let nodes = domNode.querySelectorAll('.comment');
      if (nodes.length > 0) {
        for (let i = 0; i < nodes.length; i=i+1) {
          Highlight.highlightBlock(nodes[i]);
        }
      }
    },
    toggleComments: function () {
      if (this.state.comments.length) {
        this.setState({comments: [], loading: false});
      } else {
        this.setState({loading: true});
        axios.get('http://www.reddit.com/comments/' + this.props.id + '.json')
        .then(response => {
          setTimeout(x => this.setState({comments: response.data[1].data.children, loading: false}), 0);
        })
        .catch(response => {
          this.setState({comments: [], loading: false});
        });
      }

    },
    shortenedTitle: function() {
      let titleTokens = this.props.title.toLowerCase().substring(0,20).replace(/[^A-Za-z0-9\s\s+]/gi, '').split(' ');
      let title = titleTokens.reduce(function(prev, curr) {
        return prev + curr.charAt(0).toUpperCase() + curr.slice(1);
      }, '');
      return title;
    },
    render: function() {
      let commentNodes = this.state.comments.map(childComment => {
        let children = childComment.data.replies ? childComment.data.replies.data.children : [];
        return (
            <Comment key={childComment.data.id} children={children} author={childComment.data.author} score={childComment.data.score} text={childComment.data.body} space={"  "} />
        );
      });
      let loadingNode = <Comment author={`CodeReddit-system`} score={1337} children={[]} text={`Loading comments...`} space={"  "}></Comment>;
      let linkNode = <Link to={`/${this.props.subreddit}`}>{this.props.subreddit}</Link>;
      return (
        <pre>
          function {this.shortenedTitle()}($score={this.props.score}, $subreddit="{linkNode}"){' {'}<br/>
            {'  '}$author = "{this.props.author}";<br/>
            {'  '}$link = <a href={this.props.url}>"{this.props.url}"</a>;<br/>
            {'  '}$fullTitle = "{this.props.title}";<br/><br/>
            {'  '}// Click to load comments{'\n'}
            {'  '}<a onClick={this.toggleComments}>for ($numComments = 0; $numComments {'<'}= {this.props.num_comments}; $numComments++){' {'}</a><br/>
          {'  '}{this.state.loading ? loadingNode : commentNodes}<br/>
            {'  }'}<br/>
          {'}'}
          <br/>
          <br/>
        </pre>
      );
    }
});
