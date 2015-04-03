var oldpath;

$(function() {


    $.ajaxSetup({
        cache: false
    });

    $("#accordion").accordion({
        heightStyle: "fill"
    });

    $("#tabs").tabs({
        beforeLoad: function(event, ui) {
            if (ui.tab.data("loaded")) {
                event.preventDefault();
                return;
            }
            ui.ajaxSettings.cache = false,
                ui.jqXHR.success(function() {
                    ui.tab.data("loaded", true);
                });
        },
        heightStyle: "fill"
    });


    // création du menu contextuel ouvert sur clic droit
    function createmenu(node) {
        var tree = $("#tree").jstree(true);
        return {
            "item1": {
                "label": "Créer répertoire",
                "action": function() {
                    node = tree.create_node(node, {
                        "type": "folder"
                    });
                    node.type = "folder";
                    oldpath = $("#tree").jstree(true).get_path(node, '/');
                    tree.edit(node);
                }
            },

            "item2": {
                "label": "Créer fichier",
                "action": function() {
                    node = tree.create_node(node, {
                        "type": "file"
                    });
                    node.type="file";
                    oldpath = $("#tree").jstree(true).get_path(node, '/');
                    tree.edit(node);

                }
            },

            "item3": {
                "label": "Renommer fichier",
                "action": function(obj) {
                    oldpath = $("#tree").jstree(true).get_path(node, '/');
                    beforeRename = node.text;
                    tree.edit(node);
                }
            },

            "item4": {
                "label": "Supprimer",
                "action": function(obj) {
                    if (node.children[0] == null) {
                        if (confirm("Vous allez supprimer  " + node.text + ", continuer ?")) {
                            var path = $("#tree").jstree(true).get_path(node, '/');
                            tree.delete_node(node);
                            $("div#tabs ul#listOfTabs li").each(function(index) {
                                if ($(this).children().text() == node.text) {
                                    var panelId = $(this).remove().attr( "aria-controls" );
                                    $( "#" + panelId ).remove();
                                    $("div#tabs").tabs("refresh");
                                }
                            })


                            $.ajax({
                                async: true,
                                type: "POST",
                                url: "./ajaxJSProjectDelete.php",
                                data: {
                                    "type": node.type,
                                    "path": path
                                },

                                success: function(response) {
                                    console.log(response);
                                    saveArborescence();

                                }
                            })
                        } else {
                            console.log("ne supprime pas");
                        }
                    }
                }
            }
        };
    }


    function init() {
        // initialisation de l'arbre
        $('#tree').jstree({
            'core': {
                "animation": 0,
                "check_callback": true,
                "themes": {
                    "stripes": true
                },
                'data': {
                    "url": "./root.json",
                    "dataType": "json"
                } // needed only if you do not supply JSON headers
            },
            "types": {
                "#": {
                    "max_children": 1,
                    "max_depth": 4,
                    "valid_children": ["root"]
                },
                "folder":{
                    "icon": "images/blue-folder.png"
                },
                "file":{
                    "icon": "images/blue-document.png"
                }
            },
            "plugins": ["contextmenu", "dnd", "state", "types", "wholerow"],
            "contextmenu": {
                "items": createmenu
            }
        });
    }


    saveArborescence();
    init();

    $("#datepicker").datepicker();


    $('#tree').on('rename_node.jstree', function(e, data) {
        console.log("rename_node");
        var newpath = $("#tree").jstree(true).get_path(data.node, '/');

        $("div#tabs ul#listOfTabs li").each(function(index) {
            if ($(this).children().text() == beforeRename) {
                $(this).children().text(data.node.text);
            }
        })

        $.ajax({
            async: true,
            type: "POST",
            url: "./ajaxJSProjectRename.php",
            data: {
                "oldpath": oldpath,
                "newpath": newpath
            },

            success: function(response) {
                console.log(response);
                saveArborescence();

            }
        })

    });
    $('#tree').on('move_node.jstree', function(e, data) {
        console.log("move_node");

        var newpath = $("#tree").jstree(true).get_path(data.node, '/');
        var filename = newpath.replace(/^.*[\\\/]/, '');
        oldpath = $("#tree").jstree(true).get_node(data.old_parent).text + filename;
        console.log("OLD PARENT = ");
        console.log(data.instance.get_path($("#tree").jstree(true).get_node(data.old_parent), '/'));
        oldpath = data.instance.get_path($("#tree").jstree(true).get_node(data.old_parent), '/');
        console.log(newpath);

        $.ajax({
            async: true,
            type: "POST",
            url: "./ajaxJSProjectRename.php",
            data: {
                "oldpath": oldpath,
                "newpath": newpath
            },

            success: function(response) {
                console.log("réponse : ")
                console.log(response);
                console.log("fin réponse");
                saveArborescence();

            }
        })

    });

    $('#tree').on('create_node.jstree', function(e, data) {
        console.log("createnode.jstree");
        var path = $("#tree").jstree(true).get_path(data.node, '/');

        if (data.node.type == "file") {
            // fichier
            $.ajax({
                async: true,
                type: "POST",
                url: "./ajaxJSProjectAdd.php",
                data: {
                    "file": path,
                    "content": ""
                },

                success: function(response) {
                    console.log(response);
                    saveArborescence();
                }
            })

        } else {
            // dossier
            $.ajax({
                async: true,
                type: "POST",
                url: "./ajaxJSProjectAddRepository.php",
                data: {
                    "dirname": path
                },

                success: function(response) {
                    console.log(response);
                    saveArborescence();
                }
            })
        }
    });



    //Ouverture d'un tab
    $('#tree').on('select_node.jstree', function(e, data) {
        console.log("select_node");
        console.log(data);
        console.log(data.node.type);

        var path = data.instance.get_path(data.node, '/');
        var alreadyThere = false;
        $.ajax({
            async: true,
            type: "POST",
            url: "./ajaxJSProjectGet.php?",
            data: {
                "file": path
            },

            success: function(contenuFichier) {
                $("div#tabs ul#listOfTabs li").each(function(index) {
                    if ($(this).children().text() == data.node.text) {
                        alreadyThere = true;
                        $("div#tabs").tabs("option", "active", index);
                    }
                })
                if (!alreadyThere && data.node.icon !== "images/blue-folder.png") {
                    var tools = $("<div/>").attr("class", "tools").html('<ul class="listOfTools"><li onclick="saveDoc(this)" id="save"><img src="images/disk.png"></li>' +
                        '<li onclick="putStyle(this)" id="redo"><img src="images/blue-document-page-next.png"></li>' +
                        '<li onclick="putStyle(this)" id="undo"><img src="images/blue-document-page-previous.png"></li>' +
                        '<li onclick="putStyle(this)" id="justifyleft"><img src="images/edit-alignment-left.png"></li>' +
                        '<li onclick="putStyle(this)" id="justifycenter"><img src="images/edit-alignment-center.png"></li>' +
                        '<li onclick="putStyle(this)" id="justifyright"><img src="images/edit-alignment-right.png"></li> ' +
                        '<li onclick="putStyle(this)" id="italic"><img src="images/edit-italic.png"></li>' +
                        '<li onclick="putStyle(this)" id="bold"><img src="images/edit-bold.png"></li>' +
                        '<li onclick="putStyle(this)" id="underline"><img src="images/edit-underline.png"></li>' +
                        '<li onclick="putStyle(this)" id="InsertUnorderedList"><img src="images/edit-list.png"></li>' +
                        '<li onclick="putStyle(this)" id="InsertOrderedList"><img src="images/edit-list-order.png"></li></ul>');
                    var content = $("<div/>").attr("class", "content").attr("contenteditable", "true").text(contenuFichier);
                    var num_tabs = $("div#tabs ul#listOfTabs li").length + 1;
                    $("div#tabs ul#listOfTabs").append("<li><a href='#tab" + num_tabs + "'>" + data.node.text + "</a></li>");
                    $("div#tabs").append("<div id='tab" + num_tabs + "'></div>");
                    $("div#tabs").tabs("refresh");
                    $("div#tab" + num_tabs).append(tools);
                    $("div#tab" + num_tabs).append(content);
                    $("div#tab" + num_tabs).data("path", path);
                    $("div#tabs").tabs("option", "active", $("div#tabs ul#listOfTabs li").length - 1);
                }
            },

            error: function(xhr, ajaxOptions, thrownError) {
                alert(xhr.status);
                alert(thrownError);
            }
        });
    });


    //font
    size = 1;


});


//On enregistre l'arborescence
function saveArborescence() {
    $.ajax({
        async: true,
        type: "GET",
        url: "./updateTree.php?dir=homeDir",

        success: function(response) {
            console.log(response);
        },

        error: function(xhr, ajaxOptions, thrownError) {
            alert(xhr.status);
            alert(thrownError);
        }
    });
}


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
            data: {
                file: path,
                content: content
            }
        })
        .done(function(data) {
            console.log(data);
        });
}



function load(element) {
    (element).designMode = "On";
}

function getIFrameDocument(aID) {
    return document.getElementById(aID).contentDocument;
}

function doRichEditCommand(aName, aArg) {
    getIFrameDocument('editorWindow').execCommand(aName, false, aArg);
    document.getElementById('editorWindow').contentWindow.focus()
}


function putStyle(element, fontSizeStyle) {
    console.log("putsytle");
    console.log($(element).attr("id"));
    if (typeof fontSizeStyle !== 'undefined') {
        if (fontSizeStyle == "up")
            size++;
        else
            size--;
        if (size < 1) size = 1;
        else if (size > 7) size = 7;
        document.execCommand($(element).attr("id"), false, size);
    } else {
        document.execCommand($(element).attr("id"));
    }
}