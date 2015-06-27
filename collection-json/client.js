var url="http://cj-client.herokuapp.com/";

var formUtil=(function(){
    function getFormData(form){
        var arrayData=form.serializeArray();
        return {"template":{"data":arrayData}}
    };

    function handle(e){
        var form=$(e.currentTarget.closest('form'));
        var href=form.attr('action');
        var method=form.attr('method');
        httpRequest(method,href,getFormData(form));

    };

    function showForm(form,link){
        form.show();
        link.firstChild.textContent='Cancel';    
    };

    function hideForm(form,link){
        form.hide();
        link.firstChild.textContent='Edit';    
    };

    function toggle(el){
        var link=el;
        var id=el.closest("div.item").id
        var form = $("#" + id + " form")
        form.is(':visible')?hideForm(form,link):showForm(form,link);
    };

    return {
        handle:handle,
        toggle:toggle
    }
})();


(function(h){
    //register partials
    h.registerPartial('link','<a class="{{rel}}" href="{{href}}{{>query_param}}">{{prompt}}</a>');
    h.registerPartial('query_param','{{#each data}}{{#if @first}}?{{/if}}{{name}}={{value}}{{#unless @last}}&{{/unless}}{{/each}}');
    h.registerPartial('input','<label for="{{name}}">{{prompt}}</label><input name="{{name}}" value="{{value}}"/>');
    h.registerPartial('display','<span>{{this.prompt}}:</span> <span>{{this.value}}</span>');
    h.registerHelper('find_id', function(data) {
      for (var i = 0; i < length; i++) {
        if (data[i].name==='id') 
            return data[i].value;
      }
    });
})(Handlebars);

$(document).ready(function() {
    //compile templates
    Handlebars.templates = {};
    Handlebars.templates["links"]=Handlebars.compile($("#link-tpl").html());
    Handlebars.templates["items"]=Handlebars.compile($("#item-tpl").html());
    Handlebars.templates["queries"]=Handlebars.compile($("#query-tpl").html());
    Handlebars.templates["templates"]=Handlebars.compile($("#template-tpl").html());
    httpRequest('GET',url);
});

var writeHtml=function(d){
    $("#links").html(d.links.map(Handlebars.templates['links']));
    $("#items").html(d.items.map(Handlebars.templates['items']));
    $("#queries").html(d.queries.map(Handlebars.templates['queries']));
    $("#templates").html(Handlebars.templates['templates'](d.template));
};


var httpRequest=function(method, href, form){
      $.ajax({
        url: href || url,
        data:JSON.stringify(form),
        contentType: "application/vnd.collection+json",
        type:method || "GET",
        headers: { 
            Accept : "application/vnd.collection+json",
        }
     })
    .then(function(data) {
        //call templates with data
        writeHtml(data.collection);
 
        
        //application specific behavior of links and forms
        $("#items form").hide();

        $("form button[type='submit']").bind('click',function(e){
            e.preventDefault();
            formUtil.handle(e);
        });
            
        $("a").not(".edit,.delete").bind('click',function(e){
            e.preventDefault();
            httpRequest('GET',e.currentTarget.href);
        });
        $("a.edit").bind('click',function(e){
            e.preventDefault();
            var el=e.currentTarget;
            formUtil.toggle(el)
        });
        $("a.delete").bind('click',function(e){
            e.preventDefault();
            httpRequest('DELETE',e.currentTarget.href);
        });
        
  
    });    
};








