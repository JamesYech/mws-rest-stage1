// self.addEventListener('fetch', function(event) {


// });
self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open('restreview-v1').then(function(cache) {
			return cache.addAll([
				'/',
				'css/styles.css',
				'data/restaurants.json',
				// 'img/1.jpg',
				// 'img/2.jpg',
				// 'img/3.jpg',
				// 'img/4.jpg',
				// 'img/5.jpg',
				// 'img/6.jpg',
				// 'img/7.jpg',
				// 'img/8.jpg',
				// 'img/9.jpg',
				// 'img/10.jpg',
				'img/11.png',
				'js/dbhelper.js',
				'js/main.js',
				'js/restaurant_info.js',
				'sw.js',
				'index.html',
				'restaurant.html'
				// 'restaurant.html?id=1',
				// 'restaurant.html?id=2',
				// 'restaurant.html?id=3',
				// 'restaurant.html?id=4',
				// 'restaurant.html?id=5',
				// 'restaurant.html?id=6',
				// 'restaurant.html?id=7',
				// 'restaurant.html?id=8',
				// 'restaurant.html?id=9',
				// 'restaurant.html?id=10'
			]);
		})
	)
});

// self.addEventListener('fetch', function(event){
// 	event.respondWith(
// 		caches.match(event.request).then(function(response) {
// 			if (response) {
// 				// console.log(response);
// 				return response;
// 			}
// 			return fetch(event.request);
// 		})
// 	);
// });


self.addEventListener('fetch',function(event) {
	console.log('fetch event for ', event.request.url);
	event.respondWith(
		caches.match(event.request).then(function(response) {
			if(response) {
				console.log('found ',event.request.url,' in cache');
				return response;
			}
			console.log('network request for ', event.request.url);
			return fetch(event.request)

			.then(function(response) {
				//todo 5
				return caches.open('restreview-v1').then(function(cache) {
					if (event.request.url.indexOf('test')<0) {
						cache.put(event.request.url, response.clone());

					}
					return response;
				});
			});

		}).catch(function(error) {
			//todo 6
			console.log('error here');
		})
	);
});