$(function() {
	$("#accordion").accordion({
		heightStyle: "fill"
	});
	
/*	initDocuments();
*/
	$("#tabs").tabs({ 
	beforeLoad: function( event, ui ) {
    	if ( ui.tab.data( "loaded" ) ) {
	      	event.preventDefault();
	      	return;
    	}
    	ui.ajaxSettings.cache = false,
	    ui.jqXHR.success(function() {
	      ui.tab.data( "loaded", true );
	    });},
		heightStyle: "fill"
	});

    $.ajax({
        async : true,
        type : "GET",
        url : "./ajaxGetTree.php?dir=homeDir",
        dataType : "json",    

        success : function(json) {
            $('#tree').jstree(json);
            $("#tree").jstree({plugins: ["contextmenu"]});
        },    

        error : function(xhr, ajaxOptions, thrownError) {
            alert(xhr.status);
            alert(thrownError);
        }
    });


    $('#tree')
      // listen for event
      .on('changed.jstree', function (e, data) {
      	console.log(data);
      	if (data.action == "select_node") {
			var path = data.instance.get_path(data.node,'/');
	      	$.ajax({
	      	    async : true,
	      	    type : "POST",
	      	    url : "./ajaxJSProjectGet.php?",
	      	    data: {"file":path},

	      	    success : function(contenuFichier) {
	      	    	var tools = $("<div/>").attr("class", "tools").html('<ul class="listOfTools"><li onclick="save(this)"><img src="images/disk.png"></li><li><img src="images/blue-document-page-next.png"></li><li><img src="images/blue-document-page-previous.png"></li><li><img src="images/edit-alignment-left.png"></li><li><img src="images/edit-alignment-center.png"></li><li><img src="images/edit-alignment-right.png"></li><li><img src="images/edit-italic.png"></li><li><img src="images/edit-bold.png"></li><li><img src="images/edit-underline.png"></li><li><img src="images/edit-list.png"></li><li><img src="images/edit-list-order.png"></li></ul>');
	      	    	var content = $("<div/>").attr("class", "content").attr("contenteditable", "true").text(contenuFichier);
    		        var num_tabs = $("div#tabs ul#listOfTabs li").length + 1;
    		        $("div#tabs ul#listOfTabs").append("<li><a href='#tab" + num_tabs + "'>" + data.node.text + "</a></li>");
    				$("div#tabs").append("<div id='tab" + num_tabs + "'><h4 class='inline'>Title : </h4><div class='title' id='titleEditable' contenteditable='true'>" + data.node.text + "</div>" + "</div>");
    		        $("div#tabs").tabs("refresh");
    		        $("div#tab" + num_tabs).append(tools);
    		        $("div#tab" + num_tabs).append(content);
    		        $( "div#tabs" ).tabs( "option", "active", $("div#tabs ul#listOfTabs li").length-1);




	      	    },    

	      	    error : function(xhr, ajaxOptions, thrownError) {
	      	        alert(xhr.status);
	      	        alert(thrownError);
	      	    }
	      	});
      	}
		
      	console.log("changed.jstree");
      });
      $('#tree').on('rename_node', function (e, data) {
      	console.log("rename_node");
      });
      $('#tree').on('move_node', function (e, data) {
      	console.log("move_node");
      });
      $('#tree').on('remove_node', function (e, data) {
      	console.log("remove_node");
      });
	//font
	size = 1;


});

function save(element) {
	var tab = $(element).parent().parent().parent();
	var title = "";
	var content = "";
	// I iterate throught the tab to save only the active document
	tab.children().each(function() {
		if ($(this).attr("class") == $(".title").attr("class")) // If the current objct have class title then it's the title of the doc
			title = $(this).html();
		else if ($(this).attr("class") == $(".content").attr("class")) // same for content
			content = $(this).html();
		else if ($(this).attr("class") == $(".id").attr("class")) // same for id
			id = $(this).html();
	});

	var myDocument = new Object();
	myDocument.myTitle = title;
	myDocument.myContent = content + "}"; // sino nca bug...
	var openedDocs = "";
	var buffer = $("#tabs").children();
	while (buffer)
	{
		if (buffer.attr("class") == "title")
			openedDocs = openedDocs + buffer.html() + "|";
		buffer = buffer.next();
	}
	openedDocs = substr(openedDocs, 0, openedDocs.length-2);
	$.ajax({
	  method: "POST",
	  url: "./ajaxJSProjectAdd.php",
	  data: { path:title, myContent: content, myOpenedDocs: openedDocs }
	})
	.done(function() {
		alert("Document saved");
	});
}

/*function initDocuments() {
	$.ajax({
		method: "GET",
		async: false,
	 	url: "./ajaxJSProjectGet.php",
	})
	.done(function(data) {
		$.each(data, function() {
			console.log($(this)[0]);
			var elem = $(this)[0];
			var li = $("<li/>");
			$("<a/>").attr("href", "#tab" + elem.id).text(elem.title).appendTo(li);
			$("#listOfTabs").append(li);
			// set all var of the document to add it after to the html page
			var title = $("<h4/>").text("Title :").attr("class", "inline");
			var id = $("<div/>").attr("class", "id").text(elem.id);
			var titleEdit = $("<div/>").attr("class", "title").attr("contenteditable", "true").append($("<h1/>").text(elem.title))
			// list of buttons, there's no need to understand i just copied and past last html list
			var tools = $("<div/>").attr("class", "tools").html('<ul class="listOfTools"><li onclick="save(this)"><img src="images/disk.png"></li><li><img src="images/blue-document-page-next.png"></li><li><img src="images/blue-document-page-previous.png"></li><li><img src="images/edit-alignment-left.png"></li><li><img src="images/edit-alignment-center.png"></li><li><img src="images/edit-alignment-right.png"></li><li><img src="images/edit-italic.png"></li><li><img src="images/edit-bold.png"></li><li><img src="images/edit-underline.png"></li><li><img src="images/edit-list.png"></li><li><img src="images/edit-list-order.png"></li></ul>');
			var content = $("<div/>").attr("class", "content").attr("contenteditable", "true").text(elem.content);
			$("#tabs").append($("<div/>").attr("id", "tab" + elem.id).append(title).append(id).append(titleEdit).append(tools).append(content));
		})
	});
}*/

function load(element){
	(element).designMode = "On";
}

function getIFrameDocument(aID){
    return document.getElementById(aID).contentDocument;
}

function doRichEditCommand(aName, aArg){
	getIFrameDocument('editorWindow').execCommand(aName,false, aArg);
	document.getElementById('editorWindow').contentWindow.focus()
}


function putStyle(element, fontSizeStyle) {
	if (typeof fontSizeStyle !== 'undefined') {
		if (fontSizeStyle == "up")
			size++;
		else
			size--;
		if (size < 1) size = 1; else if (size > 7) size=7; 
		document.execCommand($(element).attr("id"), false, size);
	} else {
		document.execCommand($(element).attr("id"));
	}
}

