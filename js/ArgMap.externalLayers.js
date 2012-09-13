ArgMap.externalLayers = {
	_loaded: [],

	load : function(layer)
	{
		if (layer.type == 'wms') {
			ArgMap.externalLayers.loadWMSLayer(layer);
		}
	},
	loadWMSLayer: function(layer)
	{
		var wmsLayer = new OpenLayers.Layer.WMS(
			layer.title, layer.serverURL,
			{
				layers: [layer.name],
				format: "image/png" ,
				transparent: true
			}, {
				isBaseLayer:false,
				singleTile:true,
				displayOutsideMaxExtent:true
			});
		if (!wmsLayer) {
			ArgMap.log("error al cargar la capa externa");
			return;
		}
		wmsLayer.loadedFrom = layer;
		ArgMap.map.addLayer(wmsLayer);
		//ArgMap.externalLayers._loaded.push(wmsLayer);

	},

	_handleAddRemoveLayer: function(map)
	{
		map.events.register('preaddlayer', ArgMap, function(event) {
			ArgMap.Event.fire('externalLayers.preaddlayer', event.layer);
		});
		map.events.register('removelayer', ArgMap, function(event) {
			ArgMap.Event.fire('externalLayers.removelayer', event.layer);
		});
	}

};
ArgMap.Event.subscribe('basemap.built', ArgMap.externalLayers._handleAddRemoveLayer);
