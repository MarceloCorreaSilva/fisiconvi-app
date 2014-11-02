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

var Municipios = (function(){
    var db = localStorage;

    function initialize() {	
        muncipiosListView = new ListView(".ui-content ul");
        bindEvents();
        populateMunicipiosList(getMunicipiosFromLocalStorage());

        this.getMunicipios = getMunicipiosFromLocalStorage;
        this.sync = sync;
        this.clear = clear;            
    }

    function bindEvents() {
        //$("a#sync").on('click',sync);
        //$("a#clear").on('click',clear);        
    }

    function populateMunicipiosList(municipios) {
        muncipiosListView.refreshList(municipios);
    }
    
    function getMunicipiosFromLocalStorage() {
        return JSON.parse(db.getItem("municipios"));// || [];
    }

    function clear() {
        resetLocalStorage();
        populateMunicipiosList(getMunicipiosFromLocalStorage());
    }

    function sync() { 
        url = "http://api.convenios.gov.br/siconv/v1/consulta/municipios.json?";
        $.getJSON(url, function(municipios){       
            storeMunicipiosInLocalStorage(municipios);
            populateMunicipiosList(getMunicipiosFromLocalStorage());
        }); 
    }

    function resetLocalStorage() {
        db.setItem("municipios", JSON.stringify({ municipios: [] }));
    }

    function storeMunicipiosInLocalStorage(municipios) {
    	db.setItem("municipios", JSON.stringify(municipios.municipios));
    };

    return {
        initialize: initialize,
        populate: populateMunicipiosList
    }
})();