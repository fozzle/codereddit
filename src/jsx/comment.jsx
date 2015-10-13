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

      let text = this.props.text.replace(/(\r\n|\n|\r)/gm,""),
        new_text = this.props.space + "/*\n",
        num_splits = Math.floor(text.length / 80);
      for (let i = 0; i <= num_splits; i++) {
        new_text = new_text + this.props.space + text.substring(i * 80, (i+1)*80).trim() + "\n";
      }
      return new_text + this.props.space + "*/";
    },
    render: function() {
      let commentNodes = this.props.children.map(childComment => {
        let children = childComment.data.replies ? childComment.data.replies.data.children : [];
        return (
          <Comment key={childComment.data.id} children={children} author={childComment.data.author} score={childComment.data.score} text={childComment.data.body} space={this.props.space + "  "}/>
        );
      });
      return (
        <pre className="comment php">
        {this.props.space}$score = {this.props.score}; $author = "{this.props.author}";<br/>
        {this.formatCommentText()}
        {commentNodes}
        </pre>
      );
    }
});

module.exports = Comment;
