'use strict';

let React = require('react');

let Comment = React.createClass({
    displayName: 'CodeReddit Comment',
    formatCommentText: function(){
      // If it's a self text we're going to output a large
      // comment block.
      if (!this.props.text) {
        return '';
      }

      var commentChars = [];
      switch (this.props.lang) {
        case 'python':
          commentChars[0] = "'''";
          commentChars[1] = "'''";
          break;
        case 'php':
        case 'javascript':
        case 'java':
          commentChars[0] = "/*";
          commentChars[1] = "*/";
      }

      let text = this.props.text.replace(/(\r\n|\n|\r)/gm,""),
        new_text = this.props.space + commentChars[0] + "\n",
        num_splits = Math.floor(text.length / 80);
      for (let i = 0; i <= num_splits; i++) {
        new_text = new_text + this.props.space + text.substring(i * 80, (i+1)*80).trim() + "\n";
      }
      return new_text + this.props.space + commentChars[1];
    },
    render: function() {
      let commentNodes = this.props.children.map(childComment => {
        let children = childComment.data.replies ? childComment.data.replies.data.children : [];
        return (
          <Comment key={childComment.data.id} children={children} author={childComment.data.author} lang={this.props.lang} score={childComment.data.score} text={childComment.data.body} space={this.props.space + "  "}/>
        );
      });

      switch (this.props.lang) {
        case 'php':
          return (
            <pre className="comment {this.props.lang}">
            {this.props.space}$score = {this.props.score}; $author = "{this.props.author}";<br/>
            {this.formatCommentText()}
            {commentNodes}
            </pre>
          );
        case 'javascript':
          return (
            <pre className="comment {this.props.lang}">
            {this.props.space}var score = {this.props.score}, author = "{this.props.author}";<br/>
            {this.formatCommentText()}
            {commentNodes}
            </pre>
          );
        case 'python':
          return (
            <pre className="comment {this.props.lang}">
            {this.props.space}score = {this.props.score}, author = "{this.props.author}"<br/>
            {this.formatCommentText()}
            {commentNodes}
            </pre>
          );
        case 'java':
          return (
            <pre className="comment {this.props.lang}">
            {this.props.space}int score = {this.props.score};<br/>
            {this.props.space}String author = "{this.props.author}";<br/>
            {this.formatCommentText()}
            {commentNodes}
            </pre>
          );
      }

    }
});

module.exports = Comment;
