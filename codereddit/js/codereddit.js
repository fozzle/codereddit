$(function(){
	var sub = grabHash(window.location.hash);
	posts = renderPost(sub);
	
	// Bind click event handlers to our expanders and collapsers.
	$('body').delegate(".expander", "click", function(){
		$(this).parents('ul').first().find('.comments').text('yo yo yo');
		$(this).attr('src', 'img/collapse.png');
		$(this).addClass('collapse');
		$(this).removeClass('expander');
	});
	$('body').delegate(".collapse", "click", function(){
		$(this).parents('ul').first().find('.comments').text('');
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
					posting += "<pre class='php'>$subreddit = $_GET[\""+subreddit+"\"]</pre>";
				}
				else {
					posting += "<pre class='php'>$subreddit = $_GET[\"frontpage\"];</pre>";
				}
				
				$('body').append(posting);
				$.each(items.data.children, function(entry){
					var true_entry = items.data.children[entry].data
					var title = createTitle(true_entry, entry);
					$.get('php.html', function(template) {
						template = template.replace("${title}",title);
						//if (true_entry.domain == "imgur.com"){
						//	true_entry.url == "i." + true_entry.url
						//}
						if (/\.(jpg)|(gif)|(png)$/.test(true_entry.url)){
							template = template.replace("${fancybox}", "image");
						}
						else if (/www.youtube.com/.test(true_entry.url)){
							template = template.replace("${fancybox}", "video");
						}
						else {
							template = template.replace("${fancybox}", "");
						}
						template = template.replace("${subreddit}", true_entry.subreddit);	
						template = template.replace("${url}", true_entry.url);
						template = template.replace("${author}", true_entry.author);
						template = template.replace("${score}", true_entry.score);
						template = template.replace("${domain}", true_entry.domain);
						template = template.replace("${fulltitle}", true_entry.title);
						template = template.replace("${num_comments}", true_entry.num_comments);
						$('body').append(template);
						$("pre.php").snippet("php", {style:"emacs", showNum: false, transparent: true, menu: false});
						//alert(title);
						$("a.image").fancybox({
							'transitionIn'	:	'elastic',
							'transitionOut'	:	'elastic',
							'speedIn'		:	600, 
							'speedOut'		:	200
						});
						$("a.video").fancybox({
							'padding' : 0,
							'autoScale' : false,
							'transitionIn' : 'elastic',
							'transitionOut' : 'elastic',
							'speedIn' : 600,
							'speedOut': 200,
							'title' : this.title,
							'width' : 640,
							'height': 385,
							'href' : this.href.replace(new RegExp("watch\\?v=", "i"), 'v/'),
							'type' : 'swf',
							'swf' : {
								'wmode' : 'transparent',
								'allowfullscreen' : 'true'
							}
						});
						$("#loading").remove();
					});
			
				});		
		});
		return posts;
}
		
function createTitle(entry, number){
	var post;
	
	// Emulate camel case, slice ridiculous title lengths, and remove characters.
	var title = entry.title
				.toLowerCase().substr(0,20).replace(/\W+/gi, '').split(' ');
	for (token in title){
		title[token] = title[token].charAt(0).toUpperCase() + title[token].slice(1);
	};
	title = title.join('');
	return title;
}
function grabHash(hash){
	return hash.replace('#','');
}
function getComments(entry){
	var subreddit = entry.subreddit;
	alert(subreddit);
	return subreddit;
}

