$(document).ready(function(){

    'use strict';

    // UPLOAD CLASS DEFINITION
    // ======================

    var dropZone = document.getElementById('drop-zone');
    var uploadForm = document.getElementById('productForm');

    var startUpload = function(files) {
        console.log(files);
        $("#productForm").submit();
    }

    uploadForm.addEventListener('submit', function(e) {
        var uploadFiles = document.getElementById('js-upload-files').files;
        e.preventDefault()

        startUpload(uploadFiles)
    })

    dropZone.ondrop = function(e) {
        e.preventDefault();
        this.className = 'upload-drop-zone';

        $("#drop-zone p").html(e.dataTransfer.files[0].name);
        startUpload(e.dataTransfer.files)
    }

    dropZone.ondragover = function() {
        this.className = 'upload-drop-zone drop';
        $("#drop-zone p").html("Déposez votre nouveau fichier ici");
        return false;
    }

    dropZone.ondragleave = function() {
        this.className = 'upload-drop-zone';
        $("#drop-zone p").html($("#drop-zone p").data("filename"));
        return false;
    }

});