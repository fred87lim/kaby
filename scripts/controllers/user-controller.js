var phonecatApp = angular.module('phonecatApp', ['ngRoute', 'ngResource', 'PopInTownControllers', 'phonecatServices', 
	'ngSanitize', 'angularFileUpload', 'ui.bootstrap'],
	function ($interpolateProvider) {
		$interpolateProvider.startSymbol('[[');
        $interpolateProvider.endSymbol(']]');
	});

var PopInTownControllers = angular.module('PopInTownControllers', [ ]);

var phonecatServices = angular.module('phonecatServices', ['ngResource']);

angular.module('phonecatFilters', []).filter('unescapeHTML', function (text) {
	if (text) {
    return text.
        replace(/&amp;/g, '&').
        replace(/&lt;/g, '<').
        replace(/&gt;/g, '>').
        replace(/&#39;/g, '\'').
        replace(/&quot;/g, '"');
  }
  return '';
});

phonecatApp.filter('titlecase', function() {
    return function(s) {
        s = ( s === undefined || s === null ) ? '' : s;
        return s.toString().toLowerCase().replace( /\b([a-z])/g, function(ch) {
            return ch.toUpperCase();
        });
    };
});

phonecatServices.factory('ProfileService', function ($http) {
	return {
		terminateSession: function (session_id) {
			return $http.delete('/sessions/' + session_id);
		},
		deleteExperience: function (expId) {
			return $http.delete('/experiences/' + expId);
		},
		addExperience: function (inputs) {
			return $http.post('/experiences', inputs);
		},
		editExperience: function (inputs) {
			return $http.put('/experiences', inputs);
		},
		editBasicInfo: function (inputs) {
			return $http.put('/info', inputs);
		},
		addLanguage: function (inputs) {
			return $http.post('/languages', inputs)
		},
		addEducation: function (inputs) {
			return $http.post('/educations', inputs);
		},
		deleteEducation: function (eduId) {
			return $http.delete('/educations/' + eduId);
		},
		cropProfilePicture: function (data) {
			return $http.post('/profile_picture/crop', data);
		},
		findTags: function (keyword) {
			return $http.get('/api/v2/settings/tags?k=' + keyword);
		},
		addNewTag: function (inputs) {
			return $http.post('/tags', inputs);
		},
		addNewCategory: function (inputs) {
			return $http.post('/categories', inputs);
		},
		findArticlesByUsername: function (username) {
			return $http.get('/ajax/' + username + '/articles');
		},
		findUserByUsername: function (username) {
			return $http.get('/ajax/user/' + username);
		},
		follow: function (targetUsername) {
			return $http.post('/ajax/follow/' + targetUsername, null);
		},
		newArticle: function (inputs) {
			return $http.post('/articles', inputs);
		},
		findFollowing: function (targetUsername) {
			return $http.get('/ajax/user/' + targetUsername + '/following');
		},
		findFollowers: function (targetUsername) {
			return $http.get('/ajax/user/' + targetUsername + '/followers');
		}
	}
});

PopInTownControllers.controller('MainCtrl', ['$scope', '$location', '$window', 'ProfileService', '$sce', '$upload', 
	'$filter', '$http', '$interval',
	function ($scope, $location, $window, ProfileService, $sce, $upload, $filter, $http, $interval) {

	/*
	 * Parse title to url-friendly. The function get invoked on keyup event.
	 */
	$scope.processUrl = function () {
		var url = '';
		var title = $scope.article.title;

		if (title) {
			title = title.trim();
			title = title.replace(/[^a-zA-Z0-9]/g, '-');
			title = title.replace(/-{2,}/g, '-');

			console.log($filter);

			title = $filter('lowercase')(title);
		}

		$scope.article.slug = title;
	};

	$scope.themeList = [
		{name: 'Chrome', value: 'chrome', label: 'Bright'},
		{name: 'Clouds', value: 'clouds', label: 'Bright'},
		{name: 'Crimson Editor', value: 'crimson_editor', label: 'Bright'},
		{name: 'Dreamweaver', value: 'dreamweaver', label: 'Bright'},
		{name: 'Eclipse', value: 'eclipse', label: 'Bright'},
		{name: 'Github', value: 'github', label: 'Bright'},
		{name: 'Solarized Light', value: 'solarized_light', label: 'Bright'},
		{name: 'Textmate', value: 'textmate', label: 'Bright'},
		{name: 'Tomorrow', value: 'tomorrow', label: 'Bright'},
		{name: 'Xcode', value: 'xcode', label: 'Bright'},
		{name: 'Kuroir', value: 'kuroir', label: 'Bright'},
		{name: 'Katzenmilch', value: 'katzenmilch', label: 'Bright'},

		{name: 'Ambiance', value: 'ambiance', label: 'Dark'},
		{name: 'Chaos', value: 'chaos', label: 'Dark'},
		{name: 'Clouds Midnight', value: 'clouds_midnight', label: 'Dark'},
		{name: 'Cobalt', value: 'cobalt', label: 'Dark'},
		{name: 'Monokai', value: 'monokai', label: 'Dark'},
		{name: 'Idle Fingers', value: 'idle_fingers', label: 'Dark'},
		{name: 'krTheme', value: 'kr_theme', label: 'Dark'},
		{name: 'Merbivore', value: 'merbivore', label: 'Dark'},
		{name: 'Merbivore Soft', value: 'merbivore_soft', label: 'Dark'},
		{name: 'Mono Industrial', value: 'mono_industrial', label: 'Dark'},
		{name: 'Pastel on dark', value: 'pastel_on_dark', label: 'Dark'},
		{name: 'Solarized Dark', value: 'solarized_dark', label: 'Dark'},
		{name: 'Terminal', value: 'terminal', label: 'Dark'},
		{name: 'Tomorrow Night', value: 'tomorrow_night', label: 'Dark'},
		{name: 'Tomorrow Night Blue', value: 'tomorrow_night_blue', label: 'Dark'},
		{name: 'Tomorrow Night Bright', value: 'tomorrow_night_bright', label: 'Dark'},
		{name: 'Tomorrow Night 80s', value: 'tomorrow_night_eighties', label: 'Dark'},
		{name: 'Twilight', value: 'twilight', label: 'Dark'},
		{name: 'Vibrant Ink', value: 'vibrant_ink', label: 'Dark'},
	];

	$scope.languageList = [
		{name: 'ABAP', value: 'abap'},
		{name: 'ActionScript', value: 'actionscript'},
		{name: 'ADA', value: 'ada'},
		{name: 'Apache Conf', value: 'apache_conf'},
		{name: 'AsciiDoc', value: 'asciidoc'},
		{name: 'Assembly x86', value: 'assembly_x86'},
		{name: 'AutoHotKey', value: 'autohotkey'},
		{name: 'BatchFile', value: 'batchfile'},
		{name: 'C9Search', value: 'c9search'},
		{name: 'C/C++', value: 'c_cpp'},
		{name: 'Cirru', value: 'cirru'},
		{name: 'Clojure', value: 'clojure'},
		{name: 'Cobol', value: 'cobol'},
		{name: 'CoffeeScript', value: 'coffee'},
		{name: 'ColdFusion', value: 'coldfusion'},
		{name: 'C#', value: 'csharp'},
		{name: 'CSS', value: 'css'},
		{name: 'Curly', value: 'curly'},
		{name: 'D', value: 'd'},
		{name: 'Dart', value: 'Dart'},
		{name: 'Diff', value: 'diff'},
		{name: 'Dot', value: 'Dot'},
		{name: 'Erlang', value: 'erlang'},
		{name: 'EJS', value: 'ejs'},
		{name: 'Forth', value: 'forth'},
		{name: 'FreeMarker', value: 'ftl'},
		{name: 'Gherkin', value: 'gherkin'},
		{name: 'Glsl', value: 'glsl'},
		{name: 'Go', value: 'golang'},
		{name: 'Groovy', value: 'groovy'},
		{name: 'HAML', value: 'haml'},
		{name: 'Handlebars', value: 'handlebars'},
		{name: 'Haskell', value: 'haskell'},
		{name: 'haXe', value: 'haxe'},
		{name: 'HTML', value: 'html'},
		{name: 'HTML (Ruby)', value: 'html_ruby'},
		{name: 'INI', value: 'ini'},
		{name: 'Jack', value: 'jack'},
		{name: 'jade', value: 'Jade'},
		{name: 'Java', value: 'java'},
		{name: 'Javascript', value: 'javascript'},
		{name: 'JSON', value: 'json'},
		{name: 'JSONiq', value: 'jsoniq'},
		{name: 'JSP', value: 'jsp'},
		{name: 'JSX', value: 'jsx'},
		{name: 'Julia', value: 'julia'},
		{name: 'LaTeX', value: 'latex'},
		{name: 'LESS', value: 'less'},
		{name: 'Liquid', value: 'liquid'},
		{name: 'Lisp', value: 'lisp'},
		{name: 'LiveScript', value: 'livescript'},
		{name: 'LogiQL', value: 'logiql'},
		{name: 'LSL', value: 'lsl'},
		{name: 'LUA', value: 'lua'},
		{name: 'LuaPage', value: 'luapage'},
		{name: 'Lucene', value: 'lucene'},
		{name: 'Makefile', value: 'makefile'},
		{name: 'MARLAB', value: 'matlab'},
		{name: 'Markdown', value: 'markdown'},
		{name: 'MEL', value: 'mel'},
		{name: 'MySQL', value: 'mysql'},
		{name: 'MUSHCode', value: 'mushcode'},
		{name: 'Nix', value: 'nix'},
		{name: 'Objective-C', value: 'objectivec'},
		{name: 'OCaml', value: 'ocaml'},
		{name: 'Pascal', value: 'pascal'},
		{name: 'Perl', value: 'perl'},
		{name: 'pgSQL', value: 'pgsql'},
		{name: 'PHP', value: 'php'},
		{name: 'Powershell', value: 'powershell'},
		{name: 'Prolog', value: 'prolog'},
		{name: 'Properties', value: 'properties'},
		{name: 'Protobuf', value: 'protobuf'},
		{name: 'Python', value: 'python'},
		{name: 'R', value: 'r'},
		{name: 'RDoc', value: 'rdoc'},
		{name: 'RHTML', value: 'rhtml'},
		{name: 'Ruby', value: 'ruby'},
		{name: 'Rust', value: 'rust'},
		{name: 'SASS', value: 'sass'},
		{name: 'SCAD', value: 'scad'},
		{name: 'Scala', value: 'scala'},
		{name: 'Smarty', value: 'smarty'},
		{name: 'Scheme', value: 'scheme'},
		{name: 'SCSS', value: 'scss'},
		{name: 'SH', value: 'sh'},
		{name: 'SJS', value: 'sjs'},
		{name: 'Space', value: 'space'},
		{name: 'snippets', value: 'snippets'},
		{name: 'Soy Template', value: 'soy_template'},
		{name: 'SQL', value: 'sql'},
		{name: 'Stylus', value: 'stylus'},
		{name: 'SVG', value: 'svg'},
		{name: 'Tcl', value: 'tcl'},
		{name: 'Tex', value: 'tex'},
		{name: 'Text', value: 'text'},
		{name: 'Textile', value: 'textile'},
		{name: 'Toml', value: 'toml'},
		{name: 'Twig', value: 'twig'},
		{name: 'Typescript', value: 'typescript'},
		{name: 'VBScript', value: 'vbscript'},
		{name: 'Velocity', value: 'velocity'},
		{name: 'Verilog', value: 'verilog'},
		{name: 'XML', value: 'xml'},
		{name: 'XQuery', value: 'xquery'},
		{name: 'YAML', value: 'yaml'}
	];

	$scope.sizeList = [
		{name: '10px', value: '10px'},
		{name: '11px', value: '11px'},
		{name: '12px', value: '12px'},
		{name: '13px', value: '13px'},
		{name: '14px', value: '14px'},
		{name: '16px', value: '16px'},
		{name: '18px', value: '18px'},
		{name: '20px', value: '20px'},
		{name: '24px', value: '24px'},
		
	];

	$scope.settings = null;
	$scope.selectedCategory = null;
	$scope.selectedPrivacy = null;

	$scope.article = {
		title: null,
		slug: null,
		content: null,
		tags: [],
		privacy: null,
		category: null,
		lastSaved: null,
		error: null
	}

	$scope.user = {
		username: null,
		articles: null,
		data: null,
		following: null,
		followers: null
	}
	/*
	 * Init when the page is load
	 */
	$scope.init = function (username) {
		$scope.user.username = username;
		console.log(username);

		// find user by username
		$scope.findUserByUsername();

		// Find following
		$scope.findFollowing();

		$scope.findFollowers();
		
		// find article
		$scope.findArticlesByUsername();
	};

	$scope.findFollowing = function () {
		ProfileService.findFollowing($scope.user.username).success(function (result) {
    		console.log(result);
    		if (result.status) {
    			$scope.user.following = result.data;
    		} else {

    		}
    	});
	}

	$scope.findFollowers = function () {
		ProfileService.findFollowers($scope.user.username).success(function (result) {
			console.log('Followes:');
    		console.log(result);
    		if (result.status) {
    			$scope.user.followers = result.data;
    		} else {

    		}
    	});
	}

	$scope.findUserByUsername = function () {
		ProfileService.findUserByUsername($scope.user.username).success(function (result) {
    		console.log(result);
    		if (result.status) {
    			$scope.user.data = result.data;
    		} else {

    		}
    	});
	}

	$scope.follow = function () {
		ProfileService.follow($scope.user.username).success(function (result) {
			if (result.status) {
    			
    		} else {

    		}
		});
	}

	$scope.findArticlesByUsername = function () {
		ProfileService.findArticlesByUsername($scope.user.username).success(function (result) {
    		console.log(result);
    		if (result.status) {
    			$scope.user.articles = result.data;
    		} else {

    		}
    	});
	}

	$scope.initMce = function () {

		tinymce.init({
			mode : "specific_textareas",
        	editor_selector : "mceArticleEditor",
        	content_css : "mce-content.css",
        	menubar:false,
        	plugins: [
		        "advlist autolink lists link image charmap print preview hr anchor pagebreak",
		        "searchreplace wordcount visualblocks visualchars code fullscreen",
		        "insertdatetime media nonbreaking save table contextmenu directionality",
		        "emoticons template paste textcolor"
		    ],
			toolbar: ["bold italic underline strikethrough undo redo bullist numlist blockquote alignleft aligncenter alignright alignjustify | styleselect | link image | ", 
						"code preview outdent indent link unlink hr image preview table",
						"mybutton"],
		    setup: function(editor) {
		        editor.addButton('mybutton', {
		            text: 'My button',
		            icon: false,
		            onclick: function() {
		                //editor.insertContent('Main button');
		                var content = editor.getContent();

		                var currentPosition = editor.getWin().getSelection();
		                var node = editor.getWin().getSelection().anchorNode;
		                var data = '';
		                var codeData = '';

		                if (node && editor.getWin().getSelection().anchorNode.data) {
		                	data = editor.getWin().getSelection().anchorNode.data;
		                	codeData = data;


		                }

		                // if data is null meaning insert new code

		                // remove code tag
		                if (data) {

		                	// Editing current code
		                	$scope.codeEditing.isEditing = true;

		                	// set content for node
		                	//editor.getWin().getSelection().anchorNode.data = 'Test';

		                	// get parent node
		                	var parentNode = editor.getWin().getSelection().anchorNode.parentNode;
		                	var parentId = parentNode.id;

		                	console.log('Parent Id: ' + parentId);

		                	codeData = codeData.replace(/^\[code \S+ \S+ \S+ \]/, '');
		                	codeData = codeData.replace('[/code]', '');
		                	codeData = codeData.trim();
		            	} else {

		            		// Inserting new code
		            		$scope.codeEditing.isEditing = false;
		            	}
		                //var firstPart = content.substring(0, currentPosition);
		                //var secondPart = content.substring(currentPosition, content.length);

		                console.log(currentPosition);

		                // Temporarily set content for ACE editor, later we have to trim off data. 
		                // Only get content between code tag.
		                var aceEditor = ace.edit("editor");

		                var whitespace = '<br />';
						var newline = '&nbsp;&nbsp;&nbsp;&nbsp;';
						var newLineFind = new RegExp(newline, 'g');
						var whitespaceFind = new RegExp(whitespace, 'g');
		                
		                // replace html new line with text counterpart
						//content = content.replace(newLineFind, '\n');
						//content = content.replace(whitespaceFind, '\t');
						content = $scope.stripHTML(content);

		                //aceEditor.getSession().setValue($scope.codeHighlight.content);
		                aceEditor.getSession().setValue(codeData);
		                console.log('Convert code to ACE: ' + content + '/Data: ' + data);
		                $('#codeModal').modal('show');

		                // set focus for ACE editor
		                aceEditor.focus();
		            }
		        });
		    }
		});
	}

	$scope.initMceArticle = function (){
		console.log('Init');
		tinymce.init({
			mode : "specific_textareas",
        	editor_selector : "mceArticleEditor",
        	menubar:false,
        	statusbar : false,
        	auto_focus: "article-editor",
        	content_css : "mce-content.css",
			toolbar: ["bold italic underline  bullist numlist"]
		});
	};

	$scope.codeHighlight = {
		language: $scope.languageList[40],
		theme: $scope.themeList[16],
		size: $scope.sizeList[5],
		content: ''
	};

	// There are two modes code insertion. New insert and edit.
	// When the current caveat is outside of code tag. It is considered as new code insertion.
	// When the current caveat is inside of code tags. It is considered as code editing.
	$scope.codeEditing = {
		isEditing: false
	};

	$scope.post = {
		title: '',
		url: '',
		urlTitle: '',
		content: '',
		tags: '',
		categories: '',
		loginToken: ''
	}



	/*
	 *	Publish new article
	 */
	$scope.publishArticle = function () {
		// check if title is not null
		if ($scope.article.title == null) {
			$scope.article.error = 'You are missing the title of this article';
			return;
		}

		// Get Tiny MCE content
		var content = tinyMCE.activeEditor.getContent();

		// Convert Tags Objects to IDs
		var tags = [];
		for (var i = 0; i < $scope.article.tags.length; i++) {
			tags.push($scope.article.tags[i]._id);
		}

		// Http post
		ProfileService.newArticle({
    		title: 		$scope.article.title, 
    		slug: 		$scope.article.slug,
    		content: 	content,
    		tags: 		tags,
    		category: 	$scope.article.category._id,
    		privacy: 	$scope.article.privacy._id
    	}).success(function (result) {
    		console.log(result);
    	});
	}

	
	$scope.trustedHtml = function (plainText) {
		var value = plainText.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, '\'').replace(/&quot;/g, '"');
		
            return $sce.trustAsHtml(value);
    };

    /*
	 * Change ACE editor font size
	 */
	$scope.changeFontSize = function() {
		//toastr.info($scope.codeHighlight.size);
		var editor = ace.edit("editor");
		editor.setFontSize($scope.codeHighlight.size.value);
	};

	/*
	 * Change ACE code editor theme
	 */
	$scope.changeTheme = function() {
		var editor = ace.edit("editor");

		editor.setTheme('ace/theme/' + $scope.codeHighlight.theme.value);
	};

	/*
	 * Change ACE programming language.
	 */
	$scope.changeLanguage = function() {
		var editor = ace.edit("editor");
		editor.getSession().setMode('ace/mode/' + $scope.codeHighlight.language.value);
	};

	/*
	 * Add source code to TinyMCE editor.
	 */
	$scope.addCodeToTinyMCE = function() {
		var editor = ace.edit("editor");
		var theme = $scope.codeHighlight.theme.value;
		var size = $scope.codeHighlight.size.value;
		var language = $scope.codeHighlight.language.value;

		// get code from dialog
		var code = editor.getSession().getValue();

		$scope.codeHighlight.content = code;

		var whitespace = '\t';
		var newline = '\n';
		var newLineFind = new RegExp(newline, 'g');
		var whitespaceFind = new RegExp(whitespace, 'g');

		// replace new line with html counterpart
		//code = code.replace(/\n/ig, '<br/>');

		// replace whitespace with html counterpart
		//code = code.replace(whitespaceFind, '&nbsp;&nbsp;&nbsp;&nbsp;');

		// wrap code content with custom tag
		var wrapup = "<pre id='code-highlight'>\n[code language='" + language + "' theme='" + theme + "' size='" + size + "' ]\n" + code
			+ "\n[/code]\n</pre>";
		console.log('Add code to tiny MCE: ' + wrapup);

		// If user is editing code, we need to replace the current node with the updated one.
		// If user is inserting new code, we append the code to the current position of caveat.
		if ($scope.codeEditing.isEditing) {
			var newValue = "[code language='" + language + "' theme='" + theme + "' size='" + size + "' ]\n" + code
			+ "\n[/code]";
			tinyMCE.activeEditor.getWin().getSelection().anchorNode.parentNode.innerHTML = newValue;
		} else {
			// insert wrapup code to tinyMCE editor
			//tinyMCE.execCommand('mceInsertContent', true, '<p>' + wrapup + '</p>');
			tinyMCE.activeEditor.selection.setContent(wrapup);
		}
		
		// Sets the content of a specific editor (my_editor in this example)
		//tinyMCE.activeEditor.setContent(wrapup);

		// close code highlight dialog
		$('#codeModal').modal('hide');
	}

	$scope.stripHTML = function (html) {
	   var tmp = document.createElement("DIV");
	   tmp.innerHTML = html;
	   return tmp.textContent || tmp.innerText ;
	};

	$scope.customSelected = undefined;
	$scope.tagsSelected = [];
	$scope.asyncSelected = undefined;

  	$scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
  	// Any function returning a promise object can be used to load values asynchronously
  	$scope.getLocation = function(val) {
    	return $http.get('http://maps.googleapis.com/maps/api/geocode/json', {
      		params: {
        	address: val,
        	sensor: false
      	}
    }).then(function(response) {
      	return response.data.results.map(function(item){
        	return item.formatted_address;
      	});
    	});
  	};

  	$scope.removeTag = function (tag) {
  		var index = $scope.article.tags.indexOf(tag);
  		if (index > -1) {
		    $scope.article.tags.splice(index, 1);
		}
  	}

  	$scope.newTag = {
  		name: null,
  		slug: null,
  		errors: []
  	}

  	$scope.selectedCategory = {};
  	$scope.newCategory = {
  		name: null,
  		slug: null
  	}

  	$scope.onTypeaheadSelect = function ($item, $model, $label) {
  		if ($model._id == -1) {
  			// add new tag do database
  			$scope.newTag.name = $model.realName;
  			$scope.newTag.slug = $model.slug;

  			$('#newTagModal').modal('toggle');
  			console.log($model);
  			$scope.customSelected = undefined;
  			return;
  		}
    	$scope.article.tags.push($model);
    	//console.log($scope.tagsSelected);
    	$scope.customSelected = undefined;
	};

	$scope.showAddNewCategory = function () {
		$('#newCategoryModal').modal('toggle');
	}

	$scope.showSchedulePost = function () { 
		$('#scheduleModal').modal('toggle');
	}

	$scope.today = function() {
    	$scope.dt = new Date();
  	};
  	$scope.today();

  	$scope.clear = function () {
    	$scope.dt = null;
  	};


  	$scope.toggleMin = function() {
    	$scope.minDate = $scope.minDate ? null : new Date();
  	};
  	$scope.toggleMin();

  	$scope.open = function($event) {
    	$event.preventDefault();
    	$event.stopPropagation();

    	$scope.opened = true;
  	};

  	$scope.dateOptions = {
    	formatYear: 'yy',
    	startingDay: 1
  	};

  	$scope.formats = ['dd MMM yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  	$scope.format = $scope.formats[0];

  	$scope.hstep = 1;
  	$scope.mstep = 15;

  	$scope.options = {
    	hstep: [1, 2, 3],
    	mstep: [1, 5, 10, 15, 25, 30]
  	};

  	$scope.ismeridian = false;
  	$scope.toggleMode = function() {
    	$scope.ismeridian = ! $scope.ismeridian;
  	};

  	$scope.update = function() {
    	var d = new Date();
    	d.setHours( 14 );
    	d.setMinutes( 0 );
    	$scope.mytime = d;
  	};

  	$scope.changed = function () {
    	console.log('Time changed to: ' + $scope.mytime);
  	};

  	$scope.clear = function() {
    	$scope.mytime = null;
  	};

	$scope.addNewTag = function () {
		ProfileService.addNewTag({
    		name: $scope.newTag.name, 
    		slug: $scope.newTag.slug
    	}).success(function (result) {
    		console.log(result);
    		if (result.status) {
    			// new tag saved succesfully
    			$scope.article.tags.push(result.data);
    			$('#newTagModal').modal('toggle');
    		} else {
    			// display error
    			$scope.newTag.errors.push(result.message);
    		}
    	});

	};

	$scope.addNewCategory = function () {
		var trimmedVal = $scope.newCategory.name.trim();
			trimmedVal = trimmedVal.replace(/[^a-zA-Z0-9]/g, '-');
			trimmedVal = trimmedVal.replace(/-{2,}/g, '-');
			trimmedVal = trimmedVal.replace(/^-/g, '');
			trimmedVal = trimmedVal.replace(/-$/g, '');
			trimmedVal = $filter('lowercase')(trimmedVal);

		ProfileService.addNewCategory({
    		name: $filter('titlecase')($scope.newCategory.name), 
    		slug: trimmedVal
    	}).success(function (result) {
    		console.log(result);
    		if (result.status) {
    			// new tag saved succesfully
    			//$scope.tagsSelected.push(result.data);
    			$scope.settings.categories.push(result.data);
    			$scope.selectedCategory = result.data;
    			$scope.article.category = result.data;
    			$('#newCategoryModal').modal('toggle');
    		} else {
    			// display error
    			//$scope.newTag.errors.push(result.message);
    		}
    	});

	};

	// Any function returning a promise object can be used to load values asynchronously
  	$scope.getTags = function(val) {
    	return $http.get('/api/v2/settings/tags', {
      		params: { k: val }
    	}).then(function(response){
    		var tags= [];
    		//var tags = response.data.data;

    		var indice = [];
    		
    		// loop through all returned tags
    		for (var i = 0; i < response.data.data.length; i++) {
    			// loop through current selected response.data.data
    			if ($scope.article.tags.length == 0) {
    				tags.push(response.data.data[i]);
    			} else {
    				var isExisted = false;

    				for (var j = 0; j < $scope.article.tags.length; j++) {
	    				if (response.data.data[i]) {
	    					if (response.data.data[i]._id == $scope.article.tags[j]._id) {
		    					isExisted = true;
		    					break;
		    				}
	    				}
	    				
	    			}

	    			if (!isExisted) {
	    				tags.push(response.data.data[i]);
	    			}
    			}
    			
    		}
    		var trimmedVal = val.trim();
				trimmedVal = trimmedVal.replace(/[^a-zA-Z0-9]/g, '-');
				trimmedVal = trimmedVal.replace(/-{2,}/g, '-');
				trimmedVal = trimmedVal.replace(/^-/g, '');
				trimmedVal = trimmedVal.replace(/-$/g, '');
				trimmedVal = $filter('lowercase')(trimmedVal);

	    	var newTag = {
	    		_id: -1,
	    		name: 'Add "' + val + '"',
	    		slug: trimmedVal,
	    		realName: $filter('titlecase')(val)
	    	}

	    	console.log(tags);

	    	tags.push(newTag);

	    	return tags;
    	});
  	};

  	$scope.statesWithFlags = [{'name':'Alabama','flag':'5/5c/Flag_of_Alabama.svg/45px-Flag_of_Alabama.svg.png'},{'name':'Alaska','flag':'e/e6/Flag_of_Alaska.svg/43px-Flag_of_Alaska.svg.png'},{'name':'Arizona','flag':'9/9d/Flag_of_Arizona.svg/45px-Flag_of_Arizona.svg.png'},{'name':'Arkansas','flag':'9/9d/Flag_of_Arkansas.svg/45px-Flag_of_Arkansas.svg.png'},{'name':'California','flag':'0/01/Flag_of_California.svg/45px-Flag_of_California.svg.png'},{'name':'Colorado','flag':'4/46/Flag_of_Colorado.svg/45px-Flag_of_Colorado.svg.png'},{'name':'Connecticut','flag':'9/96/Flag_of_Connecticut.svg/39px-Flag_of_Connecticut.svg.png'},{'name':'Delaware','flag':'c/c6/Flag_of_Delaware.svg/45px-Flag_of_Delaware.svg.png'},{'name':'Florida','flag':'f/f7/Flag_of_Florida.svg/45px-Flag_of_Florida.svg.png'},{'name':'Georgia','flag':'5/54/Flag_of_Georgia_%28U.S._state%29.svg/46px-Flag_of_Georgia_%28U.S._state%29.svg.png'},{'name':'Hawaii','flag':'e/ef/Flag_of_Hawaii.svg/46px-Flag_of_Hawaii.svg.png'},{'name':'Idaho','flag':'a/a4/Flag_of_Idaho.svg/38px-Flag_of_Idaho.svg.png'},{'name':'Illinois','flag':'0/01/Flag_of_Illinois.svg/46px-Flag_of_Illinois.svg.png'},{'name':'Indiana','flag':'a/ac/Flag_of_Indiana.svg/45px-Flag_of_Indiana.svg.png'},{'name':'Iowa','flag':'a/aa/Flag_of_Iowa.svg/44px-Flag_of_Iowa.svg.png'},{'name':'Kansas','flag':'d/da/Flag_of_Kansas.svg/46px-Flag_of_Kansas.svg.png'},{'name':'Kentucky','flag':'8/8d/Flag_of_Kentucky.svg/46px-Flag_of_Kentucky.svg.png'},{'name':'Louisiana','flag':'e/e0/Flag_of_Louisiana.svg/46px-Flag_of_Louisiana.svg.png'},{'name':'Maine','flag':'3/35/Flag_of_Maine.svg/45px-Flag_of_Maine.svg.png'},{'name':'Maryland','flag':'a/a0/Flag_of_Maryland.svg/45px-Flag_of_Maryland.svg.png'},{'name':'Massachusetts','flag':'f/f2/Flag_of_Massachusetts.svg/46px-Flag_of_Massachusetts.svg.png'},{'name':'Michigan','flag':'b/b5/Flag_of_Michigan.svg/45px-Flag_of_Michigan.svg.png'},{'name':'Minnesota','flag':'b/b9/Flag_of_Minnesota.svg/46px-Flag_of_Minnesota.svg.png'},{'name':'Mississippi','flag':'4/42/Flag_of_Mississippi.svg/45px-Flag_of_Mississippi.svg.png'},{'name':'Missouri','flag':'5/5a/Flag_of_Missouri.svg/46px-Flag_of_Missouri.svg.png'},{'name':'Montana','flag':'c/cb/Flag_of_Montana.svg/45px-Flag_of_Montana.svg.png'},{'name':'Nebraska','flag':'4/4d/Flag_of_Nebraska.svg/46px-Flag_of_Nebraska.svg.png'},{'name':'Nevada','flag':'f/f1/Flag_of_Nevada.svg/45px-Flag_of_Nevada.svg.png'},{'name':'New Hampshire','flag':'2/28/Flag_of_New_Hampshire.svg/45px-Flag_of_New_Hampshire.svg.png'},{'name':'New Jersey','flag':'9/92/Flag_of_New_Jersey.svg/45px-Flag_of_New_Jersey.svg.png'},{'name':'New Mexico','flag':'c/c3/Flag_of_New_Mexico.svg/45px-Flag_of_New_Mexico.svg.png'},{'name':'New York','flag':'1/1a/Flag_of_New_York.svg/46px-Flag_of_New_York.svg.png'},{'name':'North Carolina','flag':'b/bb/Flag_of_North_Carolina.svg/45px-Flag_of_North_Carolina.svg.png'},{'name':'North Dakota','flag':'e/ee/Flag_of_North_Dakota.svg/38px-Flag_of_North_Dakota.svg.png'},{'name':'Ohio','flag':'4/4c/Flag_of_Ohio.svg/46px-Flag_of_Ohio.svg.png'},{'name':'Oklahoma','flag':'6/6e/Flag_of_Oklahoma.svg/45px-Flag_of_Oklahoma.svg.png'},{'name':'Oregon','flag':'b/b9/Flag_of_Oregon.svg/46px-Flag_of_Oregon.svg.png'},{'name':'Pennsylvania','flag':'f/f7/Flag_of_Pennsylvania.svg/45px-Flag_of_Pennsylvania.svg.png'},{'name':'Rhode Island','flag':'f/f3/Flag_of_Rhode_Island.svg/32px-Flag_of_Rhode_Island.svg.png'},{'name':'South Carolina','flag':'6/69/Flag_of_South_Carolina.svg/45px-Flag_of_South_Carolina.svg.png'},{'name':'South Dakota','flag':'1/1a/Flag_of_South_Dakota.svg/46px-Flag_of_South_Dakota.svg.png'},{'name':'Tennessee','flag':'9/9e/Flag_of_Tennessee.svg/46px-Flag_of_Tennessee.svg.png'},{'name':'Texas','flag':'f/f7/Flag_of_Texas.svg/45px-Flag_of_Texas.svg.png'},{'name':'Utah','flag':'f/f6/Flag_of_Utah.svg/45px-Flag_of_Utah.svg.png'},{'name':'Vermont','flag':'4/49/Flag_of_Vermont.svg/46px-Flag_of_Vermont.svg.png'},{'name':'Virginia','flag':'4/47/Flag_of_Virginia.svg/44px-Flag_of_Virginia.svg.png'},{'name':'Washington','flag':'5/54/Flag_of_Washington.svg/46px-Flag_of_Washington.svg.png'},{'name':'West Virginia','flag':'2/22/Flag_of_West_Virginia.svg/46px-Flag_of_West_Virginia.svg.png'},{'name':'Wisconsin','flag':'2/22/Flag_of_Wisconsin.svg/45px-Flag_of_Wisconsin.svg.png'},{'name':'Wyoming','flag':'b/bc/Flag_of_Wyoming.svg/43px-Flag_of_Wyoming.svg.png'}];
}]);
