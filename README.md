# JSProject
Projet dans le cadre du DUT Informatique
Un Bureau virtuel

ROUTES FOR DATA
===============
*ADD A DOCUMENT
path:     /add/documents/{data}
*GET ALL DOCUMENT
path:     /get/documents

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
        // The date is defined by default when sending to php server
    