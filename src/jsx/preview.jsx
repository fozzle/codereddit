'use strict';

let React = require('react');

let Preview = React.createClass({

    displayName: 'CodeReddit Preview',

    // decodeHtml: function(str) {

  		// var element = document.createElement('div');
	   //  if(str && typeof str === 'string') {
	   //    // strip script/html tags
	   //    str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
	   //    str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
	   //    element.innerHTML = str;
	   //    str = element.textContent;
	   //    element.textContent = '';

	   //    return str;
	   //  }
    // },
    formatText: function(){
      // If it's a self text we're going to output a large
      // comment block.
      if (!this.props.selfText) {
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

      let text = this.props.selfText.split(/\r?\n/),
        new_text = this.props.space + commentChars[0] + "\n"
      for (let i = 0; i < text.length; i++) {
        new_text = new_text + this.props.space + text[i] + "\n";
      }
      return new_text + this.props.space + commentChars[1];
    },
    render: function() {
      
      	if(this.props.selfText) {
      		return <pre className="hljs-comment" style={{width:500 + 'px'}}>{this.formatText()}</pre>
      	}
      	
      	var imgurUrl = this.props.url.match(/(http:\/\/|https:\/\/)(imgur.com\/|i.imgur.com\/)([(A-Z)|(0-9)|(a-z)]){2,}/);

	  	var isImage = (/\.(gif|jpe?|tiff|png)$/i).test(this.props.url);

	  	var youTubeUrl = this.props.url.match(/^(?:http(?:s)?:\/\/)?(?:www\.)?(?:m\.)?(?:youtu\.be\/|youtube\.com\/(?:(?:watch)?\?(?:.*&)?v(?:i)?=|(?:embed|v|vi|user)\/))([^\?&"'>]+)/);

		//Imgur
      	if(imgurUrl != null) {
			if(this.props.url.endsWith('.gifv')) {
	  			return (
	  				<video autoPlay loop muted preload style={{maxWidth: 500 + 'px'}}>
						<source src={imgurUrl[0] + '.webm'} type="video/webm"/>
						<source src={imgurUrl[0] + '.mp4'} type="video/mp4"/>
					</video>
	  			);
	  		} 

	  		//No Extension - add .jpg to show image
	  		if(imgurUrl[0].length == this.props.url.length) {
	  			return <img src={imgurUrl[0] + '.jpg'} style={{maxWidth: 500 + 'px'}}></img>
	  		} else {
	  			return <img src={this.props.url} style={{maxWidth: 500 + 'px'}}></img>
	  		}
      	}

	  	//Generic Image
      	else if(isImage) {

  			return <img src={this.props.url} style={{maxWidth: 500 + 'px'}}></img>
      	}

      	else if(youTubeUrl) {
      		return <iframe width="500px" height="281px" src={'http://www.youtube.com/embed/' + youTubeUrl[1]} allowfullscreen></iframe>
      	}



      	return <div></div>
      	
    }
});

module.exports = Preview;