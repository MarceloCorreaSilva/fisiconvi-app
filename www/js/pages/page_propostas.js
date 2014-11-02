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

var Propostas = (function(){
    var db = localStorage;

    function initialize() {	
        propostasListView = new ListView(".ui-content ul");
        bindEvents();
        populatePropostasList(getPropostasFromLocalStorage());

        this.getPropostas = getPropostasFromLocalStorage;
        this.sync = sync;
        this.clear = clear;            
    }

    function bindEvents() {
        //$("a#sync").on('click',sync);
        //$("a#clear").on('click',clear);        
    }

    function populatePropostasList(propostas) {
        propostasListView.refreshList(propostas);
    }
    
    function getPropostasFromLocalStorage() {
        return JSON.parse(db.getItem("propostas"));// || [];
    }

    function clear() {
        resetLocalStorage();
        populatePropostasList(getPropostasFromLocalStorage());
    }

    function sync() { 
        url = "http://api.convenios.gov.br/siconv/v1/consulta/propostas.json";
        $.getJSON(url, function(propostas){       
            storePropostasInLocalStorage(propostas);
            populatePropostasList(getPropostasFromLocalStorage());
        }); 
    }

    function resetLocalStorage() {
        db.setItem("propostas", JSON.stringify({ propostas: [] }));
    }

    function storePropostasInLocalStorage(propostas) {
    	db.setItem("propostas", JSON.stringify(propostas.propostas));
    };

    return {
        initialize: initialize,
        sync: sync,
        populate: populatePropostasList
    }
})();