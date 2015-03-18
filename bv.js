$(function() {
	initDocuments();
	$("#accordion").accordion({
		heightStyle: "fill"
	});
	$("#tabs").tabs({
		heightStyle: "fill"
	})
});

function save(element) {
	var tab = $(element).parent().parent().parent();
	var title = "";
	var content = "";
	tab.children().each(function() {
		if ($(this).attr("class") == $(".title").attr("class"))
			title = $(this).text();
		else if ($(this).attr("class") == $(".content").attr("class"))
			content = $(this).text();
		else if ($(this).attr("class") == $(".id").attr("class"))
			id = $(this).text();
	});

	var myDocument = new Object();
	myDocument.myTitle = title;
	myDocument.myContent = content + "}"; // sino nca bug...

	$.ajax({
	  method: "POST",
	  url: "http://178.62.102.228/JSProjectSymfony/web/app.php/add/document/",
	  data: { myId:id, myTitle:title, myContent: content }
	})
	.done(function() {
		alert("Document saved");
	});
}

function initDocuments() {
	$.ajax({
		method: "GET",
	 	url: "http://178.62.102.228/JSProjectSymfony/web/app.php/get/documents",
	})
	.done(function(data) {
		$.each(data, function() {
			console.log($(this)[0]);
			var elem = $(this)[0];
			var li = $("<li/>");
			$("<a/>").attr("href", "#tab" + elem.id).text(elem.title).appendTo(li);
			$("#listOfTabs").append(li);
			$("#tabs")
			// set all var of the document to add it after to the html page
			var title = $("<h4/>").text("Title :").attr("class", "inline");
			var id = $("<div/>").attr("class", "id").text(elem.id);
			var titleEdit = $("<div/>").attr("class", "title").attr("contenteditable", "true").append($("<h1/>").text(elem.title))
			var tools = $("<div/>").attr("class", "tools").html('<ul class="listOfTools"><li onclick="save(this)"><img src="images/disk.png"></li><li><img src="images/blue-document-page-next.png"></li><li><img src="images/blue-document-page-previous.png"></li><li><img src="images/edit-alignment-left.png"></li><li><img src="images/edit-alignment-center.png"></li><li><img src="images/edit-alignment-right.png"></li><li><img src="images/edit-italic.png"></li><li><img src="images/edit-bold.png"></li><li><img src="images/edit-underline.png"></li><li><img src="images/edit-list.png"></li><li><img src="images/edit-list-order.png"></li></ul>');
			var content = $("<div/>").attr("class", "content").attr("contenteditable", "true").text(elem.content);
			$("#tabs").append($("<div/>").attr("id", "tab" + elem.id).append(title).append(id).append(titleEdit).append(tools).append(content));
		})
	});
}

