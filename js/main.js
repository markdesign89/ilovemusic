


LoveMusic = {

	eventBriteKey: 'OF6TMFZJBW6POGG37K',
	eventBriteUser: '',
	latitude: 40.714224,
	longitude: -73.961452,
	zip: 0,
    map: null,
    mapBox: document.getElementById("map"),


	init: function()
	{
		LoveMusic.getLocation();
		LoveMusic.initEventbrite();
        LoveMusic.initMap();
	},

	initMap: function()
	{
		var mapOptions = {
        	zoom: 8,
        	center: new google.maps.LatLng(LoveMusic.latitude, LoveMusic.longitude),
        	mapTypeId: google.maps.MapTypeId.ROADMAP
    	};

        LoveMusic.map = new google.maps.Map(LoveMusic.mapBox, mapOptions);
	},

	setPoint: function()
	{

	},

	/* 
	 * 	getLocation(): try to use HTML5 geolocation to localize the user
	 */
	getLocation: function()
	{
		if(navigator.geolocation)
		{
			navigator.geolocation.getCurrentPosition(function(position){
				LoveMusic.latitude = position.coords.latitude;
				LoveMusic.longitude = position.coords.longitude;
			});

			console.log(LoveMusic.latitude);
			console.log(LoveMusic.longitude);

			if(LoveMusic.latitude == 0 || LoveMusic.longitude == 0)
			{
				return false;
			}
		}
		else
		{
			return false;
		}

		return true;
	},

	initEventbrite: function()
	{
		Eventbrite({'app_key': LoveMusic.eventBriteKey, 'user_key': LoveMusic.eventBriteUser}, function(eb_client){
			var params = {'latitude': LoveMusic.latitude, 'longitude': LoveMusic.longitude, 'date': 'Today', 'max': '100'};

			eb_client.event_search( params, function( response ){
    			console.log(response);
    			
			});
		});
	},

	getDate: function()
	{
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth();
		var yyyy = today.getFullYear();

		if(dd < 10){
			dd = '0' + dd;
		} 

		if(mm < 10){
			mm = '0' + mm;
		} 

		today = yyyy + '-' + mm + '-' + dd;

		console.log(today);
		return today;
	},

}

LoveMusic.init();

