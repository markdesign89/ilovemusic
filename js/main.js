


LoveMusic = {

	eventBriteKey: 'OF6TMFZJBW6POGG37K',
	eventBriteUser: '',
	latitude: 40.714224,
	longitude: -73.961452,
	zip: 0,


	init: function()
	{
		LoveMusic.initEventbrite();
	},

	initMap: function()
	{

	},

	setPoint: function()
	{

	},

	jamBase: function()
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

	getZip: function()
	{
		if(LoveMusic.latitude != 0 && LoveMusic.longitude != 0)
		{
			$.getJSON('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + LoveMusic.latitude + ',' + LoveMusic.longitude, function(data){
				console.log(data);
			});
		}
		else 
		{
			return false;
		}	
	},

	initEventbrite: function()
	{
		Eventbrite({'app_key': LoveMusic.eventBriteKey, 'user_key': LoveMusic.eventBriteUser}, function(eb_client){
			var params = {'city': 'San Francisco', 'region': 'CA'};

			eb_client.event_search( params, function( response ){
    			console.log( response );
    			$('#e').html(response);
			});
		});
	},

}

LoveMusic.init();