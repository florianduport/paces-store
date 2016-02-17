$(document).ready(function(){

    'use strict';

    var handleImageSelectChange = function(){
        
        var icon = '';
        //clean active
        $("#miniatureContainer div").each(function(){
            var element = $(this);
            if(element.hasClass('active')){
                element.removeClass('active');
                icon = element.html();
                element.html('');
            }
        });
        var index = 0;
        
        var i = 0;
        $("#imageSelector option").each(function(){
            var element = $(this);
            if(element.html() == $("#imageSelector option:selected").html()){
               index = i; 
            }
            i++;
        });
        
        $($("#miniatureContainer div")[index]).html(icon);
        $($("#miniatureContainer div")[index]).addClass('active');
 
    }


    $("#imageSelector").on('change', handleImageSelectChange);
    handleImageSelectChange();
    $("#miniatureContainer div").click(function(){
        var current = $(this);
        var icon = '';
        var index = 0;
        
        var i = 0;
        $("#miniatureContainer div").each(function(){
            var element = $(this);
            if(element.hasClass('active')){
                element.removeClass('active');
                icon = element.html();
                element.html('');
            }
            if(element.attr('style') == current.attr('style')){
                index = i; 
            }
            i++;
        });
        
        current.addClass('active');
        current.html(icon);
        
        $("#imageSelector option").each(function(){
           $(this).removeAttr('selected'); 
        });
        
        $($("#imageSelector option")[index]).attr('selected', 'selected');
        
        $($("#imageSelector").selectpicker('refresh'));
        
    });

    // UPLOAD CLASS DEFINITION
    // ======================

    /*var dropZone = document.getElementById('drop-zone');
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
    }*/

});
