App.ui.layersBox = {
	_selector: null,

	init: function(selector)
	{
		if ( ! $(selector).length ) {
			ArgMap.log("El selector CSS no coincide con ningún elemento existente");
			return;
		} else {
			App.ui.layersBox.selector = selector;
			$(selector).dialog({
				autoOpen:false
			});
		}
	},
	open: function()
	{
		$(App.ui.layersBox.selector).dialog("open");
	},
	
	close: function()
	{
		$(App.ui.layersBox.selector).dialog("close");
	},
	
	toggle: function()
	{
		if ($(App.ui.layersBox.selector).dialog('isOpen')) {
			$(App.ui.layersBox.selector).dialog("close");
		} else {
			$(App.ui.layersBox.selector).dialog("open");
		}
	}
};
