/********************************* 
    CACHE VERSIONING
***********************************/
//Suppose we update any of the resource file say index.html and then save it.
//The browser will not update the file since we are getting it from cached asstes and they contain the older version from which the file is being fetched.
//Now in order to update the index.html file we change the service-worker.js file as doing so the file will again install and will update any file changed in the cache-Array.
//The updated cache name gets added in the browser cache but the browser does not know from where to fetch that file i.e from the older cache version or the newer cache version.
//So we need to update the version by deleteing the previous cache version from the cache during the activation event.

//Name of cache in which we store the assets
const staticCache='app-shell-static-cache';

const dynamicCache='less-visited-dynamic-cache';

//In this array we basically store the Request URL's.
// for the very first time When ever a request is made to server then these requested URL's are passed as keys and we get the appropriate response as value for each request.
//Our cache  will store the key Value pairs of request and respopnses.
//Then once these resources are cahed then everytime these url's are fetched then they are fetched from this cache and not from server.
const cachedAssets=[
    '/',
    '/index.html',
    '/manifest.json',
    '/dummy-image.jpg',
    '/js/app.js',
    '/css/style.css',
    '/icons/icon.png',
    '/icons/icon72x72.png',
    '/icons/icon96x96.png',
    '/icons/icon128x128.png',
    '/icons/icon144x144.png',
    '/icons/icon152x152.png',
    '/icons/icon192x192.png',
    '/icons/icon384x384.png',
    '/icons/icon512x512.png',
    'https://fonts.googleapis.com/css?family=Nunito:400,700&display=swap',
    '/html/fallback.html'
];
//Install the SW
//Listen to the install event
//Self here means the service worker
self.addEventListener('install',evt=>{

    //here we will use a Cache API
    //This open function takes the name of cache as parameter.
    //If the cache with this name exists then it opens it.
    //If the cache with this name does not exists the it create a cache with this name and then open it.
    //This .open() method is asynchronous and returns a promise.
    //The promise if resolved return the opened cache else Error.

    //Waituntil mehtod waits until all assets have been cached and then the lets the Serviceworker to become
    evt.waitUntil(
         caches
            .open(staticCache)
            .then(cache=>{
                //addAll method adds an array of resource to be cached.
                cache.addAll(cachedAssets);
            })

            //If an error comes then the installation fails.
            .catch(error=>console.log())
        );
        self.skipWaiting();
});

/*
//Activate event fires when service worker gets activated.
self.addEventListener('activate',evt=>{
   
    //Wait untill the old cache gets deleted.
    //Pauses the activation time so that the oparations can get completed.

    evt.waitUntil(

        //This keys() method return an array of all caches that we have created and a PROMISE.
        caches.keys()
        .then(cacheNames=>{
           //Now we wiil iterate over that entire array of cache-names 
           cacheNames.map((element)=>{
               //And will check which cache name doesn't match our new updated cache version name.
               if(element!==staticCache){
                   //WHen that older cache name is found then we just delete that cache name from the Cache using the delete method.
                   caches.delete(element);
               }
           })
        })
        .catch(error=>console.log(`Error in Activating ${error}`))
    );
});
*/

//Limiting the cache size
    const limitCacheSize=(cacheName,cacheSize)=>
    {
        //First of  all we open the desired cache in which we want to limit the size.
        //Once the cache gets opened the  it returns a promise which resolves with that opened cache.
        caches.open(cacheName).then(openedCache=>
            {
                //Once we get the opened cache then using keys() method we can get the array of all the  ASSESTS in that cache.
            openedCache.keys().then(cacheElements=>
                {
                    //We now check if the size of that array of asstes is greater than our given limited size.
                    if(cacheElements.length>cacheSize)
                    {
                        //if the size is greater than our size then we go on deleteing that asset from the array of the opened cache.
                        //We go on deleting the veri first member of that array which was cached very first.
                        //This delete method returns a promise and then we consume it using then().
                        openedCache.delete(cacheElements[0])

                        //We recurseively call the limitCaceSize function till the size become equal to our given size. 
                        .then(limitCacheSize(cacheName,cacheSize));
                    }
                })
            })
    }
//Service worker listens for fetch events

self.addEventListener('fetch',evt=>{
    //Here we store the value of requested URL.
    const requestURL=evt.request.url;
    //Once a fetch request is made to the server then this respondWith
    //function pauses the fetch request and this waits for a response.
        evt.respondWith(

            //Now we match that generated fetch request in our app-shell-cache.
            //If that particular request matches one of the members of that cache-array then the corresponding response in returned.
            //Since in our cache the Request and Responses are stored in key value pairs.
            //This match() method return a promise and if resolved it returns a cache response.
            //This cache response can be empty if the request was not found in our cache.
            caches.match(requestURL)
            .then(cacheRes=>
            {
                //But if it returns an empty response then we just let the fetch request initate as usual.
                return cacheRes || fetch(evt.request).then(fetchResponse=>
               {
                    //If the requested URL Returns undefined then we let the fetch request proceed.
                    //But if we want to cache any resource dynamically or automatically once it is visited then.
                    //We can returned a opened cache which will be other than static cache.
                    //And since the fetch() method returned a response so we just PUT that response/request in that dynamic cache.

                    //Now suppose we want to limit our dynamic cache size.
                    //We dont want to add a lot of responses in our cache.
                    //So when the fetch request is made then after returning a promise we simple call the limitCacheSize function.

                    return caches.open(dynamicCache)
                    .then(openedcache=>
                        {
                        openedcache.put(requestURL,fetchResponse);
                        limitCacheSize(dynamicCache,2);
                        return fetchResponse;
                        })
                    /*
                    return caches.open(dynamicCache).then(openedCache=>{
                        openedCache.put(evt.request.url,fetchResponse);
                        return fetchResponse;
                    })
                    */
                    
                    //We did'nt use the addAll() or add() method because they manually go to server and fetch the resources.
                    //Put method just takes the given response and stores it ina key/value pair with its request.
               })
            })
            //If the requested Requested URL does not match any of our URLS in out Cache.
            //Then we say the promise is rejected and the catch handler consumes it.
            //Now we just simple send the fallback page by matching the fall back page url in the cache.
            //The moment the url gets matched the appropriate response gets returned.
            .catch(()=>
            {

                //We can add conditions for out fallbacks 
                //E.G .html => return html file response .css=> return css file response.
                if(requestURL.includes('.html'))
                {
                    return caches.match('/html/fallback.html');
                }
            })

        )
 });
