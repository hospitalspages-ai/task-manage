/* ============================================================
   Service Worker — نظام حياتي
   مسؤول فقط عن استقبال إشعارات الدفع (Push) وعرضها للمستخدم،
   حتى لو كان التطبيق مغلقاً تماماً أو الجوال في وضع القفل.
============================================================ */

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: "نظام حياتي", body: event.data ? event.data.text() : "" };
  }

  const title = data.title || "نظام حياتي";
  const options = {
    body: data.body || "",
    dir: "rtl",
    lang: "ar",
    tag: data.tag || undefined,
    renotify: !!data.tag,
    data: { url: data.url || "./" }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || "./";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if ("focus" in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
    })
  );
});
