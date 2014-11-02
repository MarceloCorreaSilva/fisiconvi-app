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
    this.el.append($("<li/>").html('<a href="#">' + item.nome + '</a>'));
}

var Proponentes = (function(){
    var db = localStorage;

    function initialize() {	
        proponentesListView = new ListView(".ui-content ul");
        bindEvents();
        populateProponentesList(getProponentesFromLocalStorage());

        this.getProponentes = getProponentesFromLocalStorage;
        this.sync = sync;
        this.clear = clear;            
    }

    function bindEvents() {
        //$("a#sync").on('click',sync);
        //$("a#clear").on('click',clear);        
    }

    function populateProponentesList(proponentes) {
        proponentesListView.refreshList(proponentes);
    }
    
    function getProponentesFromLocalStorage() {
        return JSON.parse(db.getItem("proponentes"));// || [];
    }

    function clear() {
        resetLocalStorage();
        populateProponentesList(getProponentesFromLocalStorage());
    }

    function sync() { 
        url = "http://api.convenios.gov.br/siconv/v1/consulta/proponentes.json";
        $.getJSON(url, function(proponentes){       
            storeProponentesInLocalStorage(proponentes);
            populateProponentesList(getProponentesFromLocalStorage());
        }); 
    }

    function resetLocalStorage() {
        db.setItem("proponentes", JSON.stringify({ proponentes: [] }));
    }

    function storeProponentesInLocalStorage(proponentes) {
    	db.setItem("proponentes", JSON.stringify(proponentes.proponentes));
    };

    return {
        initialize: initialize,
        sync: sync,
        populate: populateProponentesList
    }
})();