const publicVapidKey = 'BFY-_UWXlRRDPkSiBqTQuP1L9hT5L0s2t4VEESG0dCkeAIFzxEfkoMH5iEsVx8QEgXvxKX5io6UMo5W1QACK7eI';


// check for service worker

console.log('serviceWorker:'+('serviceWorker' in navigator));
if ('serviceWorker' in navigator) {
  send().catch(err => console.error(err));
}

// three things to be done in order this function register the service worker, register our push, send the push 
async function send() {
  // register service worker
  console.log('Registering Service Worker..')

  const register = await navigator.serviceWorker.register('worker.js', {
    scope: '/'
  });
  console.log('Service Worker Registered...');
  //Register Push
  console.log('Registering Push...');
  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
  });
  console.log('Push Registered');

  //Send notificaiton
  console.log('Sending Push subsbcription');
  await fetch('/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'content-type': 'application/json'
    }
  });
  console.log('Push subscription Sent ')
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}