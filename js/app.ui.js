App.ui = {
	init: function()
	{
		//ArgMap.buildBaseMap();
		ArgMap.map = new ArgMap.Map;
		ArgMap.features.search.autocomplete('#searchBox');

		App.ui._initToolbar();

		ArgMap.externalLayers.ui.autocomplete('#layerSearchBox');
		ArgMap.externalLayers.ui.list.init('#layerListBox');
		ArgMap.Event.subscribe('features.search.autocomplete.select', App.ui.previewToponym);
		ArgMap.Event.subscribe('externalLayers.ui.autocomplete.select', App.ui.previewLayer);
		App.ui.resizeStuff();
		$(window).resize(function(){
			App.ui.resizeStuff();
		});
		$('form').submit(function() {
			return false;
		});
	},

	resizeStuff: function()
	{
		$('#mapcontainer').outerWidth( $('#mapcontainer').parent().innerWidth() );
		$('#mapcontainer').outerHeight( $(window).height() - $('#mapcontainer').offset().top - 20);


	},
	_initToolbar: function()
	{
		// para abrir y cerrar los dropdown de la barra
		$("a.menu").click(function (e) {
			var $li = $(this).parent("li").toggleClass('open');
	    return false;
		});

		$("#layersBoxButton").click(function(e) {
			App.ui.layersBox.toggle();
		});
	},
	previewLayer: function(layer)
	{
		layer.type = 'wms';
		layer.serverURL = layer.url;
		ArgMap.externalLayers.load( layer );
	},

	previewToponym: function(item)
	{
		var extent;

		extent = new OpenLayers.Bounds(item.left, item.bottom, item.right, item.top);
		/*
		 * ArgMap.map es un objeto OpenLayers.Map de OpenLayers
		 * Ver http://dev.openlayers.org/docs/files/OpenLayers/Map-js.html
		 */
		ArgMap.map.zoomToExtent(extent);
	}
	
};

