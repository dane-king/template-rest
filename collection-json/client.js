var url="http://cj-client.herokuapp.com/";


var link_template;
var item_template;
var query_template;
var template_template;

function isId(element) {
    if(element.name==='id'){
        return true
    }
};

(function(h){
    var x=5;
    h.registerPartial('link','<a class="{{rel}}" href="{{href}}{{>query_param}}">{{prompt}}</a>');
    h.registerPartial('query_param','{{#each data}}{{#if @first}}?{{/if}}{{name}}={{value}}{{#unless @last}}&{{/unless}}{{/each}}');
    h.registerPartial('input','<label for="{{name}}">{{prompt}}</label><input name="{{name}}" value="{{value}}"/>');
    h.registerPartial('display','<span>{{this.prompt}}:</span> <span>{{this.value}}</span>');
    h.registerHelper('find_id', function(data) {
      for (var i = 0; i < length; i++) {
        if (isId(data[i])) 
            return data[i].value;
      }
    });
})(Handlebars)

$(document).ready(function() {
 
    link_template = Handlebars.compile($("#link-template").html());
    item_template = Handlebars.compile($("#item-template").html());
    query_template = Handlebars.compile($("#query-template").html());
    template_template = Handlebars.compile($("#template-template").html());


    httpRequest('GET',url);
 
});


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
        $("#links").html(data.collection.links.map(link_template));
        $("#items").html(data.collection.items.map(item_template));
        $("#queries").html(data.collection.queries.map(query_template));
        $("#templates").html(template_template(data.collection.template));
        
        $("#items form").hide();

        $("form button[type='submit']").bind('click',function(e){
            e.preventDefault();
            handleForm(e);
        });
        
        $("a").bind('click',function(e){
            e.preventDefault();
            handleLinks(e);
        });
        
  
    });    
};

var getFormData=function(form){
    var arrayData=form.serializeArray();
    return {"template":{"data":arrayData}}
};

var handleForm=function(e){
    var form=$(e.currentTarget.closest('form'));
    var href=form.attr('action');
    var method=form.attr('method');
    httpRequest(method,href,getFormData(form));

};

var handleLinks=function(e){
    var el=e.currentTarget;
    if(el.closest("div.item")){
        var parentId=el.closest("div.item").id
        if(el.className==='edit'){
            $("#" + parentId + " ul").hide();
            $("#" + parentId + " form").show();
            return;
        };
        if(el.className==='cancel_edit'){
            $("#" + parentId + " ul").show();
            $("#" + parentId + " form").hide();
            return;
        };        
        if(el.className==='delete'){
            $(el).on('click',httpRequest('DELETE',el.href));
            return;
        };        
    };
    httpRequest("GET", el.href);

}



