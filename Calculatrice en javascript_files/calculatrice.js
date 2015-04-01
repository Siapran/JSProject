var memory;
var edition = false;
$(document).ready(function() {
	init();
});
function init() {
	var bouton_simple = document.getElementsByClassName("bouton_simple");
	for (var i = 0; i < bouton_simple.length; i++) {
		bouton_simple[i].setAttribute("onclick", "affiche(this)");
	};
	var boutons_editables = document.getElementsByClassName("bouton_libre");
	for (var i = 0; i < boutons_editables.length; i++) {
		var cookieValue;
		if (cookieValue = getCookie("libre" + (i+1)))
			boutons_editables[i].value = cookieValue;
	};
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

function rab() {
	document.getElementById("zone_affichage").value = "";
}

function calcul() {
	try {
		document.getElementById("zone_affichage").value = eval(document.getElementById("zone_affichage").value);
	}
	catch(err) {
	    alert(err.message);
	}
}

function affiche(boutonClique) {
	console.log("affiche");
	if (boutonClique.value == "+" || boutonClique.value == "-")
		plusmoins(boutonClique);
	else
		document.getElementById("zone_affichage").value = document.getElementById("zone_affichage").value + boutonClique.value;
}

function plusmoins(boutonClique) {
	var affichage = document.getElementById("zone_affichage").value;
	var longueur = document.getElementById("zone_affichage").value.length;
	var dernierChar = affichage[longueur-1];
	var symboleClique = boutonClique.value;
	if (dernierChar != "+" && dernierChar != "-") {
		document.getElementById("zone_affichage").value = affichage + symboleClique;
	} else {
		if (symboleClique == "-" && dernierChar == "-")
			document.getElementById("zone_affichage").value = affichage.substr(0, longueur-1) + "+";
		else if (symboleClique == "-" && dernierChar == "+")
			document.getElementById("zone_affichage").value = affichage.substr(0, longueur-1) + "-";
		else if (symboleClique == "+" && dernierChar == "-")
			document.getElementById("zone_affichage").value = affichage.substr(0, longueur-1) + "+";
	}
}

function range_memory() {
	if (document.getElementById("zone_affichage").value.search(/^-?\d+\.?\d*$/) != -1)
		memory = document.getElementById("zone_affichage").value;
	else
		alert("Le champ doit être un nombre");
}

function affiche_memory() {
	if (memory !== undefined)
		document.getElementById("zone_affichage").value = document.getElementById("zone_affichage").value + memory;
}

function raz_memory() {
	if (memory !== undefined)
		memory = undefined;
}

function mode_edition(objet) {
	console.log("edition");
	var boutons_editables = document.getElementsByClassName("bouton_libre");
	if (edition) {
		objet.style.color="black";
		edition = false;
		for (var i = 0; i < boutons_editables.length; i++) {
			boutons_editables[i].removeAttribute("ondblclick");
			boutons_editables[i].setAttribute("type","button");
			boutons_editables[i].removeAttribute("onblur");
			boutons_editables[i].setAttribute("onclick","affiche(this)");
		};
	} else {
		objet.style.color="red";
		edition = true;
		for (var i = 0; i < boutons_editables.length; i++) {
			boutons_editables[i].removeAttribute("onclick");
			boutons_editables[i].setAttribute("ondblclick","edit(this)");
			boutons_editables[i].setAttribute("onblur","save(this)");
		};
	}
}

function edit(objet) {
	if (objet.type == "text") {
		objet.setAttribute("type", "button");
		save(objet);
	}
	else
		objet.setAttribute("type", "text");
}

function changePosition(objet) {
	if (document.getElementById("calc").lastChild == objet)
		document.getElementById("calc").insertBefore(objet, document.getElementById("calc").firstChild);
	else
		document.getElementById("calc").appendChild(objet);
}

function save(objet) {
	document.cookie= "";
	boutons_editables = document.getElementsByClassName("bouton_libre");
	for (var i = 0; i < boutons_editables.length; i++) {
		if (boutons_editables[i].value != "" || boutons_editables[i].value != " ")
			document.cookie = "libre" + (i+1) + "=" + boutons_editables[i].value + ";";
	};
	console.log(document.cookie);
}




document.addEventListener("dragstart", function(event) {
	if (edition) {
		// The dataTransfer.setData() method sets the data type and the value of the dragged data
		event.dataTransfer.setData("Text", event.target.id);
		
		// Output some text when starting to drag the p element
		
		// Change the opacity of the draggable element
		event.target.style.opacity = "0.4";
	}

});




// By default, data/elements cannot be dropped in other elements. To allow a drop, we must prevent the default handling of the element
document.addEventListener("dragover", function(event) {
    event.preventDefault();
});

// When the draggable p element leaves the bouton_libre, reset the DIVS's border style
document.addEventListener("dragleave", function(event) {
	if (edition) {
		if ( event.target.className == "bouton_libre" ) {
		    event.target.style.border = "";
		}
	}

});

/* On drop - Prevent the browser default handling of the data (default is open as link on drop)
   Reset the color of the output text and DIV's border color
   Get the dragged data with the dataTransfer.getData() method
   The dragged data is the id of the dragged element ("drag1")
   Append the dragged element into the drop element
*/
document.addEventListener("drop", function(event) {
	if (edition) {
		event.preventDefault();
		console.log(event.target);
		if ( event.target.className == "bouton_simple bouton_libre") {
			console.log(event);
		    var data = event.dataTransfer.getData("Text");
		    event.target.setAttribute("value",document.getElementById(data).id);
		}
		save(event.target);
	}
});