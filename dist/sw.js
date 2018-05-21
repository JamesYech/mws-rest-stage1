self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open('restreview-v1').then(function(cache) {
			return cache.addAll([
				'/',
				'css/styles.css',
				'data/restaurants.json',
				'js/dbhelper.js',
				'js/main.js',
				'js/restaurant_info.js',
				'sw.js',
				'img/11.png'
			]);
		})
	)
});

//Fetch from cache.  If not cached fetch from network and cache
//new resources.
self.addEventListener('fetch',function(event) {
	event.respondWith(
		caches.match(event.request).then(function(response) {
			if(response) {
				return response;
			}
			return fetch(event.request)
			.then(function(response) {
				return caches.open('restreview-v1').then(function(cache) {
					if (event.request.url.indexOf('test')<0) {
						cache.put(event.request.url, response.clone());
					}
					return response;
				});
			});
		}).catch(function() {
			//return generic 404 image placeholder
			return caches.match('img/11.png');
		})
	);
});