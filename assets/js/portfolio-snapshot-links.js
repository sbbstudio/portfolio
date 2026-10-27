/* Shared by NYME and KAIZEN: keep snapshot anchors local, but open full-site
   routes on their live origin so navigation cannot replace the annotated frame. */
(function () {
  window.portfolioSnapshotLinks = function (doc, liveSite) {
    var snapshot = new URL(doc.URL);
    var live = new URL(liveSite);
    var rewrite = function () {
      doc.querySelectorAll('a[href]').forEach(function (link) {
        var url = new URL(link.getAttribute('href'), doc.baseURI);
        if (url.origin === snapshot.origin && !url.pathname.startsWith(snapshot.pathname)) {
          link.href = new URL(url.pathname + url.search + url.hash, live.origin).href;
          url = new URL(link.href);
        }
        if (url.origin === live.origin) {
          link.target = '_blank';
          link.rel = 'noopener';
        }
      });
    };
    rewrite();
    // Hydration and language switches may replace links after the iframe loads.
    new MutationObserver(rewrite).observe(doc.body, {
      childList: true, subtree: true, attributes: true, attributeFilter: ['href'],
    });
    doc.addEventListener('click', function (event) {
      var link = event.target.closest('a[href]');
      if (link && new URL(link.href).origin === live.origin) {
        // Let the browser follow the link, without the snapshot router intercepting it.
        event.stopImmediatePropagation();
      }
    }, true);
  };
})();
