$(document).ready(function(){

	LoveMusic = {
		eventBriteKey: 'OF6TMFZJBW6POGG37K',
		eventBriteUser: '',
		latitude: 0,
		longitude: 0,
		zipBox: $('#zipbox'),
		zipcode: $('#zipcode'),
		zip: 0,
	    map: null,
	    mapBox: document.getElementById("map"),
        markers: [],


		init: function()
		{
            LoveMusic.zipcodeBox
			LoveMusic.initMap();
			LoveMusic.getLocationByAPI(LoveMusic.resetMapCenterPosition);
			

			LoveMusic.zipBox.children('a').click(function(){
				LoveMusic.zip = LoveMusic.zipcode.val();
				LoveMusic.zipBox.hide();
                LoveMusic.getLocationByZip(LoveMusic.resetMapCenterPosition);
			});

            //LoveMusic.setPoint(LoveMusic.latitude+1, LoveMusic.longitude-3, "Titolooooo");
		},

	    resetMapCenterPosition: function ()
	    {
	        LoveMusic.map.setCenter(new google.maps.LatLng(LoveMusic.latitude, LoveMusic.longitude));
            LoveMusic.initEventbrite(LoveMusic.setMarkers);
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

        setPoint: function(marker)
        {
            try{
                var lat = marker['venue'].latitude;
                var lon = marker['venue'].longitude;
                var title = marker['title'];
                var myLatlng = new google.maps.LatLng(lat, lon);
                var marker = new google.maps.Marker({title: title, position: myLatlng, map: LoveMusic.map});
            }catch(ex){
                console.log(ex);
            }
        },
        
		/* 
		 * 	getLocationByZip(): try to localize the user with a zip code
		 */
        getLocationByZip: function(located){
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode(
                {address: LoveMusic.zip},
                function(results, status)
                {
                    if (status == google.maps.GeocoderStatus.OK)
                    {
                        LoveMusic.latitude = results[0].geometry.location.lat();
                        LoveMusic.longitude = results[0].geometry.location.lng();
                        located();
                    }
                    else
                    {
                        // send this back to display error (e.g. zip does not exist or something like this...)
                        console.log('Geocode was not successful for the following reason: ' + status);
                    }
                },
                function(errorCode)
                {
                        // send this back to display error (e.g. zip does not exist or something like this...)
                    console.log('Geocode was not successful for the following reason: error code' + errorCode);
                }
            );
        },

		/* 
		 * 	getLocationByAPI(): try to use HTML5 geolocation to localize the user
		 */
		getLocationByAPI: function(located)
		{
			if(navigator.geolocation)
			{
				navigator.geolocation.getCurrentPosition(
                    function(position)
                    {
                        LoveMusic.latitude = position.coords.latitude;
                        LoveMusic.longitude = position.coords.longitude;
                        located();
                    },
                    function(errorCode)
                    {
                        LoveMusic.zipBox.show();
                    }
                );

			}
			else
			{
				LoveMusic.zipBox.show();
				return false;
			}

			return true;
		},

		initEventbrite: function(callback)
		{
			var markers = [];

			Eventbrite({'app_key': LoveMusic.eventBriteKey, 'user_key': LoveMusic.eventBriteUser}, function(eb_client){
				var params = {'latitude': LoveMusic.latitude, 'longitude': LoveMusic.longitude, 'date': 'Today', 'max': '100'};

				eb_client.event_search( params, function( response ){
					console.log(response);
	    			$.each(response.events, function(i, val){
	    				if(i != 0){
	    					var marker = new Array;

	    					marker["category"] = val.event.category;
	    					marker["start_date"] = val.event.start_date;
	    					marker["end_date"] = val.event.end_date;
	    					marker["title"] = val.event.title;
	    					marker["url"] = val.event.url;
	    					marker["venue"] = val.event.venue;

	    					markers.push(marker);
	    				}
	    			});
	    			//LoveMusic.setMarkers(markers);
                    LoveMusic.markers = markers;
                    callback();
				});
			});
		},
        setMarkers: function()
        {
            for (var i = 0; i<LoveMusic.markers.length; i++)
            {
                LoveMusic.setPoint(LoveMusic.markers[i]);
            }
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
		}

	}

	LoveMusic.init();

});
