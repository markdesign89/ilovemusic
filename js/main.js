$(document).ready(function(){

	Hackton = {
		categories: ['conference', 'conventions', 'entertainment', 'fundraisers', 'meetings', 'other', 'performances', 'reunions', 'sales', 'seminars', 'social', 'sports', 'tradeshows', 'travel', 'religion', 'fairs', 'food', 'music', 'recreation'],
		categorySelection: $('#category'),
		eventBriteKey: 'OF6TMFZJBW6POGG37K',
		eventBriteUser: '',
		latitude: 0,
		longitude: 0,
		map: null,
	    mapBox: document.getElementById("map"),
        markers: [],
		zipBox: $('#zipbox'),
		zipcode: $('#zipcode'),
		zip: 0,
	    


		init: function()
		{
			Hackton.initLayout();

			Hackton.zipcodeBox
			Hackton.initMap();
			Hackton.getLocationByAPI(Hackton.resetMapCenterPosition);
			


			Hackton.zipBox.children('a').click(function(){
				Hackton.zip = Hackton.zipcode.val();
				Hackton.zipBox.hide();
                Hackton.getLocationByZip(Hackton.resetMapCenterPosition);
			});

			Hackton.categorySelection.change(function(){
				var category = $(this).val();
				Hackton.clearMarkers();
				Hackton.initEventbrite(category);
			});

		},

		initLayout: function()
		{
			var select = '';
			for(var i = 0; i < Hackton.categories.length; i++){
				select += '<option value="' + Hackton.categories[i] + '">' + Hackton.categories[i] + '</option>';
			}

			Hackton.categorySelection.append(select);
		},

	    resetMapCenterPosition: function ()
	    {
	        Hackton.map.setCenter(new google.maps.LatLng(Hackton.latitude, Hackton.longitude));
            Hackton.initEventbrite();
	    },

		initMap: function()
		{
			var latLon = new google.maps.LatLng(Hackton.latitude, Hackton.longitude);

			var geocoder = new google.maps.Geocoder();

			var mapOptions = {
	        	zoom: 10,
	        	center: new google.maps.LatLng(Hackton.latitude, Hackton.longitude),
	        	mapTypeId: google.maps.MapTypeId.ROADMAP
	    	};


	        Hackton.map = new google.maps.Map(Hackton.mapBox, mapOptions);
		},	

        setPoint: function(marker)
        {
            try{
                var lat = marker['venue'].latitude;
                var lon = marker['venue'].longitude;
                var title = marker['title'];
                var category = marker['category'];
                var start_date = marker['start_date'];
                var url = marker['url'];
                var myLatlng = new google.maps.LatLng(lat, lon);
                var marker = new google.maps.Marker({title: title, position: myLatlng, clickable: true, animation: google.maps.Animation.DROP});
                marker.info = new google.maps.InfoWindow({
                	content: 	'<h2>' + title + '</h2>' 
                			+	'<p>' + start_date + '</p>'
                			+	'<p>' + category + '</p>'
                			+	'<a href="' + url + '">See the event</a>'
                			+	''
                });

                Hackton.markers.push(marker);

                google.maps.event.addListener(marker, 'click', function() {
  					marker.info.open(Hackton.map, marker);
				});

            }catch(ex){
                console.log(ex);
            }
        },

        clearMarkers: function()
        {
        	for (var i = 0; i < Hackton.markers.length; i++ ) {
        		if(Hackton.markers[i]){
        			Hackton.markers[i].setMap(null);
        		}
    		}
    		Hackton.markers = [];
        },

        showMarkers: function()
        {
        	for (var i = 0; i < Hackton.markers.length; i++ ) {
        		if(Hackton.markers[i]){
        			setTimeout(Hackton.dropMarker(i), i * 100);
        		}
    		}
        },

        dropMarker: function(i)
        {
        	return function() {
              Hackton.markers[i].setMap(Hackton.map);
            }
        },
        
		/* 
		 * 	getLocationByZip(): try to localize the user with a zip code
		 */
        getLocationByZip: function(located){
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode(
                {address: Hackton.zip},
                function(results, status)
                {
                    if (status == google.maps.GeocoderStatus.OK)
                    {
                        Hackton.latitude = results[0].geometry.location.lat();
                        Hackton.longitude = results[0].geometry.location.lng();
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
                        Hackton.latitude = position.coords.latitude;
                        Hackton.longitude = position.coords.longitude;
                        located();
                    },
                    function(errorCode)
                    {
                        Hackton.zipBox.show();
                    }
                );

			}
			else
			{
				Hackton.zipBox.show();
				return false;
			}

			return true;
		},

		initEventbrite: function(category, distance, date)
		{

			Eventbrite({'app_key': Hackton.eventBriteKey, 'user_key': Hackton.eventBriteUser}, function(eb_client){
				var params = {'latitude': Hackton.latitude, 'longitude': Hackton.longitude, 'category': category, 'within':'100', 'within_unit':'K','date': 'Today', 'max': '60'};

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

	    					Hackton.setPoint(marker);
	    				}
	    			});
	    			Hackton.showMarkers();
				});
			});
		},

	}

	Hackton.init();

});
