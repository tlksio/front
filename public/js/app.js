$(document).ready(function(){

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
});
