
ArgMap.externalLayers.ui = {
	autocomplete : function(selector)
	{
		if ( ! $(selector).length ) {
			ArgMap.log("El selector CSS no coincide con ningún elemento existente");
			return;
		}
		$( selector ).click( function(){ $(this).val(""); } );
		$( selector ).autocomplete({
			/*
			 * esta función es la que jQuery UI autocomplete
			 * va a usar como fuente de datos
			 */
			source: function( request, response ) {
				$.ajax({
					url: ArgMap.PATH.API + "externalwms/layers/search.js",
					dataType: "jsonp",
					/* La api espera el parámetro jsonp_callback con el nombre de la función
					 * de callback
					 */
					jsonp: 'jsonp_callback',
					data: {
						q: request.term
						
					},
					/*
					 * ver doc de jQuery UI para ver cuándo se llama
					 * a success
					 */
					success: function( data ) {

						/*
						 * disparo evento con toda la data que devuelve la llamada
						 */
						ArgMap.Event.fire('externalLayers.ui.autocomplete.success', data.matches);

						response( $.map( data.matches, function( item ) {
							// jquery necesita que el objeto tengas las propiedades
							// title y value. Lo construyo acá
							item.label = item.proposedName + " (" + item.servername + ")";
							item.value =  item.label;
							return item;
						}));
					}
				});
			},
			minLength: 2,
			/*
			 * jQueryi UI autocomplete llama a select cuando el usuario
			 * elige uno de los resultados.
			 * Dispara el evento features.search.autocomplete.select con el item
			 * seleccionado como objeto parámetro. el objeto se pasa tal cual vuelve
			 * de la API
			 */
			select: function( event, ui ) {
				if (ui.item !== undefined) {

					ArgMap.Event.fire('externalLayers.ui.autocomplete.select', ui.item);
				}
			},
			/*
			 * jQuery llama a open cuando se DESPLIEGA el cuadro de resultados
			 * del autocomplete
			 * Dispara el evento features.search.autocomplete.open sin  parámetros
			 */
			open: function() {
				$( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
				ArgMap.Event.fire('externalLayers.ui.autocomplete.open');
			},
			/*
			 * jQuery llama a open cuando se CIERRA el cuadro de resultados
			 * del autocomplete
			 * Dispara el evento features.search.autocomplete.close sin parámetros
			 */
			close: function() {
				$( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
				ArgMap.Event.fire('externalLayers.ui.autocomplete.close');

			}
		});
	}
}
/*
 * Construye una lista de las capas cargadas en OpenLayers.Map
 * dentro de un div. Por ejemplo:
 * Ej: ArgMap.externalLayers.ui.list.init('#layerListContainer');
 * 
 * La lista de capas deja cambiar la vasibilidad (OpenLayers.Layer.setVisibility() ) de las capas y quitarlas
 * del mapa (OpenLayers.Map.removeLayer() ).
 */
ArgMap.externalLayers.ui.list = {
	/**
	 * El selector css sobre el cual construir la lista
	 */
	selector: null,
	/**
	 
	 * @param selector el selector CSS del objeto que va a contener
	 * la lista.
	 */
	init: function(selector)
	{
		if ( ! $(selector).length ) {
			ArgMap.log("El selector CSS no coincide con ningún elemento existente");
			return;
		}
		ArgMap.externalLayers.ui.list.selector = selector;
		// Escucho cuando se agrega una nueva capa al mapa para graficarla en la lista
		ArgMap.Event.subscribe('basemap.addlayer', ArgMap.externalLayers.ui.list.onAddLayer);
		// Esucho cuando se saca la capa. Al pedo. Por onRemoveLayer está vacía
		ArgMap.Event.subscribe('basemap.removelayer', ArgMap.externalLayers.ui.list.onRemoveLayer);

		ArgMap.externalLayers.ui.list.render();
	},
	/**
	 * genera la lista. de capas. 
	 */
	render: function()
	{
		$('<ul id="sortable"></ul>').appendTo(ArgMap.externalLayers.ui.list.selector);
		$( "#sortable" ).sortable({
			axis:'y',
			items : "li:not('.baseLayer')",
			update: function(event, ui) {
				//ui.item.data('layer')
				
				//renderBaseLayer le pone la clase baseLayer a los divs de la capa base
				var a= $('#sortable li:not(.baseLayer)').length;
				
				//Cambia el orden de los divs que representan cada capa
				// Creo que esto fue lo que generó confusión con el cálculo -- osk
				$('#sortable li:not(.baseLayer)').each(function() {
					var newIndex = ( $(this).index() - a ) * -1;
					ArgMap.map.setLayerIndex(ArgMap.map.getLayer($(this).data('layer').id,newIndex) );
				});
				
			}
		});

		// Ni idea para qué es esto -- osk
		$( "#sortable li" ).disableSelection();
		// La capa base la rendereo a lo último para que se note que lo de más abajo
		// está más abajo en la lista. -- osk
		ArgMap.externalLayers.ui.list.renderBaseLayer();
	},

	/**
	 * Dibuja el div de la capa base que es diferente del de las otras capas
	 */
	renderBaseLayer: function(layer)
	{
		
		var selector = '<li style="cursor:pointer" class="ui-state-default baseLayer">'
			+ ArgMap.map.baseLayer.name + '</li>';
		var li = $(selector).appendTo('#sortable');
	},

	/**
	 * Dibuja el div de las capas que no son base layers
	 * @param layer El objeto que tiene el callback del evento
	 * 'addlayer' de OpenLayers.Map
	 *
	 * layer tiene la property loadedFrom
	 * que la setea ArgMap.erternalLayers.loadWMSLayer()
	 * y corresponde al json que devolvió la API
	 *
	 */
	renderLayer: function(layer)
	{	
		var selector = '<li style="" class="ui-state-default">'
			+ layer.loadedFrom.title + '</li>';
		var li = $(selector).prependTo('#sortable');
		li.append('<span class="descripcion">' + layer.loadedFrom.name + '</span>');
		li.append('<span class="origin">' + layer.loadedFrom.servername + '</span>');
		li.append('Visibilidad');
		var s = $('<div style="margin:2px 0;width:95%"></div>').slider({
			value:0.7,
			max:0.7,
			min:0,
			step:0.1,
			slide: function(event,ui){
				ArgMap.map.getLayer(layer.id).setOpacity(ui.value);
			}
		});
		li.append(s);
		var actions = $('<span class="actionsArgMap" />');
		actions.append( '<label for="'+layer.loadedFrom.title+'">Visible</label>');
		var layerSwitch = $('<input type="checkbox" checked value="1" id="' + layer.name+ '" />');
		layerSwitch.change(function(){
			ArgMap.map.getLayer(layer.id).setVisibility($(this).is(':checked'));
		});
		actions.append(layerSwitch);
		var a = $('<a style="margin-left:3px" href="#" rel="'+layer.loadedFrom.title+'">x</a>');
		actions.append(a);
		a.click(function() {
			ArgMap.map.removeLayer(layer);
			li.remove();
		});
		li.append(actions);
		li.data('layer',layer);

	},
	onAddLayer: function(event)
	{
		ArgMap.externalLayers.ui.list.renderLayer(event.layer);
	},

	onRemoveLayer: function(event)
	{

	}

}
