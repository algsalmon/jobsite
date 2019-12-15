// Push notifications
const publicVapidKey = "BFY-_UWXlRRDPkSiBqTQuP1L9hT5L0s2t4VEESG0dCkeAIFzxEfkoMH5iEsVx8QEgXvxKX5io6UMo5W1QACK7eI";
var  registerPushNotifications;

// Check for service worker
if ("serviceWorker" in navigator) {
  send().catch(err => console.error(err));
}

// Register SW, Register Push, Send Push
async function send() {
  // Register Service Worker
  console.log("Registering service worker...");
  const register = await navigator.serviceWorker.register("/worker.js", {
    scope: "/"
  });
  console.log("Service Worker Registered...");


  registerPushNotifications = function (jobCategories) {
    // Register Push
    console.log("Registering Push...");
    const subscription = register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });
    console.log("Push Registered...");
    const data = {
      subscription:subscription,
      jobCategories:jobCategories
    }
    // Send Push Notification
    console.log("Sending Push...");
    fetch("/subscribe", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "content-type": "application/json"
      }
    });
    console.log("Push Sent...");
    return true;
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}






Notification.requestPermission(function (status) {
  console.log('Notification permission status:', status);
});

function displayNotification() {
  if (Notification.permission == 'granted') {
    navigator.serviceWorker.getRegistration()
      .then(function (reg) {
        var options = {
          body: 'get job notifications!',
          actions: [
            {
              action: 'https://www.jobgrabba.com/register', title: 'Explore this new world',
              icon: 'images/checkmark.png'
            },
            {
              action: 'close', title: 'Close notification',
              icon: 'images/xmark.png'
            },
          ]
        };
        reg.showNotification('Jobgrabba', options);
      });
  }
}