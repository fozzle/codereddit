'use strict';

let React = require('react');

let Comment = React.createClass({
    displayName: 'CodeReddit Comment',
    getInitialState: function () {
      return {
        showComments: true
      };
    },
    toggleComments: function() {
      if(this.state.showComments == true) {
        this.setState({showComments: false});
      } else {
        this.setState({showComments: true});
      }
    },
    formatCommentText: function(){
      // If it's a self text we're going to output a large
      // comment block.
      if (!this.props.text) {
        return '';
      }

      var commentChars = [];
      switch (this.props.lang) {
        case 'python':
          commentChars[0] = '"""';
          commentChars[1] = '"""';
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

      var commentChars = [];
      var commentClass = "hljs-comment";
      switch (this.props.lang) {
        case 'python':
          commentChars[0] = '"""';
          commentChars[1] = '"""';
          commentClass = "hljs-string";
          break;
        case 'php':
        case 'javascript':
        case 'java':
          commentChars[0] = "/*";
          commentChars[1] = "*/";
          var commentClass = "hljs-comment";
      }

      let hiddenNode = <div className={commentClass}>{this.props.space}{commentChars[0]} Comments Hidden {commentChars[1]}</div>;

      switch (this.props.lang) {
        case 'php':
          return (
            <pre className="comment {this.props.lang}">
              {this.props.space}<a onClick={this.toggleComments}><span className="hljs-variable">$score</span> = <span className="hljs-number">{this.props.score}</span>; <span className="hljs-variable">$author =</span> <span className="hljs-string">{this.props.author}"</span>;</a><br/>
              <span className={commentClass}>{this.formatCommentText()}</span>
              {this.state.showComments ? commentNodes : hiddenNode}
            </pre>
          );
        case 'javascript':
          return (
            <pre className="comment {this.props.lang}">
            {this.props.space}<a onClick={this.toggleComments}><span className="hljs-keyword">var</span> score = <span className="hljs-number">{this.props.score}</span>, author = <span className="hljs-string">"{this.props.author}"</span>;</a><br/>
            <span className={commentClass}>{this.formatCommentText()}</span>
            {this.state.showComments ? commentNodes : hiddenNode}
            </pre>
          );
        case 'python':
          return (
            <pre className="comment {this.props.lang}">
            {this.props.space}<a onClick={this.toggleComments}>score = <span className="hljs-number">{this.props.score}</span>, author = <span className="hljs-string">"{this.props.author}"</span>;</a><br/>
            <span className={commentClass}>{this.formatCommentText()}</span>
            {this.state.showComments ? commentNodes : hiddenNode}
            </pre>
          );
        case 'java':
          return (
            <pre className="comment {this.props.lang}">
            {this.props.space}<a onClick={this.toggleComments}><span className="hljs-built_in">int</span> score = <span className="hljs-number">{this.props.score}</span>;</a><br/>
            {this.props.space}<a onClick={this.toggleComments}><span className="hljs-built_in">String</span> author = <span className="hljs-string">"{this.props.author}"</span>;</a><br/>
            <span className={commentClass}>{this.formatCommentText()}</span>
            {this.state.showComments ? commentNodes : hiddenNode}
            </pre>
          );
      }

    }
});

module.exports = Comment;
