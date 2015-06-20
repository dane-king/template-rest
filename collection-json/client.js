var url="http://cj-client.herokuapp.com/";


var link_template;
var item_template;
var query_template;
var template_template;

function isId(element, index, array) {
    if(element.name==='id'){
        return true
    }
};

$(document).ready(function() {
    Handlebars.registerPartial('link','<a class="{{rel}}" href="{{href}}{{>query_param}}">{{prompt}}</a>');
    Handlebars.registerPartial('query_param','{{#each data}}{{#if @first}}?{{/if}}{{name}}={{value}}{{#unless @last}}&{{/unless}}{{/each}}');
    Handlebars.registerPartial('input','<label for="{{name}}">{{prompt}}</label><input name="{{name}}" value="{{value}}"/>');
    Handlebars.registerPartial('display','<span>{{this.prompt}}:</span> <span>{{this.value}}</span>');
    Handlebars.registerHelper('find_id', function(data) {
      for (var i = 0; i < length; i++) {
        item_key = data[i];
        if (item_key.name==='id') 
            return item_key.value;
      }
    });  
    link_template = Handlebars.compile($("#link-template").html());
    item_template = Handlebars.compile($("#item-template").html());
    query_template = Handlebars.compile($("#query-template").html());
    template_template = Handlebars.compile($("#template-template").html());
    httpRequest('GET',url);
 
});
var putForm=function(e){
    var form=e.currentTarget.closest('form');
    var arrayData=$(form).serializeArray()
    var formData={"template":{"data":arrayData}}
    httpRequest('PUT',form.action,formData);

};
var postForm=function(e){
    var form=e.currentTarget.closest('form');
    var arrayData=$(form).serializeArray()
    var formData={"template":{"data":arrayData}}
    httpRequest('POST',form.action,formData);

};
var httpRequest=function(method, url, form){
      $.ajax({
        url: url,
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
        $("#items button[type='submit']").bind('click',function(e){
            e.preventDefault();
            putForm(e);
        });
        $("#template button[type='submit']").bind('click',function(e){
            e.preventDefault();
            postForm(e);
        });
        $("a").bind('click',function(e){
            e.preventDefault();
            bindLinks(e);
        });
        $(".create-form form").attr("action",url);
    });    
};
var bindLinks=function(e){
    var el=e.currentTarget;
    if(el.closest("div.item")){
        var parentId=el.closest("div.item").id
        if(el.className==='edit'){
            $("#" + parentId + " ul").hide();
            $("#" + parentId + " form").show();
            $("#" + parentId + " form").attr("method","POST");
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



