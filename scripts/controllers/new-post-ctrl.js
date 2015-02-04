
/*
 * New Business Controller 
 */
PopInTownControllers.controller('NewPostCtrl', ['$scope', 'GoogleMapsService', 'BizService', '$window', '$location', 
	'$filter', 'UserService',
		function($scope, GoogleMapsService, BizService, $window, $location, $filter, UserService) {

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

	$scope.stripHTML = function (html) {
	   var tmp = document.createElement("DIV");
	   tmp.innerHTML = html;
	   return tmp.textContent || tmp.innerText ;
	};



	/*
	 * Initialize controller when first loading page
	 */
	$scope.init = function (){
		// If user is not logged in, redirect to homepage 
		toastr.info($window.sessionStorage.token);

		// save login token to post
		$scope.post.loginToken = $window.sessionStorage.token;

		// ACE init
		var editor = ace.edit("editor");
    	editor.setTheme('ace/theme/' + $scope.codeHighlight.theme.value);
    	editor.getSession().setMode('ace/mode/' + $scope.codeHighlight.language.value);
    	editor.setFontSize($scope.codeHighlight.size.value);

		tinymce.init({
			mode : "specific_textareas",
        	editor_selector : "mceEditor",
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
	};

	/*
	 * Parse title to url-friendly. The function get invoked on keyup event.
	 */
	$scope.processUrl = function () {
		var url = '';
		var title = $scope.post.title;

		if (title) {
			title = title.trim();
			title = title.replace(/[^a-zA-Z0-9]/g, '-');
			title = title.replace(/-{2,}/g, '-');

			title = $filter('lowercase')(title);
		}
		
		var port = 80;

		if ($location.port() != 80) {
			port = $location.port();
		}

		// get username
		var username = $window.sessionStorage.username;

		$scope.post.urlTitle = title;
		$scope.post.url = $location.host() + ':' +  port + '/' + username + '/' + title;
	};

	/*
	 * Create new post.
	 */
	$scope.createNewPost = function() {
		$scope.post.content = tinyMCE.activeEditor.getContent();

		UserService.createNewPost($scope.post).success(function (data) {

		});
		
		console.log(JSON.stringify($scope.post));
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
		toastr.info($scope.codeHighlight.language.value);
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
			console.log('Add new code to tinyMCE');
		}
		
		// Sets the content of a specific editor (my_editor in this example)
		//tinyMCE.activeEditor.setContent(wrapup);

		// close code highlight dialog
		$('#codeModal').modal('hide');
	}
}]);