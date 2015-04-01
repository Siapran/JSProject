$(function() {
	$("#accordion").accordion({
		heightStyle: "fill"
	});

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
      });
      $('#tree').on('rename_node', function (e, data) {
      	console.log("rename_node");
      });
      $('#tree').on('move_node', function (e, data) {
      	console.log("move_node");
      });
      $('#tree').on('delete_node', function (e, data) {
      	console.log("delete_node");
      	$('#tree').delete_node(data.node);
      });
      $('#tree').on('select_node.jstree', function (e, data) {
      	console.log("select_node");
      	console.log(data);
      	console.log(data.node.type);

		var path = data.instance.get_path(data.node,'/');
		var alreadyThere = false;
      	$.ajax({
      	    async : true,
      	    type : "POST",
      	    url : "./ajaxJSProjectGet.php?",
      	    data: {"file":path},

      	    success : function(contenuFichier) {
      	    	$("div#tabs ul#listOfTabs li").each(function(index) {
      	    		if ($(this).children().text() == data.node.text) {
      	    			alreadyThere = true;
    		        	$("div#tabs" ).tabs( "option", "active", index);
      	    		} 
      	    	})
      	    	if (!alreadyThere && data.node.icon !== "images/blue-folder.png") {
      	    		console.log($(this));
	      	    	var tools = $("<div/>").attr("class", "tools").html('<ul class="listOfTools"><li onclick="saveDoc(this)"><img src="images/disk.png"></li><li><img src="images/blue-document-page-next.png"></li><li><img src="images/blue-document-page-previous.png"></li><li><img src="images/edit-alignment-left.png"></li><li><img src="images/edit-alignment-center.png"></li><li><img src="images/edit-alignment-right.png"></li><li><img src="images/edit-italic.png"></li><li><img src="images/edit-bold.png"></li><li><img src="images/edit-underline.png"></li><li><img src="images/edit-list.png"></li><li><img src="images/edit-list-order.png"></li></ul>');
	      	    	var content = $("<div/>").attr("class", "content").attr("contenteditable", "true").text(contenuFichier);
    		        var num_tabs = $("div#tabs ul#listOfTabs li").length + 1;
    		        $("div#tabs ul#listOfTabs").append("<li><a href='#tab" + num_tabs + "'>" + data.node.text + "</a></li>");
    				$("div#tabs").append("<div id='tab" + num_tabs + "'><h4 class='inline'>Title : </h4><div class='title' id='titleEditable' contenteditable='true'>" + data.node.text + "</div>" + "</div>");
    		        $("div#tabs").tabs("refresh");
    		        $("div#tab" + num_tabs).append(tools);
    		        $("div#tab" + num_tabs).append(content);
    		        $("div#tab" + num_tabs).data("path", path);
    		        $("div#tabs" ).tabs( "option", "active", $("div#tabs ul#listOfTabs li").length-1);
      	    	}
      	    },    

      	    error : function(xhr, ajaxOptions, thrownError) {
      	        alert(xhr.status);
      	        alert(thrownError);
      	    }
      	});
      });
            

	//font
	size = 1;


});

function saveDoc(element) {
	var tab = $(element).parent().parent().parent();
	var title = "";
	var content = "";
	var path = tab.data("path");
	tab.children().each(function() {
		if ($(this).attr("class") == $(".content").attr("class")) // same for content
			content = $(this).html();
	});

	$.ajax({
	  method: "POST",
	  url: "./ajaxJSProjectAdd.php",
	  data: { file : path, content : content}
	})
	.done(function(data) {
		console.log(data);
	});
}

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

