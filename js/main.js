$(document).ready(function(){

	Hackton = {
		categories: ['conference', 'conventions', 'entertainment', 'fundraisers', 'meetings', 'other', 'performances', 'reunions', 'sales', 'seminars', 'social', 'sports', 'tradeshows', 'travel', 'religion', 'fairs', 'food', 'music', 'recreation'],
		categorySelection: $('#category'),
		country: '',
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
                var address = marker['venue'].address;
                var city = marker['venue'].city;
                var country = marker['venue'].country;
                var region = marker['venue'].region;
                var postal_code = marker['venue'].postal_code;
                var name = marker['venue'].name;

                var title = marker['title'];
                var category = marker['category'];
                var start_date = marker['start_date'];
                var url = marker['url'];
                var myLatlng = new google.maps.LatLng(lat, lon);
                var marker = new google.maps.Marker({title: title, position: myLatlng, clickable: true, animation: google.maps.Animation.DROP});
                info = new google.maps.InfoWindow({
                	content: '<p class="date">' + start_date + '</p>'	
                			+ '<h2 class="event-title">' + title + '</h2>' 
                			+	'<p><b>Category: </b>' + category + '</p>'
                			+	'<div class="address">'
                			+	'<div class="name">' + name + "</div>"
                			+	'<div class="address">' + address + '</div>'
                			+	'<div><span class="city">' + city + ', </span>'
                			+	'<span class="region">' + region + '</span></div>'
                			+	'<div><span class="postal_code>' + postal_code + '</span></div>'
                			+	'</div>'
                			+	'<div><a href="http://' + url + '">See the event</a></div>'
                });

                Hackton.markers.push(marker);

                marker.info = info;
                google.maps.event.addListener(info, 'closeclick', function() {
                    marker.info.close();
                    Hackton.openMarker = null;
				});

                google.maps.event.addListener(marker, 'click', function() {
  					marker.info.open(Hackton.map, marker);
                    if (Hackton.openMarker != null)
                    {
                        Hackton.openMarker.info.close();
                    }
                    Hackton.openMarker = marker;
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
        	Hackton.country = 'US';


            var geocoder = new google.maps.Geocoder();
            geocoder.geocode(
                {address: Hackton.zip + ', United States'},
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
			Hackton.country = '';

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
				var params = {'latitude': Hackton.latitude, 'longitude': Hackton.longitude, 'category': category, 'within':'100', 'country': Hackton.country, 'within_unit':'K','date': 'Today', 'max': '10'};

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
