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
    this.el.append($("<li/>").html('<a href="#">' + item.observacao + '</a>'));
}

var OrdensBancarias = (function(){
    var db = localStorage;

    function initialize() {	
        ordensBancariasListView = new ListView(".ui-content ul");
        bindEvents();
        populateordensBancariasList(getOrdensBancariasFromLocalStorage());

        this.getOrdensBancarias = getOrdensBancariasFromLocalStorage;
        this.sync = sync;
        this.clear = clear;            
    }

    function bindEvents() {
        //$("a#sync").on('click',sync);
        //$("a#clear").on('click',clear);        
    }

    function populateOrdensBancariasList(ordens_bancarias) {
        ordensBancariasListView.refreshList(ordens_bancarias);
    }
    
    function getOrdensBancariasFromLocalStorage() {
        return JSON.parse(db.getItem("ordens_bancarias"));// || [];
    }

    function clear() {
        resetLocalStorage();
        populateOrdensBancariasList(getOrdensBancariasFromLocalStorage());
    }

    function sync() { 
        url = "http://api.convenios.gov.br/siconv/v1/consulta/ordens_bancarias.json";
        $.getJSON(url, function(ordens_bancarias){       
            storeOrdensBancariasInLocalStorage(ordens_bancarias);
            populateOrdensBancariasList(getOrdensBancariasFromLocalStorage());
        }); 
    }

    function resetLocalStorage() {
        db.setItem("ordens_bancarias", JSON.stringify({ ordens_bancarias: [] }));
    }

    function storeOrdensBancariasInLocalStorage(ordens_bancarias) {
    	db.setItem("ordens_bancarias", JSON.stringify(ordens_bancarias.ordens_bancarias));
    };

    return {
        initialize: initialize,
        sync: sync,
        populate: populateOrdensBancariasList
    }
})();