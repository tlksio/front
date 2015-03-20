$(document).ready(function(){
    "use strict";
    $(".js-vote").click(function(){
          $.ajax({
              type: "GET",
              url: "/talk/upvote/"+$(this).attr("rel"),
              context: this,
              success: function(req) {
              if( req.result=== true) {
                   spanDom = $('span', this);
                   numVotes = parseInt(spanDom.text());
                   numVotes +=  1;
                   html =  '<button type="button" disabled="disabled" class="btn btn-primary"><i class="glyphicon glyphicon-chevron-up"></i><br><span>'+ numVotes +'</span></button>';
                   $(this).replaceWith(html); 
                }
              },
         }); 
    });

    $(".js-favorite, .js-unfavorite").click(function(){
        var type = "";
        if($(this).attr('class').indexOf("unfavorite")==-1) {
           type = "up"; 
        }
        var command;
        if(type=="up") {
            command = "favorite";
        } else {
            command = "unfavorite";
        }
        $(this).attr("command", command);
        $.ajax({
             type: "GET",
             url: "/talk/"+command+"/"+$(this).val(),
             context: this,            
             success: function(req) {
             if( req.result=== true) {
                  var spanDom = $('span', this);
                  var numVotes = parseInt(spanDom.text());
                  if ($(this).attr("command")=="favorite") {
                      numVotes += 1;
                      $('i', this).css('color', 'red');
                      $(this).removeClass('js-favorite');
                      $(this).addClass('js-unfavorite');
                  } else {
                      numVotes -= 1;
                      $('i', this).css('color', 'black');
                      $(this).removeClass('js-unfavorite');
                      $(this).addClass('js-favorite');
                  }
                 spanDom.text(numVotes);
               }
             },
         });
    });

});
