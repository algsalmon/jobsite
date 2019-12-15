console.log('Service Worker Loaded...');

self.addEventListener('push', e => {
   console.log('Push Has Been Received');
   const data = e.data.json();   
   self.registration.showNotification(data.title, {
      body: 'Welcome to Jobgrabba:'+data,
      icon: '/images/logojobgrabba.png'
   });
});