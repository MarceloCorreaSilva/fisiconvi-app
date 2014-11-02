var ListView = function(el){
    this.el = $(el);
}; 

ListView.prototype.refreshList = function(items){     
    this.el.html('');
    this.el.hide();
    this.addItems(items);
    this.el.fadeIn('slow');
};

ListView.prototype.addItems = function(items) {        
    $.each(items, $.proxy(function(i,item){
        this.addItem(item);
    },this));  
};

ListView.prototype.addItem = function(item){    
    this.el.append($("<li/>").html('<a href="#">' + item.objeto_resumido + '</a>'));
}

var Convenios = (function(){
    var db = localStorage;

    function initialize() {	
        conveniosListView = new ListView(".ui-content ul");
        bindEvents();
        populateConveniosList(getConveniosFromLocalStorage());

        this.getConvenios = getConveniosFromLocalStorage;
        this.sync = sync;
        this.clear = clear;            
    }

    function bindEvents() {
        //$("a#sync").on('click',sync);
        //$("a#clear").on('click',clear);        
    }

    function populateConveniosList(convenios) {
        conveniosListView.refreshList(convenios);
    }
    
    function getConveniosFromLocalStorage() {
        return JSON.parse(db.getItem("convenios"));// || [];
    }

    function clear() {
        resetLocalStorage();
        populateConveniosList(getConveniosFromLocalStorage());
    }

    function sync() { 
        url = "http://api.convenios.gov.br/siconv/v1/consulta/convenios.json?";
        $.getJSON(url, function(convenios){       
            storeConveniosInLocalStorage(convenios);
            populateConveniosList(getConveniosFromLocalStorage());
        }); 
    }

    function resetLocalStorage() {
        db.setItem("convenios", JSON.stringify({ convenios: [] }));
    }

    function storeConveniosInLocalStorage(convenios) {
    	db.setItem("convenios", JSON.stringify(convenios.convenios));
    };

    return {
        initialize: initialize,
        sync: sync,
        populate: populateConveniosList
    }
})();