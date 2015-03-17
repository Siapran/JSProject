# JSProject
Projet dans le cadre du DUT Informatique
Un Bureau virtuel

ROUTES FOR DATA
===============

*ADD A DOCUMENT
path:     /add/documents/{data}
--------------
*GET ALL DOCUMENT
path:     /get/documents

ABSOLUTE LINK FOR DATA
======================

http://178.62.102.228/JSProjectSymfony/web/app.php/get/documents
http://178.62.102.228/JSProjectSymfony/web/app.php/add/document/{DATAJSONSTRINGIFIED/PARSED}


DATA
==========
CoreBundle\Entity\Documents:
    id: integer autoincremented
    title:
        type: string
        length: 255
    content:
        type: text
    creationDate:
        type: datetimetz
        // The date is defined by default when sending to php server, we don't need to send this
        

    
