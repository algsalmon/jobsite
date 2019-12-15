console.log('Service Worker Loaded...');

self.addEventListener('push', e => {
   const data = e.data.json();
   console.log('Push Has Been Received');
   self.registration.showNotification(data.title, {
      body: 'Welcome to Jobgrabba',
      icon: '/images/logojobgrabba.png'
   });
});