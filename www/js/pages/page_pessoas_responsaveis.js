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
    this.el.append($("<li/>").html('<a href="#">' + item.cargo + '</a>'));
}

var PessoasResponsaveis = (function(){
    var db = localStorage;

    function initialize() {	
        pessoasResponsaveisListView = new ListView(".ui-content ul");
        bindEvents();
        populatePessoasResponsaveisList(getPessoasResponsaveisFromLocalStorage());

        this.getPessoasResponsaveis = getPessoasResponsaveisFromLocalStorage;
        this.sync = sync;
        this.clear = clear;            
    }

    function bindEvents() {
        //$("a#sync").on('click',sync);
        //$("a#clear").on('click',clear);        
    }

    function populatePessoasResponsaveisList(pessoas_responsaveis) {
        pessoasResponsaveisListView.refreshList(pessoas_responsaveis);
    }
    
    function getPessoasResponsaveisFromLocalStorage() {
        return JSON.parse(db.getItem("pessoas_responsaveis"));// || [];
    }

    function clear() {
        resetLocalStorage();
        populatePessoasResponsaveisList(getPessoasResponsaveisFromLocalStorage());
    }

    function sync() { 
        url = "http://api.convenios.gov.br/siconv/v1/consulta/pessoas_responsaveis.json";
        $.getJSON(url, function(pessoas_responsaveis){       
            storePessoasResponsaveisInLocalStorage(pessoas_responsaveis);
            populatePessoasResponsaveisList(getPessoasResponsaveisFromLocalStorage());
        }); 
    }

    function resetLocalStorage() {
        db.setItem("pessoas_responsaveis", JSON.stringify({ pessoas_responsaveis: [] }));
    }

    function storePessoasResponsaveisInLocalStorage(pessoas_responsaveis) {
    	db.setItem("pessoas_responsaveis", JSON.stringify(pessoas_responsaveis.pessoas_responsaveis));
    };

    return {
        initialize: initialize,
        sync: sync,
        populate: populatePessoasResponsaveisList
    }
})();