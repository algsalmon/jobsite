self.addEventListener('notificationclose', function(e) {
    var notification = e.notification;
    var primaryKey = notification.data.primaryKey;
    var action = e.action;
  
    console.log('Closed notification: ' + primaryKey);
    if (action === 'close') {
      notification.close();
    } else {
      clients.openWindow('http://www.example.com');
      notification.close();
    }
  });

  self.addEventListener('notificationclick', function(e) {
    var notification = e.notification;
    var primaryKey = notification.data.primaryKey;
    var action = e.action;
  console.log('clicked yes on notification'+ primaryKey)
    if (action === 'close') {
      notification.close();
    } else {
      clients.openWindow('http://www.example.com');
      notification.close();

    }
  });


  