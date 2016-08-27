'use strict';

import React from 'react';
import axios from 'axios';
import { Link } from 'react-router';
import Comment from './comment';
import Preview from './preview';
import Highlight from 'highlight.js';

module.exports = React.createClass({
    displayName: 'CodeReddit Post',
    getInitialState: function () {
      return {
        comments: [],
        showPreview: false
      };
    },
    componentDidUpdate: function (prevProps, prevState) {
      this.highlightCode();
    },
    highlightCode: function() {
      let domNode = this.getDOMNode();
      let comments = domNode.querySelectorAll('.comment');

      for (let i = 0; i < comments.length; i++) {
        Highlight.highlightBlock(comments[i]);
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
    togglePreview: function() {
      if(this.state.showPreview == true) {
        this.setState({showPreview:false});
      } else {
        this.setState({showPreview:true});
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
            <Comment lang={this.props.lang} key={childComment.data.id} children={children} author={childComment.data.author} score={childComment.data.score} text={childComment.data.body} space={"  "} />
        );
      });
      let loadingNode = <Comment lang={this.props.lang} author={`CodeReddit-system`} score={1337} children={[]} text={`Loading comments...`} space={"  "}></Comment>;
      let linkNode = <Link to={`/${this.props.subreddit}?lang=${this.props.lang}` }>{this.props.subreddit}</Link>;
      let preview = <Preview url={this.props.url} selfText={this.props.selftext} lang={this.props.lang}  space={"  "}></Preview>;

      switch (this.props.lang) {
        case 'php':
          return (
            <pre>
              function {this.shortenedTitle()}($score={this.props.score}, $subreddit="{linkNode}"){' {'}<br/>
                {'  '}$author = "{this.props.author}";<br/>
                {'  '}$link = <a href={this.props.url} target="_blank">"{this.props.url}"</a>;<br/>
                {'  '}$fullTitle = "{this.props.title}";<br/><br/>
                {'  '}$preview = <a onClick={this.togglePreview}>"toggle"</a>;{this.state.showPreview ? <br/> : ''}{this.state.showPreview ? preview : ''}<br/>
                {'  '}<br/>
                {'  '}// Click to load comments{'\n'}
                {'  '}<a onClick={this.toggleComments}>for ($numComments = 0; $numComments {'<'}= {this.props.num_comments}; $numComments++){' {'}</a><br/>
              {'  '}{this.state.loading ? loadingNode : commentNodes}<br/>
                {'  }'}<br/>
              {'}'}
              <br/>
              <br/>
            </pre>
          );
        case 'javascript':
          return (
            <pre>
              function {this.shortenedTitle()}(score={this.props.score}, subreddit="{linkNode}"){' {'}<br/>
                {'  '}var author = "{this.props.author}";<br/>
                {'  '}var link = <a href={this.props.url}>"{this.props.url}"</a>;<br/>
                {'  '}var fullTitle = "{this.props.title}";<br/><br/>
                {'  '}var preview = <a onClick={this.togglePreview}>"toggle"</a>;{this.state.showPreview ? <br/> : ''}{this.state.showPreview ? preview : ''}<br/><br/>
                {'  '}// Click to load comments{'\n'}
                {'  '}<a onClick={this.toggleComments}>for (var numComments = 0; numComments {'<'}= {this.props.num_comments}; numComments++){' {'}</a><br/>
              {'  '}{this.state.loading ? loadingNode : commentNodes}<br/>
                {'  }'}<br/>
              {'}'}
              <br/>
              <br/>
            </pre>
          );
        case 'python':
          return (
            <pre>
              def {this.shortenedTitle()}(score={this.props.score}, subreddit="{linkNode}"):<br/>
                {'  '}author = "{this.props.author}"<br/>
                {'  '}link = <a href={this.props.url}>"{this.props.url}"</a><br/>
                {'  '}fullTitle = "{this.props.title}"<br/><br/>
                {'  '}preview = <a onClick={this.togglePreview}>"toggle"</a>;{this.state.showPreview ? <br/> : ''}{this.state.showPreview ? preview : ''}<br/><br/>
                {'  '}// Click to load comments{'\n'}
                {'  '}<a onClick={this.toggleComments}>for numComments in range(0, {this.props.num_comments}):</a><br/>
              {'  '}{this.state.loading ? loadingNode : commentNodes}<br/>
                <br/>
              <br/>
              <br/>
            </pre>
          );
        case 'java':
        return (
          <pre>
            public void {this.shortenedTitle()}(int score, String subreddit){' {'}<br/>
              {'  '}int finalScore = score > 0 ? score : {this.props.score};<br/>
              {'  '}String finalSubreddit = subreddit != null ? subreddit : "{linkNode}";<br/>
              {'  '}String author = "{this.props.author}";<br/>
              {'  '}String link = <a href={this.props.url} target="_blank">"{this.props.url}"</a>;<br/>
              {'  '}String fullTitle = "{this.props.title}";<br/><br/>
              {'  '}String preview = <a onClick={this.togglePreview}>"toggle"</a>;{this.state.showPreview ? <br/> : ''}{this.state.showPreview ? preview : ''}<br/><br/>
              {'  '}// Click to load comments{'\n'}
              {'  '}<a onClick={this.toggleComments}>for (int numComments = 0; numComments {'<'}= {this.props.num_comments}; numComments++){' {'}</a><br/>
            {'  '}{this.state.loading ? loadingNode : commentNodes}<br/>
              {'  }'}<br/>
            {'}'}
            <br/>
            <br/>
          </pre>
        );
      }

    }
});
