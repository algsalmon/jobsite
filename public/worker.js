console.log('Service Worker Loaded...');

self.addEventListener('notificationclick', function(event) {
   let url = '/c2version?jobCategory='+self.jobCategory+"&jobLocation="+self.jobLocation;
   event.notification.close(); // Android needs explicit close.
   event.waitUntil(
       clients.matchAll({type: 'window'}).then( windowClients => {
           // Check if there is already a window/tab open with the target URL
           for (var i = 0; i < windowClients.length; i++) {
               var client = windowClients[i];
               // If so, just focus it.
               if (client.url === url && 'focus' in client) {
                   return client.focus();
               }
           }
           // If not, then open the target URL in a new window/tab.
           if (clients.openWindow) {
               return clients.openWindow(url);
           }
       })
   );
});

self.addEventListener('push', e => {
   console.log('Push Has Been Received');
   const data = e.data.json();  
   self.jobCategory = data.jobCategory;
   self.jobLocation = data.location;
   var notificationOptions = {
      body: 'New '+self.jobCategory+' jobs found.\nBe one of the first to apply, Click here',
      icon: '/images/logojobgrabba.png',
      data: {url: "http://localhost:3027/c2version"},
      actions: [{action:"open_url",title:"View now"}]
   }
   
   self.registration.showNotification(data.title,notificationOptions);
});