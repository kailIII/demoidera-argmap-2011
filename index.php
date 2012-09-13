<!DOCTYPE html> 
<html> 
    <head> 
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<!-- Para que IE8 y IE9 procesen en modo estándar -->
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

        <title>IDERA</title> 
        <!-- Importo el CSS de OL. Auto import no funciona con nuestra versión minified de OpenLayers.js--> 

		<link rel="stylesheet" type="text/css" href="css/style.css"/>

		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js"></script>
		<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.10/jquery-ui.min.js"></script> 
		<script src="http://api.ign.gob.ar/javascript.js?package=ArgMap"></script>
	
		<script src="js/app.js"></script> 
		<script src="js/app.ui.js"></script>
		<script src="js/app.ui.layersBox.js"></script>
		<script src="js/ArgMap.externalLayers.js"></script>
		<script src="js/ArgMap.externalLayers.ui.js"></script>
		<script type="text/javascript">
		jQuery(document).ready(function() {
			App.init();
		});
		</script>

    </head> 
    <body> 
		<div class="topbar" style="">
		  <div class="topbar-inner">
		    <div class="container fixed">
			  <h3><a class="logo"><span class="blueFont">Arg</span>Map</a></h3>
			  <!--
			  <ul>
			    <li><a id="" href="#">Archivo</a></li>
				<li class="menu">
					<a id="" class="menu" href="#">Contenido del mapa</a>
					<ul class="menu-dropdown">
						<li><a id="layersBoxButton" href="#" >Buscar capas WMS en la IDE</a></li>
					</ul>
				</li>
			  </ul>
			  -->
			  <form >
				<input type="text" placeHolder="Búsqueda de topónimos" id="searchBox"/>
			  </form>
			  <ul class="nav secondary-nav">
				<li>
					<form >
						<input type="text"  placeHolder="Buscar capas WMS en la IDE" id="layerSearchBox"/>
					</form>
				</li>
			    <li><a id="" href="#">Ayuda</a></li>
			  </ul>
		    </div>
		  </div>
		</div>

		<div  class="container-fluid" style="margin-top:40px">
			<div class="sidebar">
				<div class="page-header">
				<h3>Capas de este mapa</h3>
				</div>
				<div class="row" id="layerListBox">

				</div>
			</div>
			<div class="content">
				<div class="page-header">
				<h3>IDERA <small>Interoperabilidad entre servicios WMS</small></h3>
				</div>
				<div class="row" style="margin:0;">
					<div id="mapcontainer"></div>
					
				</div>	<!--row-->
			</div> <!--content-->
		</div> <!-- container -->
				

    </body> 
</html>
