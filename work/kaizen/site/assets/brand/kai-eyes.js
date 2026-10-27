/* Blikket — KAIZEN-merkets øyne som web-komponent.
   <kai-eyes></kai-eyes>                      våken, blunker sjeldent
   <kai-eyes state="leser"></kai-eyes>        Kai jobber
   <kai-eyes state="fokus"></kai-eyes>        venter på deg
   <kai-eyes state="bort"></kai-eyes>         peker på noe
   <kai-eyes state="hviler"></kai-eyes>       pause
   <kai-eyes state="vaakner"></kai-eyes>      lasting, punktene tennes ett og ett
   Attributter: fill (default currentColor), ratio (0.43 | 0.58), gap (1.4), blink (off | rare | sync)
   blink=rare: eget ur, hvert 5,2 s. blink=sync: samme veggklokke som 3D-Kai (9,6 s siden epoke), så merket og Kai blunker samtidig.
   Regel: rasteret er alltid 4×4. Ingen punkter fjernes. Kun lysstyrke endres. */
(function () {
  var STATES = {
    vaaken: null,
    leser:  ["0000", "0000", "1111", "1111"],
    fokus:  ["0000", "0110", "0110", "0000"],
    bort:   ["0011", "0011", "0011", "0011"],
    hviler: "dim",
    vaakner: "wake"
  };
  var CSS = "\n:host{display:inline-block;line-height:0;vertical-align:middle;height:.62em;color:inherit}\nsvg{height:100%;width:auto;display:block;overflow:visible}\n.dot{transition:opacity .32s ease,transform .32s ease;transform-box:fill-box;transform-origin:50% 50%}\n.row{transform-box:fill-box;transform-origin:50% 50%}\n@media (prefers-reduced-motion:no-preference){\n:host([blink=rare]) .row{animation:blink 5.2s cubic-bezier(.6,0,.2,1) infinite}\n:host([blink=rare]) .row:nth-child(2),:host([blink=rare]) .row:nth-child(6){animation-delay:.04s}\n:host([blink=rare]) .row:nth-child(3),:host([blink=rare]) .row:nth-child(7){animation-delay:.08s}\n:host([blink=rare]) .row:nth-child(4),:host([blink=rare]) .row:nth-child(8){animation-delay:.12s}\n:host([state=vaakner]) .dot{animation:wake 3.6s ease-out infinite}\n:host([state=hviler]) .dot{animation:pulse 2.4s ease-in-out infinite}\n}\n@keyframes blink{0%,78%,86%,100%{transform:scaleY(1);opacity:1}81%,83%{transform:scaleY(.12);opacity:.55}}\n@keyframes blinkOnce{0%,100%{transform:scaleY(1);opacity:1}50%{transform:scaleY(.12);opacity:.55}}\n@media (prefers-reduced-motion:no-preference){:host([blink=sync]) .row.is-blinking{animation:blinkOnce .16s ease-in-out 1}}\n@keyframes wake{0%{opacity:.08}40%,80%{opacity:1}100%{opacity:.08}}\n@keyframes pulse{0%,100%{opacity:.28}50%{opacity:.55}}\n";

  var KaiEyes = function () { return Reflect.construct(HTMLElement, [], KaiEyes); };
  KaiEyes.prototype = Object.create(HTMLElement.prototype);
  KaiEyes.prototype.constructor = KaiEyes;
  KaiEyes.observedAttributes = ["state", "fill", "ratio", "gap", "blink"];

  // Shared timing with blink-clock.mjs; the unit test guards these constants.
  var PERIOD = 9600, BLINK = 320;
  function wallNow() { return performance.timeOrigin + performance.now(); }
  function msToNext(now) { var t = now % PERIOD; return t === 0 ? 0 : PERIOD - t; }

  KaiEyes.prototype.connectedCallback = function () {
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    this.style.setProperty('--kai-sync-blink-duration', BLINK + 'ms');
    if (!this.hasAttribute("blink")) this.setAttribute("blink", "rare");
    this.render();
  };
  KaiEyes.prototype.attributeChangedCallback = function (name) {
    if (!this.shadowRoot) return;
    if (name === "state") this.applyState(); else if (name === "blink") this.schedule(); else this.render();
  };
  KaiEyes.prototype.disconnectedCallback = function () { clearTimeout(this._t); };
  KaiEyes.prototype.schedule = function () {
    clearTimeout(this._t);
    if (this.getAttribute("blink") !== "sync" || !this.isConnected) return;
    var self = this;
    this._t = setTimeout(function () {
      if(document.hidden || matchMedia('(prefers-reduced-motion: reduce)').matches || self.getAttribute('state')==='hviler'){self.schedule();return;}
      self.shadowRoot.querySelectorAll(".row").forEach(function (row) {
        row.style.animationDuration = BLINK + 'ms';
        row.classList.remove("is-blinking"); void row.getBoundingClientRect(); row.classList.add("is-blinking");
        setTimeout(function () { row.classList.remove("is-blinking"); }, BLINK + 40);
      });
      self.schedule();
    }, msToNext(wallNow()));
  };
  KaiEyes.prototype.render = function () {
    var PITCH = 10, ratio = parseFloat(this.getAttribute("ratio") || "0.43"), gapMul = parseFloat(this.getAttribute("gap") || "1.4");
    var fill = this.getAttribute("fill") || "currentColor";
    var d = PITCH * ratio, r = d / 2, w = 3 * PITCH + d, gap = w * gapMul;
    var s = '<svg viewBox="0 0 ' + (2 * w + gap) + " " + w + '" aria-hidden="true">';
    [0, w + gap].forEach(function (ox) {
      for (var row = 0; row < 4; row++) {
        s += '<g class="row">';
        for (var col = 0; col < 4; col++) {
          var i = row * 4 + col;
          s += '<circle class="dot" data-r="' + row + '" data-c="' + col + '" cx="' + (ox + r + col * PITCH) + '" cy="' + (r + row * PITCH) + '" r="' + r + '" fill="' + fill + '" style="animation-delay:' + (i * .07 + (ox ? .04 : 0)) + 's"/>';
        }
        s += "</g>";
      }
    });
    s += "</svg>";
    this.shadowRoot.innerHTML = "<style>" + CSS + "</style>" + s;
    this.applyState();
    this.schedule();
  };
  KaiEyes.prototype.applyState = function () {
    var st = STATES[this.getAttribute("state") || "vaaken"];
    this.shadowRoot.querySelectorAll(".dot").forEach(function (dot) {
      var row = +dot.getAttribute("data-r"), col = +dot.getAttribute("data-c"), o = 1;
      if (st === "dim") o = .3; else if (Array.isArray(st)) o = st[row][col] === "1" ? 1 : .18;
      dot.setAttribute("opacity", String(o));
    });
  };
  if (!customElements.get("kai-eyes")) customElements.define("kai-eyes", KaiEyes);
})();
