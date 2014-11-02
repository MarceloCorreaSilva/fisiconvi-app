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

var Orgaos = (function(){
    var db = localStorage;

    function initialize() {	
        orgaosListView = new ListView(".ui-content ul");
        bindEvents();
        populateOrgaosList(getOrgaosFromLocalStorage());

        this.getOrgaos = getOrgaosFromLocalStorage;
        this.sync = sync;
        this.clear = clear;            
    }

    function bindEvents() {
        //$("a#sync").on('click',sync);
        //$("a#clear").on('click',clear);        
    }

    function populateOrgaosList(orgaos) {
        orgaosListView.refreshList(orgaos);
    }
    
    function getOrgaosFromLocalStorage() {
        return JSON.parse(db.getItem("orgaos"));// || [];
    }

    function clear() {
        resetLocalStorage();
        populateOrgaosList(getOrgaosFromLocalStorage());
    }

    function sync() { 
        url = "http://api.convenios.gov.br/siconv/v1/consulta/orgaos.json";
        $.getJSON(url, function(orgaos){       
            storeOrgaosInLocalStorage(orgaos);
            populateOrgaosList(getOrgaosFromLocalStorage());
        }); 
    }

    function resetLocalStorage() {
        db.setItem("orgaos", JSON.stringify({ orgaos: [] }));
    }

    function storeOrgaosInLocalStorage(orgaos) {
    	db.setItem("orgaos", JSON.stringify(orgaos.orgaos));
    };

    return {
        initialize: initialize,
        sync: sync,
        populate: populateOrgaosList
    }
})();