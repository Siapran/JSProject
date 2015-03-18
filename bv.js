$(function() {
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
	});

	var myDocument = new Object();
	myDocument.myTitle = title;
	myDocument.myContent = content + "}"; // sino nca bug...
$.ajax({
	url: "http://178.62.102.228/JSProjectSymfony/web/app.php/add/document/",
	type: "POST", //send it through get method
	dataType: "jsonp",
	data: JSON.stringify({title:title, content:content}), // our data
	success: function(response) { // success callback
		console.log(response); // IF SUCCESS, IT'S SAVED AUTOMATICALLY IN SERVER
	},
	error: function(xhr) { // error callback
		console.log("error");
	}
});

	console.log(title);
	console.log(content);
}