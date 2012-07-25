$(function(){
	var sub = grabHash(window.location.hash);
	posts = renderPost(sub);
	
	// Bind click event handlers to our expanders and collapsers.
	$('body').delegate(".expander", "click", function(){
		if ($(this).parents('ul').first().find('.comments').is(':empty')){
			$(this).parents('ul').first().find('.comments').html("<img src='img/load.gif' />"))
			getComments($(this).attr('id'), $(this).parents('ul').first().find('.comments'));
		}
		else {
			$(this).parents('ul').first().find('.comments').show();
		}
		$(this).attr('src', 'img/collapse.png');
		$(this).addClass('collapse');
		$(this).removeClass('expander');
		
	});
	$('body').delegate(".collapse", "click", function(){
		$(this).parents('ul').first().find('.comments').hide();
		$(this).attr('src', 'img/expand.png');
		$(this).addClass('expander');
		$(this).removeClass('collapse');	
	});
	// On a hash change, be sure to reload the page.
	$(window).bind('hashchange', function(e){
		var hash = e.fragment;
		$('body').html('');
		renderPost(hash);
	});
});

	 
function renderPost(subreddit){
		//Determine what subreddit we want, contact reddit accordingly.
		if (subreddit != ''){
			subreddit = "http://www.reddit.com/r/"+subreddit+"/.json?jsonp=?";
		}
		else {
			subreddit = "http://www.reddit.com/.json?jsonp=?";
		}
		var posts = $.getJSON(subreddit,
			 function(posts) {
				var posting;
				var items = posts;
				subreddit = window.location.hash
				posting = "<pre class='php'>\n\
require('<a href='readme.html'>readme.php</a>');\n\
session_start();</pre>"
				if (subreddit){
					posting += "<pre class='php'>$subreddit = $_GET[\""+subreddit+"\"];</pre>";
				}
				else {
					posting += "<pre class='php'>$subreddit = $_GET[\"frontpage\"];</pre>";
				}
				
				$('body').append(posting);

				$.get('php.html', function(template){
					
					$.each(items.data.children, function(entry){
						var code_templ = template;
						var true_entry = items.data.children[entry].data
						var title = createTitle(true_entry, entry);
						//$.get('php.html', function(template) {
							code_templ = code_templ.replace("${title}",title);
							
							if (true_entry.selftext){
								code_templ = code_templ.replace("${selftext}", formatCommentText(true_entry.selftext, "    "));
							}
							else {
								code_templ = code_templ.replace("${selftext}", "");
							}

							// People sometimes post non-direct images, most commonly imgur.com
							// this block will guess the direct link equivalent. Not very accurately...Need to look into changing this.
							// if (true_entry.domain == "imgur.com"){
							// 	true_entry.url = true_entry.url.replace("imgur.com", "i.imgur.com") + ".jpg"			
							// }
							if (/\.(jpg)|(gif)|(png)$/.test(true_entry.url)){
								code_templ = code_templ.replace("${fancybox}", "image");
							}
							else if (/www.youtube.com/.test(true_entry.url)){
								code_templ = code_templ.replace("${fancybox}", "video");
							}
							else {
								code_templ = code_templ.replace("${fancybox}", "");
							}
							code_templ = code_templ.replace("${subreddit}", true_entry.subreddit);
							code_templ = code_templ.replace("${suburl}", "#" + true_entry.subreddit);	
							code_templ = code_templ.replace("${url}", true_entry.url);
							code_templ = code_templ.replace("${author}", true_entry.author);
							code_templ = code_templ.replace("${score}", true_entry.score);
							code_templ = code_templ.replace("${domain}", true_entry.domain);
							code_templ = code_templ.replace("${fulltitle}", true_entry.title);
							code_templ = code_templ.replace("${num_comments}", true_entry.num_comments);
							code_templ = code_templ.replace("${entry_id}", true_entry.name);
							$('body').append(code_templ);
							$("pre.php").snippet("php", {style:"emacs", showNum: false, transparent: true, menu: false});
							//alert(title);
							$("a.image").fancybox({
								'transitionIn'	:	'elastic',
								'transitionOut'	:	'elastic',
								'speedIn'		:	600, 
								'speedOut'		:	200
							});
							// TODO: Take a look at this, it's for youtube videos in fancybox.
							//$("a.video").fancybox({
							//	'padding' : 0,
							//	'autoScale' : false,
							//	'transitionIn' : 'elastic',
							//	'transitionOut' : 'elastic',
							//	'speedIn' : 600,
							//	'speedOut': 200,
							//	'title' : this.title,
							//	'width' : 640,
							//	'height': 385,
							//	'href' : this.href.replace(new RegExp("watch\\?v=", "i"), 'v/'),
							//	'type' : 'swf',
							//	'swf' : {
							//		'wmode' : 'transparent',
							//		'allowfullscreen' : 'true'
							//	}
							//});
							
						//});
					
					});		
				});
				
		});
		return posts;
}
		
function createTitle(entry, number){
	var post;
	
	// Emulate camel case, slice ridiculous title lengths, and remove characters.
	var title = entry.title
				.toLowerCase().substring(0,20).replace(/[^A-Za-z0-9\s\s+]/gi, '').split(' ');
	for (token in title){
		title[token] = title[token].charAt(0).toUpperCase() + title[token].slice(1);
	};
	title = title.join('');
	return title;
}

function grabHash(hash){
	return hash.replace('#','');
}

function getComments(raw_id, comment_location){
	// Retrieve and display comments
	var id = raw_id.replace('t3_', '');
	var text = '';
	var comment_url = 'http://www.reddit.com/comments/' + id + '.json?jsonp=?';
	var comments = $.getJSON(comment_url, function(comments){
		comments = comments[1].data.children.slice(0,20);
		$.each(comments, function(comment){
			template = "	$author = \"${commenter}\";\n\
	$score = ${score};\n\
	${text} \n\n\n"
			template = template.replace('${commenter}', comments[comment].data.author);
			template = template.replace('${score}', comments[comment].data.ups - comments[comment].data.downs);
			template = template.replace('${text}', formatCommentText(comments[comment].data.body, "    "));
			text += template;
		});
		comment_location.text(text);
		comment_location.snippet("php", {style:"emacs", showNum: false, transparent: true, menu: false});
		
	});
	return text;
}
function formatCommentText(text, space){
	// If it's a self text we're going to output a large
	// comment block.
	text = text.replace(/(\r\n|\n|\r)/gm,"");
	var new_text = "";
	num_splits = Math.floor(text.length / 80);
	i = 0
	while (i <= num_splits){
		new_text = new_text + "// " + text.substring(i * 80, (i+1)*80) + "\n" + space;
		i++;
	}
	return new_text;
}