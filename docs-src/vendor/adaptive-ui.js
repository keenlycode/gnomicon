var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// node_modules/.deno/@arrow-js+core@1.0.6/node_modules/@arrow-js/core/dist/chunks/internal-DchK7S7v.mjs
var queueMarker = Symbol();
var queueStack = [];
var nextTicks = [];
var cleanupCollector = null;
function nextTick(fn) {
  return !queueStack.length ? Promise.resolve(fn?.()) : new Promise((resolve) => nextTicks.push(() => {
    fn?.();
    resolve();
  }));
}
function isTpl(template) {
  return typeof template === "function" && !!template.isT;
}
function isO(obj) {
  return obj !== null && typeof obj === "object";
}
function isR(obj) {
  return isO(obj) && "$on" in obj;
}
function isChunk(chunk) {
  return isO(chunk) && "ref" in chunk;
}
function queue(fn) {
  const queued = fn;
  return (newValue, oldValue) => {
    if (!queued[queueMarker]) {
      queued[queueMarker] = true;
      queued._n = newValue;
      queued._o = oldValue;
      if (!queueStack.length) {
        queueMicrotask(executeQueue);
      }
      queueStack.push(queued);
    }
  };
}
function executeQueue() {
  const queue2 = queueStack;
  queueStack = [];
  const ticks = nextTicks;
  nextTicks = [];
  for (let i2 = 0; i2 < queue2.length; i2++) {
    const fn = queue2[i2];
    const newValue = fn._n;
    const oldValue = fn._o;
    fn._n = void 0;
    fn._o = void 0;
    fn[queueMarker] = false;
    fn(newValue, oldValue);
  }
  for (let i2 = 0; i2 < ticks.length; i2++)
    ticks[i2]();
  if (queueStack.length) {
    queueMicrotask(executeQueue);
  }
}
function swapCleanupCollector(collector) {
  const previous = cleanupCollector;
  cleanupCollector = collector;
  return previous;
}
function registerCleanup(fn) {
  cleanupCollector?.push(fn);
}
function onCleanup(fn) {
  const collector = cleanupCollector;
  if (!collector)
    throw Error("onCleanup needs component");
  let active = 1;
  const dispose = () => active-- && (collector.splice(collector.indexOf(dispose), 1), fn());
  return collector.push(dispose), dispose;
}
function setAttr(node, attrName, value) {
  if (attrName === ".innerhtml")
    attrName = ".innerHTML";
  const isIDL = attrName === "value" && "value" in node || attrName === "checked" || attrName[0] === "." && (attrName = attrName.slice(1));
  if (isIDL) {
    node[attrName] = value;
    if (node.getAttribute(attrName) != value)
      value = false;
  }
  value !== false ? node.setAttribute(attrName, value) : node.removeAttribute(attrName);
}
var expressionPool = [];
var expressionObservers = [];
var expressionObserverAttrs = [];
var freeExpressionPointers = [];
var cursor = 0;
function createExpressionBlock(len) {
  const bucket = freeExpressionPointers[len];
  const pointer = bucket?.length ? bucket.pop() : cursor;
  expressionPool[pointer] = len;
  if (pointer === cursor)
    cursor += len + 1;
  return pointer;
}
function writeExpressions(expSlots, pointer, offset = 0) {
  const len = expressionPool[pointer];
  for (let i2 = 1; i2 <= len; i2++) {
    const nextValue = expSlots[offset + i2 - 1];
    const target = pointer + i2;
    if (Object.is(expressionPool[target], nextValue))
      continue;
    expressionPool[target] = nextValue;
    const observer = expressionObservers[target];
    if (!observer)
      continue;
    const attr = expressionObserverAttrs[target];
    if (attr !== void 0)
      setAttr(observer, attr, nextValue);
    else if (typeof observer === "function")
      observer(nextValue);
    else
      observer.data = nextValue || nextValue === 0 ? nextValue : "";
  }
}
function onExpressionUpdate(pointer, observer, attrName) {
  expressionObservers[pointer] = observer;
  expressionObserverAttrs[pointer] = attrName;
}
function releaseExpressions(pointer) {
  const len = expressionPool[pointer];
  if (len === void 0)
    return;
  for (let i2 = 0; i2 <= len; i2++) {
    expressionPool[pointer + i2] = void 0;
    expressionObservers[pointer + i2] = void 0;
    expressionObserverAttrs[pointer + i2] = void 0;
  }
  (freeExpressionPointers[len] ??= []).push(pointer);
}
var ids = /* @__PURE__ */ new WeakMap();
var computedIds = [];
var listeners = [];
var getId = (target) => ids.get(target);
var index = -1;
var watchIndex = 0;
var trackKey = 0;
var trackedDependencies = [];
var watchedDependencies = [];
var dependencyPool = [];
var arrayMutationWrappers = [];
var arrayMutations = {
  push: 1,
  pop: 1,
  shift: 1,
  unshift: 1,
  splice: 1,
  sort: 1,
  copyWithin: 1,
  fill: 1,
  reverse: 1
};
var parents = [];
function reactive(data) {
  if (typeof data === "function") {
    const state = reactive({
      value: void 0
    });
    computedIds[getId(state)] = true;
    watch(data, (value) => state.value = value);
    return state;
  }
  if (isR(data))
    return data;
  if (!isO(data))
    throw Error("Expected object");
  const id = ++index;
  listeners[id] = {};
  const proxy = new Proxy(data, proxyHandler);
  ids.set(data, id).set(proxy, id);
  return proxy;
}
function trackArray(id, key, target, value) {
  if (typeof value === "function" && arrayMutations[key]) {
    let wrappers = arrayMutationWrappers[id];
    if (!wrappers)
      wrappers = arrayMutationWrappers[id] = {};
    let wrapper = wrappers[key];
    if (!wrapper) {
      wrapper = (...args) => {
        const result = Reflect.apply(value, target, args);
        emitParents(id);
        return result;
      };
      wrappers[key] = wrapper;
    }
    return wrapper;
  }
  if (isComputed(value))
    return readComputed(value, id, key);
  if (key !== "length" && typeof value !== "function") {
    track(id, key);
  }
  return value;
}
var proxyHandler = {
  has(target, key) {
    if (key in api)
      return true;
    track(getId(target), key);
    return key in target;
  },
  get(target, key, receiver) {
    const id = getId(target);
    if (key in api)
      return api[key];
    const result = Reflect.get(target, key, receiver);
    let child;
    if (isO(result) && !isR(result)) {
      child = createChild(result, id, key);
      target[key] = child;
    }
    const value = child ?? result;
    if (Array.isArray(target))
      return trackArray(id, key, target, value);
    if (isComputed(value))
      return readComputed(value, id, key);
    track(id, key);
    return value;
  },
  set(target, key, value, receiver) {
    const id = getId(target);
    const isNewProperty = !(key in target);
    const newReactive = isO(value) && !isR(value) ? createChild(value, id, key) : null;
    const oldValue = target[key];
    const newValue = newReactive ?? value;
    if (isR(newValue) && computedIds[getId(newValue)]) {
      linkParent(getId(newValue), id, key);
    }
    const didSucceed = Reflect.set(target, key, newValue, receiver);
    if (oldValue !== newValue && isR(oldValue) && isR(newValue)) {
      const oldParents = parents[getId(oldValue)];
      if (oldParents) {
        let index2 = -1;
        for (let i2 = 0; i2 < oldParents.length; i2++) {
          const [parent, property] = oldParents[i2];
          if (parent == id && property == key) {
            index2 = i2;
            break;
          }
        }
        if (index2 > -1)
          oldParents.splice(index2, 1);
      }
      linkParent(getId(newValue), id, key);
    }
    emit(id, key, value, oldValue, isNewProperty || key === "value" && computedIds[id]);
    if (Array.isArray(target) && key === "length") {
      emitParents(id);
    }
    return didSucceed;
  }
};
function createChild(child, parentId, key) {
  const r2 = reactive(child);
  linkParent(getId(child), parentId, key);
  return r2;
}
function isComputed(value) {
  return isR(value) && computedIds[getId(value)];
}
function readComputed(value, parentId, key) {
  const computedId = getId(value);
  track(parentId, key);
  linkParent(computedId, parentId, key);
  track(computedId, "value");
  return value.value;
}
function linkParent(childId, parentId, key) {
  const entries = parents[childId];
  if (entries) {
    for (let i2 = 0; i2 < entries.length; i2++) {
      const [parent, property] = entries[i2];
      if (parent === parentId && property === key)
        return;
    }
  } else {
    parents[childId] = [];
  }
  parents[childId].push([parentId, key]);
}
function emit(id, key, newValue, oldValue, notifyParents) {
  const targetListeners = listeners[id];
  const propertyListeners = targetListeners[key];
  if (propertyListeners) {
    if (Array.isArray(propertyListeners)) {
      for (let i2 = 0; i2 < propertyListeners.length; i2++) {
        propertyListeners[i2](newValue, oldValue);
      }
    } else {
      propertyListeners(newValue, oldValue);
    }
  }
  if (notifyParents) {
    emitParents(id);
  }
}
function emitParents(id) {
  const parentEntries = parents[id];
  if (!parentEntries)
    return;
  for (let i2 = 0; i2 < parentEntries.length; i2++) {
    const [parentId, property] = parentEntries[i2];
    emit(parentId, property);
  }
}
function reactiveOn(property, callback) {
  addListener(listeners[getId(this)], property, callback);
}
function reactiveOff(property, callback) {
  removeListener(listeners[getId(this)], property, callback);
}
var api = {
  $on: reactiveOn,
  $off: reactiveOff
};
function track(id, property) {
  if (!trackKey)
    return;
  trackedDependencies[trackKey].push(id, property);
}
function startTracking() {
  trackedDependencies[++trackKey] = dependencyPool.pop() ?? [];
}
function stopTracking(watchKey, callback) {
  const key = trackKey--;
  const deps = trackedDependencies[key];
  const previousDeps = watchedDependencies[watchKey];
  const previousLength = previousDeps?.length;
  if (previousLength && previousLength === deps.length) {
    let matched = true;
    for (let i2 = 0; i2 < previousLength; i2++) {
      if (previousDeps[i2] === deps[i2])
        continue;
      matched = false;
      break;
    }
    if (matched) {
      watchedDependencies[watchKey] = previousDeps;
      deps.length = 0;
      dependencyPool.push(deps);
      trackedDependencies[key] = void 0;
      return;
    }
  }
  flushListeners(previousDeps, callback);
  for (let i2 = 0; i2 < deps.length; i2 += 2) {
    addListener(listeners[deps[i2]], deps[i2 + 1], callback);
  }
  watchedDependencies[watchKey] = deps;
  trackedDependencies[key] = void 0;
}
function flushListeners(deps, callback) {
  if (!deps)
    return;
  for (let i2 = 0; i2 < deps.length; i2 += 2) {
    removeListener(listeners[deps[i2]], deps[i2 + 1], callback);
  }
  deps.length = 0;
  dependencyPool.push(deps);
}
function addListener(targetListeners, key, callback) {
  const slot = targetListeners[key];
  if (!slot) {
    targetListeners[key] = callback;
    return;
  }
  if (Array.isArray(slot)) {
    if (!slot.includes(callback))
      slot.push(callback);
    return;
  }
  if (slot !== callback)
    targetListeners[key] = [slot, callback];
}
function removeListener(targetListeners, key, callback) {
  const slot = targetListeners[key];
  if (!slot)
    return;
  if (Array.isArray(slot)) {
    const index2 = slot.indexOf(callback);
    if (index2 < 0)
      return;
    if (slot.length === 2) {
      targetListeners[key] = slot[index2 ? 0 : 1];
      return;
    }
    slot.splice(index2, 1);
    return;
  }
  if (slot === callback) {
    delete targetListeners[key];
  }
}
function watch(effect, afterEffect) {
  const watchKey = ++watchIndex;
  const isPointer = typeof effect === "number";
  let rerun = queue(runEffect);
  function runEffect() {
    startTracking();
    const effectValue = isPointer ? expressionPool[effect]() : effect();
    stopTracking(watchKey, rerun);
    return afterEffect ? afterEffect(effectValue) : effectValue;
  }
  const stop = () => {
    flushListeners(watchedDependencies[watchKey], rerun);
    watchedDependencies[watchKey] = void 0;
    if (isPointer)
      onExpressionUpdate(effect);
    rerun = null;
  };
  if (!isPointer)
    registerCleanup(stop);
  if (isPointer)
    onExpressionUpdate(effect, runEffect);
  return [runEffect(), stop];
}
var AsyncFunction = (async () => {
}).constructor;
var asyncComponentInstaller = null;
function setComponentKey(key) {
  this.k = key;
  return this;
}
var propsProxyHandler = {
  get(target, key) {
    return target[0]?.[key];
  },
  has(target, key) {
    return key in (target[0] || {});
  },
  ownKeys(target) {
    return Reflect.ownKeys(target[0] || {});
  },
  getOwnPropertyDescriptor(target, key) {
    const source = target[0];
    return source && {
      configurable: true,
      enumerable: true,
      writable: true,
      value: source[key]
    };
  },
  set(target, key, value) {
    return !!target[0] && Reflect.set(target[0], key, value);
  }
};
function component(factory, options) {
  if (options || factory.constructor === AsyncFunction) {
    if (!asyncComponentInstaller) {
      throw Error("Async runtime missing.");
    }
    return asyncComponentInstaller(factory, options);
  }
  return ((input, events) => ({
    h: factory,
    k: void 0,
    p: input,
    e: events,
    key: setComponentKey
  }));
}
function isCmp(value) {
  return !!value && typeof value === "object" && "h" in value;
}
function createPropsProxy(source, factory, events) {
  const box = reactive({ 0: source, 1: factory, 2: events });
  const emit2 = ((event, payload) => {
    const handler = box[2]?.[event];
    if (typeof handler === "function")
      handler(payload);
  });
  return [
    new Proxy(box, propsProxyHandler),
    emit2,
    box
  ];
}
var hydrationCaptureProvider = null;
function getHydrationCapture() {
  return hydrationCaptureProvider?.() ?? null;
}
function registerHydrationHook(chunk, hook) {
  const capture = getHydrationCapture();
  if (!capture)
    return;
  const hooks = capture.hooks.get(chunk);
  if (hooks) {
    hooks.push(hook);
  } else {
    capture.hooks.set(chunk, [hook]);
  }
}
function adoptCapturedChunk(capture, chunk, map, visited = /* @__PURE__ */ new WeakSet()) {
  if (visited.has(chunk))
    return;
  visited.add(chunk);
  const ref = chunk.ref;
  if (ref.f)
    ref.f = map.get(ref.f) ?? ref.f;
  if (ref.l)
    ref.l = map.get(ref.l) ?? ref.l;
  capture.hooks.get(chunk)?.forEach((hook) => hook(map, visited));
}

// node_modules/.deno/@arrow-js+core@1.0.6/node_modules/@arrow-js/core/dist/index.mjs
var eventBindingsKey = Symbol();
var bindingStackPos = -1;
var bindingStack = [];
var nodeStack = [];
var delimiter = "\xA4";
var delimiterComment = `<!--${delimiter}-->`;
var initialChunkPoolSize = 1024;
var chunkMemo = /* @__PURE__ */ new WeakMap();
var chunkMemoByRef = /* @__PURE__ */ new WeakMap();
var staleById = /* @__PURE__ */ new Map();
var staleBySignature = /* @__PURE__ */ new Map();
var chunkPoolHead;
var renderedMark = 0;
growChunkPool(initialChunkPoolSize);
function moveDOMRef(ref, parent, before) {
  let node = ref.f;
  if (!parent || !node)
    return;
  const last = ref.l;
  while (true) {
    const next = node === last ? null : node.nextSibling;
    parent.insertBefore(node, before || null);
    if (!next)
      return;
    node = next;
  }
}
function canSyncTemplateChunk(template, chunk) {
  return chunk.g === getChunkProto(template).g;
}
function getChunkProto(template) {
  const cached = template._p;
  if (cached)
    return cached;
  return template._p = resolveChunkProto(template._s);
}
function resolveChunkProto(rawStrings, svg) {
  const doc = document;
  let memoByRef = svg ? void 0 : chunkMemoByRef.get(rawStrings);
  const cachedByRef = memoByRef?.get(doc);
  if (cachedByRef)
    return cachedByRef;
  const signature = rawStrings.join(delimiterComment);
  const cacheKey = svg ? `${delimiter}${signature}` : signature;
  let signatureMemo = chunkMemo.get(doc);
  if (!signatureMemo) {
    signatureMemo = {};
    chunkMemo.set(doc, signatureMemo);
  }
  const cached = signatureMemo[cacheKey];
  if (cached) {
    if (!svg) {
      memoByRef ??= /* @__PURE__ */ new WeakMap();
      memoByRef.set(doc, cached);
      chunkMemoByRef.set(rawStrings, memoByRef);
    }
    return cached;
  }
  const template = document.createElement("template");
  if (svg) {
    template.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg">${signature}</svg>`;
    const root = template.content.firstChild;
    if (root) {
      const content = template.content;
      while (root.firstChild)
        content.appendChild(root.firstChild);
      content.removeChild(root);
    }
  } else {
    template.innerHTML = signature;
  }
  const paths = createPaths(template.content);
  normalizeNodePlaceholders(template.content);
  const expressions = rawStrings.length - 1;
  let count = 0;
  for (let i2 = 0; i2 < paths[0].length; ) {
    i2 += (paths[0][i2 + 1] ?? 0) + 3;
    count++;
  }
  if (count !== expressions) {
    throw Error("Invalid HTML position");
  }
  const created = {
    template,
    paths,
    g: cacheKey,
    expressions
  };
  if (!svg) {
    memoByRef ??= /* @__PURE__ */ new WeakMap();
    memoByRef.set(doc, created);
    chunkMemoByRef.set(rawStrings, memoByRef);
  }
  signatureMemo[cacheKey] = created;
  return created;
}
function syncTemplateToChunk(template, chunk, mounted = false) {
  if (chunk._t === template) {
    chunk.k = template._k;
    chunk.i = template._i;
    template._h = chunk;
    template._m = mounted;
    return;
  }
  if (chunk._t && chunk._t !== template) {
    const current = chunk._t;
    if (current._h === chunk) {
      current._m = false;
      current._h = void 0;
    }
  }
  chunk._t = template;
  chunk.k = template._k;
  chunk.i = template._i;
  template._h = chunk;
  template._m = mounted;
  writeExpressions(template._a, chunk.e);
}
function releaseTemplate(chunk) {
  const template = chunk._t;
  if (template._h === chunk) {
    template._m = false;
    template._h = void 0;
  }
}
function growChunkPool(size) {
  let head;
  let tail;
  for (let i2 = 0; i2 < size; i2++) {
    const chunk = {
      paths: [[], []],
      dom: null,
      ref: { f: null, l: null },
      _t: null,
      e: -1,
      g: "",
      b: false,
      r: true,
      st: false,
      u: null,
      v: null,
      s: void 0,
      k: void 0,
      i: void 0,
      bkn: void 0,
      next: void 0
    };
    if (tail)
      tail.next = chunk;
    else
      head = chunk;
    tail = chunk;
  }
  if (tail)
    tail.next = chunkPoolHead;
  chunkPoolHead = head;
}
function freeChunk(chunk) {
  chunk.next = chunkPoolHead;
  chunkPoolHead = chunk;
}
function configureChunk(chunk, proto, template) {
  chunk.paths = proto.paths;
  chunk.g = proto.g;
  chunk.dom = proto.template.content.cloneNode(true);
  chunk.ref.f = chunk.dom.firstChild;
  chunk.ref.l = chunk.dom.lastChild;
  chunk.e = createExpressionBlock(proto.expressions);
  chunk.b = chunk.st = false;
  chunk.r = true;
  chunk.u = chunk.v = null;
  chunk.s = chunk.bkn = void 0;
  syncTemplateToChunk(template, chunk);
}
function acquireChunk(template) {
  const proto = getChunkProto(template);
  const exact = staleById.get(template._i);
  if (exact) {
    if (exact.g !== proto.g)
      throw Error("shape mismatch");
    if (exact.r) {
      removeStaleChunk(exact);
      syncTemplateToChunk(template, exact);
      return exact;
    }
  }
  const bucket = staleBySignature.get(proto.g);
  const reused = bucket?.h;
  if (reused) {
    removeStaleChunk(reused);
    syncTemplateToChunk(template, reused);
    return reused;
  }
  if (!chunkPoolHead)
    growChunkPool(initialChunkPoolSize);
  const chunk = chunkPoolHead;
  chunkPoolHead = chunk.next;
  chunk.next = void 0;
  configureChunk(chunk, proto, template);
  return chunk;
}
function removeStaleChunk(chunk) {
  if (!chunk.st)
    return;
  const bucket = staleBySignature.get(chunk.g);
  if (bucket) {
    let previous;
    let current = bucket.h;
    while (current && current !== chunk) {
      previous = current;
      current = current.bkn;
    }
    if (current) {
      if (previous)
        previous.bkn = current.bkn;
      else
        bucket.h = current.bkn;
      if (!bucket.h)
        staleBySignature.delete(chunk.g);
    }
  }
  if (chunk.i !== void 0 && staleById.get(chunk.i) === chunk) {
    staleById.delete(chunk.i);
  }
  chunk.st = false;
  chunk.bkn = void 0;
}
function dispatchChunkEvent(evt) {
  const binding = this[eventBindingsKey]?.[evt.type];
  if (!binding)
    return;
  const chunk = binding.c;
  if (!chunk._t._m)
    return;
  expressionPool[binding.p]?.(evt);
}
function getRenderableKey(renderable) {
  return isCmp(renderable) ? renderable.k : renderable._k;
}
function html(strings, ...expSlots) {
  const template = ((el) => renderTemplate(template, el));
  template.isT = true;
  template._a = expSlots;
  template._c = ensureChunk;
  template._m = false;
  template._s = strings;
  template.key = setTemplateKey;
  template.id = setTemplateId;
  return template;
}
function ensureChunk() {
  let chunk = this._h;
  if (!chunk) {
    chunk = acquireChunk(this);
    this._h = chunk;
  }
  return chunk;
}
function setTemplateKey(key) {
  this._k = key;
  if (this._h)
    this._h.k = key;
  return this;
}
function setTemplateId(id) {
  this._i = id;
  if (this._h)
    this._h.i = id;
  return this;
}
function renderTemplate(template, el) {
  const chunk = template._c();
  if (!template._m) {
    template._m = true;
    if (!chunk.b) {
      return createBindings(chunk, el);
    }
    moveDOMRef(chunk.ref, el ?? chunk.dom);
    return el ?? chunk.dom;
  }
  moveDOMRef(chunk.ref, chunk.dom);
  return el ? el.appendChild(chunk.dom) : chunk.dom;
}
function createBindings(chunk, el) {
  const expressionPointer = chunk.e;
  const totalPaths = expressionPool[expressionPointer];
  const [pathTape, attrNames] = chunk.paths;
  const stackStart = bindingStackPos + 1;
  let tapePos = 0;
  nodeStack[0] = chunk.dom;
  for (let i2 = 0; i2 < totalPaths; i2++) {
    const sharedDepth = pathTape[tapePos++];
    let remaining = pathTape[tapePos++];
    let depth = sharedDepth;
    let node = nodeStack[depth];
    while (remaining--) {
      node = node.childNodes[pathTape[tapePos++]];
      nodeStack[++depth] = node;
    }
    bindingStack[++bindingStackPos] = node;
    bindingStack[++bindingStackPos] = pathTape[tapePos++];
  }
  const stackEnd = bindingStackPos;
  for (let s2 = stackStart, e2 = expressionPointer + 1; s2 < stackEnd; s2++, e2++) {
    const node = bindingStack[s2];
    const segment = bindingStack[++s2];
    if (segment)
      createAttrBinding(node, attrNames[segment - 1], e2, chunk);
    else
      createNodeBinding(node, e2, chunk);
  }
  bindingStack.length = stackStart;
  bindingStackPos = stackStart - 1;
  chunk.b = true;
  return el ? el.appendChild(chunk.dom) && el : chunk.dom;
}
function createNodeBinding(node, expressionPointer, parentChunk) {
  let fragment;
  const expression = expressionPool[expressionPointer];
  const capture = getHydrationCapture();
  const textNode = node.nodeType === 3 ? node : null;
  if (isCmp(expression) || isTpl(expression) || Array.isArray(expression)) {
    parentChunk.r = false;
    const render = createRenderFn(capture);
    fragment = render(expression);
    if (capture) {
      registerHydrationHook(parentChunk, (map, visited) => {
        render.adopt(map, visited);
      });
    }
  } else if (typeof expression === "function") {
    let target = textNode;
    let render = null;
    const [frag, stop] = watch(expressionPointer, (value) => {
      if (!render) {
        if (isCmp(value) || isTpl(value) || Array.isArray(value)) {
          parentChunk.r = false;
          render = createRenderFn(capture);
          const next2 = render(value);
          if (target) {
            target.parentNode?.replaceChild(next2, target);
            target = null;
          }
          return next2;
        }
        if (!target)
          target = document.createTextNode("");
        const next = renderText(value);
        if (target.nodeValue !== next)
          target.nodeValue = next;
        return target;
      }
      return render(value);
    });
    (parentChunk.u ??= []).push(stop);
    fragment = frag;
    if (capture) {
      registerHydrationHook(parentChunk, (map, visited) => {
        if (target) {
          const adopted = map.get(target);
          if (adopted)
            target = adopted;
        }
        render?.adopt(map, visited);
      });
    }
  } else {
    let target = textNode ?? document.createTextNode("");
    target.data = renderText(expression);
    fragment = target;
    if (capture) {
      onExpressionUpdate(expressionPointer, (value) => target.data = renderText(value));
      registerHydrationHook(parentChunk, (map) => {
        const adopted = map.get(target);
        if (adopted)
          target = adopted;
      });
    } else {
      onExpressionUpdate(expressionPointer, target);
    }
  }
  if (node === parentChunk.ref.f || node === parentChunk.ref.l) {
    const last = fragment.nodeType === 11 ? fragment.lastChild : fragment;
    if (node === parentChunk.ref.f) {
      parentChunk.ref.f = fragment.nodeType === 11 ? fragment.firstChild : fragment;
    }
    if (node === parentChunk.ref.l)
      parentChunk.ref.l = last;
  }
  if (fragment !== node)
    node.parentNode?.replaceChild(fragment, node);
}
function createAttrBinding(node, attrName, expressionPointer, parentChunk) {
  if (node.nodeType !== 1)
    return;
  let target = node;
  const expression = expressionPool[expressionPointer];
  const capture = getHydrationCapture();
  if (attrName[0] === "@") {
    const event = attrName.slice(1);
    const bindings = target[eventBindingsKey] ??= {};
    bindings[event] = { c: parentChunk, p: expressionPointer };
    const record = [target, event];
    target.addEventListener(event, dispatchChunkEvent);
    target.removeAttribute(attrName);
    (parentChunk.v ??= []).push(record);
    if (capture) {
      registerHydrationHook(parentChunk, (map) => {
        const adopted = map.get(target);
        if (!adopted)
          return;
        const previousTarget = target;
        const previousBindings = previousTarget[eventBindingsKey];
        if (previousBindings) {
          delete previousBindings[event];
          let hasBindings = false;
          for (const key in previousBindings) {
            hasBindings = true;
            break;
          }
          if (!hasBindings)
            delete previousTarget[eventBindingsKey];
        }
        target.removeEventListener(event, dispatchChunkEvent);
        target = adopted;
        record[0] = target;
        const nextBindings = target[eventBindingsKey] ??= {};
        nextBindings[event] = { c: parentChunk, p: expressionPointer };
        target.addEventListener(event, dispatchChunkEvent);
        target.removeAttribute(attrName);
      });
    }
  } else if (typeof expression === "function" && !isTpl(expression)) {
    const [, stop] = watch(expressionPointer, (value) => setAttr(target, attrName, value));
    (parentChunk.u ??= []).push(stop);
    if (capture) {
      registerHydrationHook(parentChunk, (map) => {
        const adopted = map.get(target);
        if (adopted)
          target = adopted;
      });
    }
  } else {
    setAttr(target, attrName, expression);
    if (capture) {
      onExpressionUpdate(expressionPointer, (value) => setAttr(target, attrName, value));
    } else {
      onExpressionUpdate(expressionPointer, target, attrName);
    }
  }
}
function createRenderFn(capture) {
  let previous;
  let keyedChunks = /* @__PURE__ */ Object.create(null);
  const render = function render2(renderable) {
    if (!previous) {
      if (isCmp(renderable)) {
        const [fragment, chunk] = renderComponent(renderable);
        previous = mountChunkFragment(fragment, chunk);
        return fragment;
      }
      if (isTpl(renderable)) {
        const fragment = renderable();
        previous = mountChunkFragment(fragment, renderable._h);
        return fragment;
      }
      if (Array.isArray(renderable)) {
        const [fragment, rendered] = renderList(renderable);
        previous = rendered;
        return fragment;
      }
      return previous = document.createTextNode(renderText(renderable));
    }
    if (Array.isArray(renderable)) {
      if (!Array.isArray(previous)) {
        const [fragment, nextList] = renderList(renderable);
        getNode(previous).after(fragment);
        forgetChunk(previous);
        unmount(previous);
        previous = nextList;
      } else {
        let i2 = 0;
        const renderableLength = renderable.length;
        const previousLength = previous.length;
        if (renderableLength && previousLength === 1 && !isChunk(previous[0]) && !previous[0].data) {
          const [fragment, rendered] = renderList(renderable);
          previous[0].replaceWith(fragment);
          previous = rendered;
          return;
        }
        if (renderableLength === previousLength) {
          const renderedList2 = new Array(renderableLength);
          for (; i2 < renderableLength; i2++) {
            const item = renderable[i2];
            if (isCmp(item) && item.k !== void 0 || isTpl(item) && item._k !== void 0) {
              i2 = -1;
              break;
            }
            const prev = previous[i2];
            if (isTpl(item) && isChunk(prev) && prev._t === item && item._h === prev && item._m) {
              renderedList2[i2] = prev;
              continue;
            }
            if (isTpl(item) && isChunk(prev)) {
              const template = item;
              const proto = template._p ?? getChunkProto(template);
              if (prev.g === proto.g) {
                syncTemplateToChunk(template, prev, true);
                renderedList2[i2] = prev;
                continue;
              }
            }
            renderedList2[i2] = patch(item, prev);
          }
          if (i2 === renderableLength) {
            previous = renderedList2;
            return;
          }
          i2 = 0;
        }
        const keyedList = patchKeyedList(renderable, previous);
        if (keyedList) {
          previous = keyedList;
          return;
        }
        if (renderableLength > previousLength && previousLength) {
          for (; i2 < previousLength; i2++) {
            const item = renderable[i2];
            const prev = previous[i2];
            if (isTpl(item) && isChunk(prev) && prev._t === item && item._h === prev && item._m) {
              continue;
            }
            i2 = -1;
            break;
          }
          if (i2 === previousLength) {
            const fragment = document.createDocumentFragment();
            const renderedList2 = previous.slice();
            for (i2 = previousLength; i2 < renderableLength; i2++) {
              renderedList2[i2] = mountItem(renderable[i2], fragment);
            }
            getNode(previous[previousLength - 1]).after(fragment);
            previous = renderedList2;
            return;
          }
          i2 = 0;
        }
        let anchor;
        const renderedList = [];
        const mark = ++renderedMark;
        const updaterFrag = renderableLength > previousLength ? document.createDocumentFragment() : null;
        for (; i2 < renderableLength; i2++) {
          let item = renderable[i2];
          const prev = previous[i2];
          let key;
          if (isTpl(item) && (key = item._k) !== void 0 && key in keyedChunks) {
            const keyedChunk = keyedChunks[key];
            if (canSyncTemplateChunk(item, keyedChunk)) {
              syncTemplateToChunk(item, keyedChunk, true);
              item = keyedChunk._t;
            }
          }
          if (i2 > previousLength - 1) {
            renderedList[i2] = mountItem(item, updaterFrag);
            continue;
          }
          if (isTpl(item) && isChunk(prev) && prev._t === item && item._h === prev && item._m) {
            anchor = getNode(prev);
            renderedList[i2] = prev;
            prev.mk = mark;
            continue;
          }
          const used = patch(item, prev, anchor);
          anchor = getNode(used);
          renderedList[i2] = used;
          used.mk = mark;
        }
        if (!renderableLength) {
          const placeholder = renderedList[0] = document.createTextNode("");
          const sync = canSyncUnmount(previous);
          const detached = sync && replaceListWithPlaceholder(previous, placeholder);
          if (!detached)
            getNode(previous).after(placeholder);
          keyedChunks = /* @__PURE__ */ Object.create(null);
          if (sync)
            removeUnmounted(previous, detached);
          else
            unmount(previous);
          previous = renderedList;
          return;
        } else if (renderableLength > previousLength) {
          anchor?.after(updaterFrag);
        }
        for (i2 = 0; i2 < previousLength; i2++) {
          const stale = previous[i2];
          if (stale.mk === mark)
            continue;
          forgetChunk(stale);
          unmount(stale);
        }
        previous = renderedList;
      }
    } else {
      if (Array.isArray(previous))
        keyedChunks = /* @__PURE__ */ Object.create(null);
      previous = patch(renderable, previous);
    }
  };
  render.adopt = capture ? (map, visited) => {
    previous = adoptRenderedValue(previous, capture, map, visited);
  } : () => {
  };
  function renderList(renderable) {
    const fragment = document.createDocumentFragment();
    if (!renderable.length) {
      const placeholder = document.createTextNode("");
      fragment.appendChild(placeholder);
      return [fragment, [placeholder]];
    }
    const renderedItems = new Array(renderable.length);
    for (let i2 = 0; i2 < renderable.length; i2++) {
      renderedItems[i2] = mountItem(renderable[i2], fragment);
    }
    return [fragment, renderedItems];
  }
  function syncComponentChunk(renderable, chunk) {
    if (chunk.s?.[1] !== renderable.h)
      return false;
    if (chunk.s[0] !== renderable.p)
      chunk.s[0] = renderable.p;
    if (chunk.s[2] !== renderable.e)
      chunk.s[2] = renderable.e;
    return true;
  }
  function syncKeyedRenderable(renderable, chunk) {
    if (isCmp(renderable))
      return syncComponentChunk(renderable, chunk);
    if (!canSyncTemplateChunk(renderable, chunk))
      return false;
    syncTemplateToChunk(renderable, chunk, true);
    return true;
  }
  function moveChunkIntoPlace(chunk, prev, anchor) {
    if (anchor) {
      moveDOMRef(chunk.ref, anchor.parentNode, anchor.nextSibling);
      return;
    }
    const target = getNode(prev, void 0, true);
    moveDOMRef(chunk.ref, target.parentNode, target);
  }
  function patchKeyedList(renderable, previousList) {
    const renderableLength = renderable.length;
    const previousLength = previousList.length;
    if (!renderableLength) {
      const placeholder = document.createTextNode("");
      const sync = canSyncUnmount(previousList);
      const detached = sync && replaceListWithPlaceholder(previousList, placeholder);
      if (!detached)
        getNode(previousList).after(placeholder);
      keyedChunks = /* @__PURE__ */ Object.create(null);
      if (sync)
        removeUnmounted(previousList, detached);
      else
        unmount(previousList);
      return [placeholder];
    }
    const renderedList = new Array(renderableLength);
    const parent = getNode(previousList[0]).parentNode;
    if (!parent)
      return null;
    let sharedPrefix = 0;
    const sharedPrefixKeys = /* @__PURE__ */ Object.create(null);
    for (; sharedPrefix < previousLength && sharedPrefix < renderableLength; sharedPrefix++) {
      const rendered = previousList[sharedPrefix];
      if (!isChunk(rendered) || rendered.k === void 0)
        return null;
      const item = renderable[sharedPrefix];
      if (!isCmp(item) && !isTpl(item))
        return null;
      const key = getRenderableKey(item);
      if (key === void 0 || key !== rendered.k)
        break;
      sharedPrefixKeys[key] = 1;
      if (!(isTpl(item) && rendered._t === item && item._h === rendered && item._m) && !syncKeyedRenderable(item, rendered)) {
        return null;
      }
      renderedList[sharedPrefix] = rendered;
    }
    if (sharedPrefix === previousLength) {
      if (sharedPrefix === renderableLength)
        return renderedList;
      const fragment = document.createDocumentFragment();
      for (let i2 = sharedPrefix; i2 < renderableLength; i2++) {
        const item = renderable[i2];
        if (!isCmp(item) && !isTpl(item))
          return null;
        const key = getRenderableKey(item);
        if (key === void 0 || key in sharedPrefixKeys)
          return null;
        sharedPrefixKeys[key] = 1;
        renderedList[i2] = mountItem(item, fragment);
      }
      parent.insertBefore(fragment, previousLength ? getNode(previousList[previousLength - 1]).nextSibling : null);
      return renderedList;
    }
    if (sharedPrefix === renderableLength) {
      for (let i2 = sharedPrefix; i2 < previousLength; i2++) {
        const stale = previousList[i2];
        forgetChunk(stale);
        unmount(stale);
      }
      return renderedList;
    }
    let oldStart = sharedPrefix;
    let newStart = sharedPrefix;
    let oldEnd = previousLength - 1;
    let newEnd = renderableLength - 1;
    while (oldStart <= oldEnd && newStart <= newEnd) {
      const startChunk = previousList[oldStart];
      const endChunk = previousList[oldEnd];
      const startKey = startChunk.k;
      const endKey = endChunk.k;
      const nextStart = renderable[newStart];
      const nextEnd = renderable[newEnd];
      const nextStartKey = isCmp(nextStart) || isTpl(nextStart) ? getRenderableKey(nextStart) : void 0;
      const nextEndKey = isCmp(nextEnd) || isTpl(nextEnd) ? getRenderableKey(nextEnd) : void 0;
      if (nextStartKey === void 0 || nextEndKey === void 0)
        return null;
      if (startKey === nextStartKey) {
        if (!(isTpl(nextStart) && startChunk._t === nextStart && nextStart._h === startChunk && nextStart._m) && !syncKeyedRenderable(nextStart, startChunk)) {
          return null;
        }
        renderedList[newStart++] = startChunk;
        oldStart++;
        continue;
      }
      if (endKey === nextEndKey) {
        if (!(isTpl(nextEnd) && endChunk._t === nextEnd && nextEnd._h === endChunk && nextEnd._m) && !syncKeyedRenderable(nextEnd, endChunk)) {
          return null;
        }
        renderedList[newEnd--] = endChunk;
        oldEnd--;
        continue;
      }
      if (startKey === nextEndKey) {
        if (!(isTpl(nextEnd) && startChunk._t === nextEnd && nextEnd._h === startChunk && nextEnd._m) && !syncKeyedRenderable(nextEnd, startChunk)) {
          return null;
        }
        moveDOMRef(startChunk.ref, parent, getNode(endChunk).nextSibling);
        renderedList[newEnd--] = startChunk;
        oldStart++;
        continue;
      }
      if (endKey === nextStartKey) {
        if (!(isTpl(nextStart) && endChunk._t === nextStart && nextStart._h === endChunk && nextStart._m) && !syncKeyedRenderable(nextStart, endChunk)) {
          return null;
        }
        moveDOMRef(endChunk.ref, parent, getNode(startChunk, void 0, true));
        renderedList[newStart++] = endChunk;
        oldEnd--;
        continue;
      }
      break;
    }
    if (newStart > newEnd) {
      for (let i2 = oldStart; i2 <= oldEnd; i2++) {
        const stale = previousList[i2];
        forgetChunk(stale);
        unmount(stale);
      }
      return renderedList;
    }
    if (oldStart > oldEnd) {
      const fragment = document.createDocumentFragment();
      for (let i2 = newStart; i2 <= newEnd; i2++) {
        const item = renderable[i2];
        if (!isCmp(item) && !isTpl(item))
          return null;
        renderedList[i2] = mountItem(item, fragment);
      }
      parent.insertBefore(fragment, newEnd + 1 < renderableLength ? getNode(renderedList[newEnd + 1], void 0, true) : null);
      return renderedList;
    }
    const previousIndexByKey = /* @__PURE__ */ Object.create(null);
    for (let i2 = oldStart; i2 <= oldEnd; i2++) {
      const rendered = previousList[i2];
      if (!isChunk(rendered) || rendered.k === void 0)
        return null;
      const key = rendered.k;
      if (key in previousIndexByKey)
        return null;
      previousIndexByKey[key] = i2 + 1;
    }
    const middleIndexByKey = /* @__PURE__ */ Object.create(null);
    let overlaps = 0;
    for (let i2 = newStart; i2 <= newEnd; i2++) {
      const item = renderable[i2];
      const key = isCmp(item) || isTpl(item) ? getRenderableKey(item) : void 0;
      if (key === void 0 || key in middleIndexByKey)
        return null;
      middleIndexByKey[key] = i2 + 1;
      if (key in previousIndexByKey)
        overlaps++;
    }
    if (!overlaps) {
      const first = getNode(previousList[oldStart], void 0, true);
      const last = getNode(previousList[oldEnd]);
      const fragment = document.createDocumentFragment();
      for (let i2 = newStart; i2 <= newEnd; i2++) {
        const item = renderable[i2];
        if (!isCmp(item) && !isTpl(item))
          return null;
        renderedList[i2] = mountItem(item, fragment);
      }
      const parent2 = first.parentNode;
      if (parent2 && first === parent2.firstChild && last === parent2.lastChild) {
        parent2.replaceChildren(fragment);
      } else {
        const range = document.createRange();
        range.setStartBefore(first);
        range.setEndAfter(last);
        range.deleteContents();
        range.insertNode(fragment);
      }
      for (let i2 = oldStart; i2 <= oldEnd; i2++) {
        const stale = previousList[i2];
        forgetChunk(stale);
        destroyChunk(stale, true);
      }
      return renderedList;
    }
    for (let i2 = oldStart; i2 <= oldEnd; i2++) {
      const stale = previousList[i2];
      const nextIndex = middleIndexByKey[stale.k];
      if (nextIndex === void 0) {
        forgetChunk(stale);
        unmount(stale);
        continue;
      }
      const item = renderable[nextIndex - 1];
      if (!syncKeyedRenderable(item, stale))
        return null;
      renderedList[nextIndex - 1] = stale;
    }
    let before = newEnd + 1 < renderableLength ? getNode(renderedList[newEnd + 1], void 0, true) : getNode(previousList[previousLength - 1]).nextSibling;
    for (let i2 = newEnd; i2 >= newStart; i2--) {
      const existing = renderedList[i2];
      if (!existing) {
        const item = renderable[i2];
        if (!isCmp(item) && !isTpl(item))
          return null;
        const fragment = document.createDocumentFragment();
        const mounted = mountItem(item, fragment);
        renderedList[i2] = mounted;
        parent.insertBefore(fragment, before);
        before = getNode(mounted, void 0, true);
        continue;
      }
      const start = getNode(existing, void 0, true);
      if (start.parentNode !== parent || start.nextSibling !== before) {
        moveDOMRef(existing.ref, parent, before);
      }
      before = start;
    }
    return renderedList;
  }
  function patch(renderable, prev, anchor) {
    const nodeType = prev.nodeType ?? 0;
    if (isCmp(renderable)) {
      const key = renderable.k;
      if (key !== void 0 && key in keyedChunks) {
        const keyedChunk = keyedChunks[key];
        if (syncComponentChunk(renderable, keyedChunk)) {
          if (keyedChunk === prev)
            return prev;
          moveChunkIntoPlace(keyedChunk, prev, anchor);
          return keyedChunk;
        }
      } else if (isChunk(prev) && syncComponentChunk(renderable, prev)) {
        if (prev.k !== renderable.k) {
          forgetChunk(prev);
          prev.k = renderable.k;
          rememberKeyedChunk(prev);
        }
        return prev;
      }
      const [fragment, chunk] = renderComponent(renderable);
      const mounted = mountChunkFragment(fragment, chunk);
      getNode(prev, anchor).after(fragment);
      forgetChunk(prev);
      unmount(prev);
      rememberKeyedChunk(chunk);
      return mounted;
    }
    if (!isTpl(renderable) && nodeType === 3) {
      const value = renderText(renderable);
      if (prev.data !== value)
        prev.data = value;
      return prev;
    }
    if (isTpl(renderable)) {
      const template = renderable;
      const key = template._k;
      if (key !== void 0 && key in keyedChunks) {
        const keyedChunk = keyedChunks[key];
        if (canSyncTemplateChunk(template, keyedChunk)) {
          syncTemplateToChunk(template, keyedChunk, true);
          if (keyedChunk === prev)
            return prev;
          moveChunkIntoPlace(keyedChunk, prev, anchor);
          return keyedChunk;
        }
      }
      const proto = getChunkProto(template);
      if (isChunk(prev) && prev.g === proto.g) {
        syncTemplateToChunk(template, prev, true);
        return prev;
      }
      const fragment = renderable();
      const chunk = template._h;
      const mounted = mountChunkFragment(fragment, chunk);
      getNode(prev, anchor).after(fragment);
      forgetChunk(prev);
      unmount(prev);
      rememberKeyedChunk(chunk);
      return mounted;
    }
    const text = document.createTextNode(renderText(renderable));
    getNode(prev, anchor).after(text);
    forgetChunk(prev);
    unmount(prev);
    return text;
  }
  function mountItem(item, fragment) {
    if (isCmp(item)) {
      const [inner, chunk] = renderComponent(item);
      fragment.appendChild(inner);
      rememberKeyedChunk(chunk);
      return mountChunkFragment(fragment, chunk);
    }
    if (isTpl(item)) {
      item(fragment);
      const chunk = item._h;
      rememberKeyedChunk(chunk);
      return mountChunkFragment(fragment, chunk);
    }
    const node = document.createTextNode(renderText(item));
    fragment.appendChild(node);
    return node;
  }
  function mountChunkFragment(fragment, chunk) {
    if (chunk.ref.f)
      return chunk;
    const placeholder = document.createTextNode("");
    fragment.appendChild(placeholder);
    return placeholder;
  }
  function rememberKeyedChunk(chunk) {
    if (chunk.k !== void 0)
      keyedChunks[chunk.k] = chunk;
  }
  function forgetChunk(item) {
    if (isChunk(item) && item.k !== void 0 && keyedChunks[item.k] === item) {
      delete keyedChunks[item.k];
    }
  }
  function renderComponent(renderable) {
    const [props, emit2, box] = createPropsProxy(renderable.p, renderable.h, renderable.e);
    const cleanups = [];
    const previousCollector = swapCleanupCollector(cleanups);
    let template;
    let fragment;
    try {
      template = renderable.h(props, emit2);
      fragment = template();
    } finally {
      swapCleanupCollector(previousCollector);
    }
    const chunk = template._c();
    if (cleanups.length) {
      (chunk.u ??= []).push(...cleanups);
    }
    chunk.r = false;
    chunk.s = box;
    chunk.k = renderable.k;
    return [fragment, chunk];
  }
  return render;
}
var unmountStack = [];
function destroyChunk(chunk, detached = false) {
  if (chunk.st)
    removeStaleChunk(chunk);
  releaseTemplate(chunk);
  if (chunk.v) {
    for (let i2 = 0; i2 < chunk.v.length; i2++) {
      const [target, event] = chunk.v[i2];
      const bindings = target[eventBindingsKey];
      if (bindings) {
        delete bindings[event];
        let hasBindings = false;
        for (const key in bindings) {
          hasBindings = true;
          break;
        }
        if (!hasBindings)
          delete target[eventBindingsKey];
      }
      target.removeEventListener(event, dispatchChunkEvent);
    }
  }
  if (chunk.u) {
    for (let i2 = 0; i2 < chunk.u.length; i2++)
      chunk.u[i2]();
    chunk.u = null;
  }
  if (chunk.e + 1) {
    releaseExpressions(chunk.e);
    chunk.e = -1;
  }
  let node = chunk.ref.f;
  if (!detached && node) {
    const last = chunk.ref.l;
    if (node === last)
      node.remove();
    else {
      while (node) {
        const next = node === last ? null : node.nextSibling;
        node.remove();
        if (!next)
          break;
        node = next;
      }
    }
  }
  chunk.dom.textContent = "";
  chunk.ref.f = chunk.ref.l = null;
  chunk.k = chunk.i = chunk.s = void 0;
  chunk.u = chunk.v = null;
  chunk.b = chunk.st = false;
  chunk.r = true;
  chunk.g = "";
  freeChunk(chunk);
}
function recycleChunk(chunk, detached = false) {
  if (!detached)
    moveDOMRef(chunk.ref, chunk.dom);
  releaseTemplate(chunk);
  if (chunk.st || !chunk.r)
    return;
  chunk.st = true;
  let bucket = staleBySignature.get(chunk.g);
  if (!bucket) {
    bucket = {};
    staleBySignature.set(chunk.g, bucket);
  }
  chunk.bkn = bucket.h;
  bucket.h = chunk;
  if (chunk.i !== void 0)
    staleById.set(chunk.i, chunk);
}
var unmountQueued = false;
function canSyncUnmount(chunk) {
  for (let i2 = 0; i2 < chunk.length; i2++) {
    const item = chunk[i2];
    if (isChunk(item) && !item.r)
      return false;
  }
  return true;
}
function replaceListWithPlaceholder(chunk, placeholder) {
  if (!chunk.length)
    return false;
  const first = getNode(chunk[0], void 0, true);
  const last = getNode(chunk[chunk.length - 1]);
  const parent = first.parentNode;
  if (!parent || first !== parent.firstChild || last !== parent.lastChild) {
    return false;
  }
  parent.replaceChildren(placeholder);
  return true;
}
function removeUnmounted(chunk, detached = false) {
  if (isChunk(chunk)) {
    if (chunk.r)
      recycleChunk(chunk, detached);
    else
      destroyChunk(chunk, detached);
    return;
  }
  if (Array.isArray(chunk)) {
    if (!detached && chunk.length) {
      const first = getNode(chunk[0], void 0, true);
      const last = getNode(chunk[chunk.length - 1]);
      const parent = first.parentNode;
      if (parent) {
        if (first === parent.firstChild && last === parent.lastChild) {
          parent.textContent = "";
        } else {
          const range = document.createRange();
          range.setStartBefore(first);
          range.setEndAfter(last);
          range.deleteContents();
        }
        detached = true;
      }
    }
    let bucket;
    let signature = "";
    for (let i2 = 0; i2 < chunk.length; i2++) {
      const item = chunk[i2];
      if (isChunk(item)) {
        if (!item.r) {
          destroyChunk(item, detached);
          continue;
        }
        if (!detached)
          moveDOMRef(item.ref, item.dom);
        releaseTemplate(item);
        if (item.st)
          continue;
        item.st = true;
        if (signature !== item.g) {
          signature = item.g;
          bucket = staleBySignature.get(signature);
          if (!bucket) {
            bucket = {};
            staleBySignature.set(signature, bucket);
          }
        }
        item.bkn = bucket.h;
        bucket.h = item;
        if (item.i !== void 0)
          staleById.set(item.i, item);
      } else if (!detached) {
        item.remove();
      }
    }
    return;
  }
  if (!detached)
    chunk.remove();
}
function drainUnmountStack() {
  unmountQueued = false;
  const stack = unmountStack;
  unmountStack = [];
  for (let i2 = 0; i2 < stack.length; i2++)
    removeUnmounted(stack[i2]);
  if (unmountStack.length)
    scheduleUnmountDrain();
}
function scheduleUnmountDrain() {
  if (unmountQueued)
    return;
  unmountQueued = true;
  queueMicrotask(drainUnmountStack);
}
function unmount(chunk) {
  if (!chunk)
    return;
  unmountStack.push(chunk);
  scheduleUnmountDrain();
}
function renderText(value) {
  return value || value === 0 ? value : "";
}
function getNode(chunk, anchor, first) {
  if (isChunk(chunk)) {
    return first ? chunk.ref.f : chunk.ref.l;
  }
  if (Array.isArray(chunk)) {
    return getNode(chunk[first ? 0 : chunk.length - 1], anchor, first);
  }
  return chunk;
}
function adoptRenderedValue(value, capture, map, visited) {
  if (!value)
    return value;
  if (isChunk(value)) {
    adoptCapturedChunk(capture, value, map, visited);
    return value;
  }
  if (Array.isArray(value)) {
    const next = new Array(value.length);
    for (let i2 = 0; i2 < value.length; i2++) {
      next[i2] = adoptRenderedValue(value[i2], capture, map, visited);
    }
    return next;
  }
  return map.get(value) ?? value;
}
function createPaths(dom) {
  const pathTape = [];
  const attrNames = [];
  const path = [];
  const previous = [];
  const pushPath = (attrName) => {
    const pathLen = path.length;
    const previousLen = previous.length;
    const limit = pathLen < previousLen ? pathLen : previousLen;
    let sharedDepth = 0;
    while (sharedDepth < limit && previous[sharedDepth] === path[sharedDepth]) {
      sharedDepth++;
    }
    pathTape.push(sharedDepth, pathLen - sharedDepth);
    for (let i2 = sharedDepth; i2 < pathLen; i2++)
      pathTape.push(path[i2]);
    pathTape.push(attrName ? attrNames.push(attrName) : 0);
    previous.length = pathLen;
    for (let i2 = 0; i2 < pathLen; i2++)
      previous[i2] = path[i2];
  };
  const walk = (node) => {
    if (node.nodeType === 1) {
      const attrs = node.attributes;
      for (let i2 = 0; i2 < attrs.length; i2++) {
        const attr = attrs[i2];
        if (attr.value === delimiterComment)
          pushPath(attr.name);
      }
    } else if (node.nodeType === 8) {
      pushPath();
    } else if (node.nodeType === 3 && node.nodeValue === delimiterComment) {
      pushPath();
    }
    const children2 = node.childNodes;
    for (let i2 = 0; i2 < children2.length; i2++) {
      path.push(i2);
      walk(children2[i2]);
      path.pop();
    }
  };
  const children = dom.childNodes;
  for (let i2 = 0; i2 < children.length; i2++) {
    path.push(i2);
    walk(children[i2]);
    path.pop();
  }
  return [pathTape, attrNames];
}
function normalizeNodePlaceholders(dom) {
  const walk = (node) => {
    const children = node.childNodes;
    for (let i2 = 0; i2 < children.length; i2++) {
      const child = children[i2];
      if (child.nodeType === 8 && child.data === delimiter) {
        node.replaceChild(document.createTextNode(""), child);
        continue;
      }
      if (child.nodeType === 3 && child.nodeValue === delimiterComment) {
        child.nodeValue = "";
      }
      if (child.firstChild)
        walk(child);
    }
  };
  walk(dom);
}

// node_modules/.deno/@jsr+devcapsule__adapter@4.0.0/node_modules/@jsr/devcapsule__adapter/src/util.js
function uuid() {
  const g2 = typeof globalThis !== "undefined" ? globalThis : {};
  const c2 = g2.crypto || g2.msCrypto;
  if (c2 && typeof c2.randomUUID === "function") {
    return c2.randomUUID();
  }
  if (c2 && typeof c2.getRandomValues === "function") {
    const bytes = new Uint8Array(16);
    c2.getRandomValues(bytes);
    bytes[6] = bytes[6] & 15 | 64;
    bytes[8] = bytes[8] & 63 | 128;
    const hex = Array.from(bytes, (b2) => b2.toString(16).padStart(2, "0")).join("");
    return hex.slice(0, 8) + "-" + hex.slice(8, 12) + "-" + hex.slice(12, 16) + "-" + hex.slice(16, 20) + "-" + hex.slice(20);
  }
  const counter = uuid._ctr = (uuid._ctr || 0) + 1;
  const time = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 10);
  return `${time}-${rand}-${counter.toString(36)}`;
}

// node_modules/.deno/@jsr+devcapsule__adapter@4.0.0/node_modules/@jsr/devcapsule__adapter/src/css.js
var css = String.raw;

// node_modules/.deno/@jsr+devcapsule__adapter@4.0.0/node_modules/@jsr/devcapsule__adapter/src/adapter.js
var AdapterClassController = class {
  /**
   * Reference to the Adapter constructor that owns this controller.
   *
   * Notes
   * -----
   * Set internally by AdapterMixin when the subclass is first accessed.
   */
  adapterClass;
  /**
   * Constructable stylesheet that holds class-level CSS rules.
   *
   * Notes
   * -----
   * Added to `document.adoptedStyleSheets` in `initStyle()`.
   */
  cssStyleSheet = new CSSStyleSheet();
  /**
   * Custom element tag name for this component (once defined).
   */
  tagName;
  /**
   * CSS template tag processor used to transform CSS template literals.
   *
   * Notes
   * -----
   * Defaults to the `css` function imported from './css.ts'. This processor is
   * invoked when compiling class-level styles into the constructable
   * CSSStyleSheet. It may be replaced (for example in tests or subclasses) to
   * provide custom processing such as scoping, variable substitution, or
   * minification prior to writing rules into the stylesheet.
   */
  cssProcessor = css;
  /**
   * Accumulated CSS blocks without selectors.
   *
   * Notes
   * -----
   * - Preserves insertion order (via `addStyle()`).
   * - These snippets are wrapped with the component selector before being
   *   committed to `cssStyleSheet`.
   */
  styles = [];
  /**
   * Concatenated class-level CSS.
   *
   * Returns
   * -------
   * string
   *     The joined stylesheet text for this class only (no superclasses).
   */
  get style() {
    return this.styles.join("\n");
  }
  /**
   * Replace existing class-level CSS and update the stylesheet.
   *
   * Parameters
   * ----------
   * style : string
   *     Entire CSS text to set for this class.
   */
  set style(style) {
    this.styles = [
      style
    ];
    this.updateStyleSheet();
  }
  /**
   * Collect CSS from the inheritance chain.
   *
   * Returns
   * -------
   * string[]
   *     Array of CSS blocks from superclasses followed by this class.
   *
   * Notes
   * -----
   * Superclass styles are added first to preserve expected cascade order.
   */
  get allStyles() {
    let superClass = Object.getPrototypeOf(this.adapterClass);
    const allStyles = [];
    while (superClass.adapter) {
      allStyles.push(...superClass.adapter.styles);
      superClass = Object.getPrototypeOf(superClass);
    }
    allStyles.push(...this.styles);
    return allStyles;
  }
  /**
   * Joined CSS string across the entire inheritance chain.
   *
   * Returns
   * -------
   * string
   *     Combined stylesheet text including superclasses and this class.
   */
  get allStyle() {
    return this.allStyles.join("\n");
  }
  /**
   * Define the custom element and initialize its shared stylesheet.
   *
   * Parameters
   * ----------
   * tagName : string
   *     The custom element tag to register.
   *
   * Raises
   * ------
   * DOMException
   *     If the tag name is invalid or already defined.
   *
   * Examples
   * --------
   * ```ts
   * class Card extends Adapter {}
   * Card.define("el-card");
   * ```
   *
   * Notes
   * -----
   * When extending, call `super.define(tagName)` before subclass-specific work.
   */
  define(tagName) {
    this.tagName = tagName;
    customElements.define(tagName, this.adapterClass);
    this.initStyle();
  }
  /**
   * Attach the shared stylesheet and synchronize its rules.
   *
   * Notes
   * -----
   * Pushes `cssStyleSheet` to `document.adoptedStyleSheets` and compiles the
   * current CSS into it.
   */
  initStyle() {
    document.adoptedStyleSheets.push(this.cssStyleSheet);
    this.updateStyleSheet();
  }
  /**
   * Append a CSS block to this class and update the stylesheet.
   *
   * Parameters
   * ----------
   * style : string
   *     CSS text without a selector (it will be wrapped automatically).
   */
  addStyle(style) {
    this.styles.push(style);
    this.updateStyleSheet();
  }
  /**
   * Compile and replace the constructable stylesheet with current rules.
   *
   * Notes
   * -----
   * No-op until `tagName` is set (i.e., after `define()`).
   */
  updateStyleSheet() {
    if (!this.tagName) {
      return;
    }
    const css2 = this.cssProcessor`${this.tagName} { ${this.allStyle} }`;
    this.cssStyleSheet.replaceSync(css2);
  }
};
var AdapterObjectController = class {
  /**
   * The owning Adapter element instance.
   *
   * Notes
   * -----
   * Set by the Adapter mixin constructor immediately after instantiation.
   */
  adapterObject;
  /**
   * Constructable stylesheet used for instance-scoped CSS rules.
   *
   * Notes
   * -----
   * Registered with the element's root node via adoptedStyleSheets when connected.
   */
  cssStyleSheet = new CSSStyleSheet();
  /**
   * Lazily generated UUID for the element.
   *
   * Notes
   * -----
   * - Used to create a unique class selector on the element.
   * - Stable for the lifetime of this controller once generated.
   */
  _uuid;
  /**
   * MutationObserver for tracking `css` attribute changes on the element.
   *
   * Notes
   * -----
   * Automatically updates `adapterObject.css` when the `css` attribute changes.
   */
  _cssObserver;
  /**
   * Cached Adapter class (constructor) for the owning element.
   *
   * Notes
   * -----
   * Populated in `initClass()` and used to access class-level controller state.
   */
  _class;
  /**
   * Unique identifier for this element used in generated selectors.
   *
   * Returns
   * -------
   * string
   *     The UUID in the form `${tagName}-${random}`.
   *
   * Notes
   * -----
   * Generated on first access and then cached.
   */
  get uuid() {
    if (this._uuid) {
      return this._uuid;
    }
    ;
    this._uuid = `${this.adapterObject.tagName}-${uuid()}`;
    return this._uuid;
  }
  /**
   * A MutationObserver instance that mirrors `css` attribute changes to styles.
   *
   * Returns
   * -------
   * MutationObserver
   *     The observer configured to watch attribute mutations on the element.
   *
   * Notes
   * -----
   * Created lazily and reused for subsequent observations.
   */
  get cssObserver() {
    if (this._cssObserver) {
      return this._cssObserver;
    }
    ;
    this._cssObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === "css") {
          this.adapterObject.css = this.adapterObject.getAttribute("css") || "";
        }
        ;
      }
      ;
    });
    return this._cssObserver;
  }
  /**
   * Selector for this element represented as a dot-joined class chain.
   *
   * Returns
   * -------
   * string
   *     The element's classList joined with '.' (e.g., "a.b.c").
   */
  get objectClassSelector() {
    return this.adapterObject.classList.value.replace(/ /g, ".");
  }
  /**
   * Initialize class-level links and ensure the class stylesheet is ready.
   *
   * Notes
   * -----
   * - Captures the Adapter constructor from the instance.
   * - If the class tagName is not set, initializes it and attaches the shared stylesheet.
   * - No-op if the class tagName is already defined.
   */
  initClass() {
    this._class = this.adapterObject.constructor;
    if (this._class.adapter.tagName) {
      return;
    }
    this._class.adapter.tagName = this.adapterObject.tagName;
    this._class.adapter.initStyle();
  }
  /**
   * Enable or disable observation of the element's `css` attribute.
   *
   * Parameters
   * ----------
   * enable : boolean
   *     True to start observing, false to disconnect.
   *
   * Notes
   * -----
   * Observation is limited to attribute mutations on the host element.
   */
  cssObserve(enable) {
    if (enable) {
      this.cssObserver.observe(this.adapterObject, {
        attributes: true
      });
    } else {
      this.cssObserver.disconnect();
    }
  }
};
function AdapterMixin(Base2) {
  return class _Adapter extends Base2 {
    /** Static instance of AdapterClassController */
    static _adapter;
    /**
     * Get the AdapterClassController instance.
     */
    static get adapter() {
      const parentClass = Object.getPrototypeOf(this);
      if (this._adapter === parentClass._adapter) {
        const parentAdapter = "adapter" in parentClass ? parentClass.adapter : void 0;
        this._adapter = new AdapterClassController();
        this._adapter.adapterClass = this;
        if (parentAdapter) {
          this._adapter.cssProcessor = parentAdapter.cssProcessor;
        }
      }
      return this._adapter;
    }
    /**
     * Create a configured subclass branch without mutating the current class.
     */
    static configure(options = {}) {
      return class ConfiguredAdapter extends this {
        static {
          if (options.cssProcessor) {
            this.adapter.cssProcessor = options.cssProcessor;
          }
        }
      };
    }
    /**
     * Set the CSS for the component.
     */
    static set css(css2) {
      this.adapter.style = css2;
    }
    /**
     * Get the CSS for the component.
     */
    static get css() {
      return this.adapter.style;
    }
    /**
     * Get the tag name of the component.
     */
    static get tagName() {
      return this.adapter.tagName;
    }
    /**
     * Add style to this component.
     */
    static addStyle(css2) {
      this.adapter.addStyle(css2);
    }
    /**
     * Define component to element tag and init component style.
     * To extend this function, sub-elements must be defined
     * before calling this function as `super.define(tagName);`
     */
    static define(tagName) {
      this.adapter.define(tagName);
    }
    /** Instance of AdapterObjectController */
    _adapter = new AdapterObjectController();
    /**
     * Constructor to initialize the AdapterObjectController.
     */
    // deno-lint-ignore no-explicit-any
    constructor(...args) {
      super(...args);
      this._adapter.adapterObject = this;
      if (!this._adapter._class) {
        this._adapter.initClass();
      }
      ;
      this._adapter.cssObserve(true);
    }
    /**
     * Set CSS for this element with tag name.
     */
    set css(css2) {
      this.classList.add(this._adapter.uuid);
      const cssRule = `${this.tagName}.${this._adapter.objectClassSelector} { ${css2} }`;
      this._adapter.cssStyleSheet.replaceSync(this._adapter._class.adapter.cssProcessor`${cssRule}`);
    }
    /**
     * Get CSS for this element.
     */
    get css() {
      let css2 = this.getAttribute("css") || "";
      if (css2) {
        return css2;
      }
      ;
      for (const rule of this._adapter.cssStyleSheet.cssRules) {
        css2 += rule.cssText + "\n";
      }
      return css2;
    }
    /**
     * Add style for this element.
     */
    addStyle(css2) {
      this.classList.add(this._adapter.uuid);
      const cssRule = `${this.tagName}.${this._adapter.objectClassSelector} { ${css2} }`;
      this._adapter.cssStyleSheet.replaceSync(`
        ${this.css}
        ${this._adapter._class.adapter.cssProcessor`${cssRule}`}
      `);
    }
    /**
     * Register CSSStyleSheet() object to `rootNode.adoptedStyleSheets`.
     * This function will check the existing CSSStyleSheet() before applying
     * to make sure that it won't create duplicates.
     */
    _registCSSStyleSheet() {
      const css2 = this.getAttribute("css");
      if (css2) {
        this.css = css2;
      }
      ;
      const rootNode = this.getRootNode();
      if (rootNode.adoptedStyleSheets.indexOf(this._adapter._class.adapter.cssStyleSheet) === -1) {
        rootNode.adoptedStyleSheets.push(this._adapter._class.adapter.cssStyleSheet);
      }
      if (rootNode.adoptedStyleSheets.indexOf(this._adapter.cssStyleSheet) === -1) {
        rootNode.adoptedStyleSheets.push(this._adapter.cssStyleSheet);
      }
    }
    /** Callback when the element is connected to the DOM */
    connectedCallback() {
      super.connectedCallback ? super.connectedCallback() : null;
      this._registCSSStyleSheet();
    }
    /** Remove the element from DOM and remove adoptedStyleSheet */
    remove() {
      const rootNode = this.getRootNode();
      const i2 = rootNode.adoptedStyleSheets.indexOf(this._adapter.cssStyleSheet);
      rootNode.adoptedStyleSheets.splice(i2, 1);
      super.remove();
    }
  };
}
var Adapter = class extends AdapterMixin(HTMLElement) {
  // Redeclare Adapter's static API directly so editor tooling can resolve
  // completions on the exported class without tracing the mixin result.
  static get adapter() {
    return super.adapter;
  }
  static configure(options = {}) {
    return super.configure(options);
  }
  static set css(css2) {
    super.css = css2;
  }
  static get css() {
    return super.css;
  }
  static get tagName() {
    return super.tagName;
  }
  static addStyle(css2) {
    super.addStyle(css2);
  }
  static define(tagName) {
    super.define(tagName);
  }
};

// src/ui/_tokens/primitives/typography.ts
var typography = {
  family: "system-ui, sans-serif",
  lineHeight: "1.5",
  weightMedium: "600"
};

// src/ui/_components/base.ts
var Base = class extends Adapter {
  static {
    this.css = `
      box-sizing: border-box;
      font-family: ${typography.family};
      line-height: ${typography.lineHeight};
      color: inherit;
    `;
  }
  /**
   * Override to validate and normalize creation input, which may be undefined.
   * Return the data expected by applyData(), or throw to abort create().
   * The base implementation passes input through without validation.
   */
  static validateData(data) {
    return data;
  }
  /**
   * Requires define(tagName) registration. Constructs a detached element, then
   * validates input, applies data, and appends supplied children in that order.
   * Validation errors propagate; construction has already occurred at that point.
   */
  static create(options = {}) {
    if (!this.tagName) {
      throw new Error(
        `${this.name} must be registered with .define(tagName) before .create()`
      );
    }
    const element = new this();
    element.applyData(this.validateData(options.data));
    element.append(...options.children ?? []);
    return element;
  }
  /**
   * Override to apply normalized data; the base hook does nothing.
   * create() calls this before attachment and before appending supplied children.
   * Direct callers must validate first; this hook does not run validateData().
   */
  applyData(_data) {
  }
};

// node_modules/.deno/edictor@0.4.0/node_modules/edictor/dist/es/edictor.js
var edictor_exports = {};
__export(edictor_exports, {
  ArrayOf: () => _,
  Field: () => S,
  Model: () => u,
  defineField: () => F
});
function t(t2) {
  if (!(t2 instanceof Function)) return false;
  const e2 = t2.toString();
  return !!e2.match(/^function/) || (!!e2.match(/^\([\w\s,]*\)\s*\=\>\s*\{.*};?$/s) || !!e2.match(/^[\w\s]*\s*\=\>\s*\{.*};?$/s));
}
function e(t2) {
  return t2 instanceof Function && !!t2.toString().match(/^class/);
}
var r = class extends Error {
  constructor(t2) {
    super(t2), this.name = "AssertError";
  }
};
var i = (t2, e2 = null) => {
  if (null === e2 && (e2 = "Expected expression to be true."), false === t2) throw new r(e2);
};
var s = class extends Error {
  constructor(t2 = "") {
    super(t2), this.name = "ModelError";
  }
};
var n = class extends s {
  constructor(t2 = "") {
    super(t2), this.name = "DefineError";
  }
};
var o = class extends s {
  constructor(t2 = "") {
    super(t2), this.name = "ValidateError";
  }
};
var a = class extends s {
  constructor(t2 = "") {
    super(t2), this.name = "InitError";
  }
};
var c = class extends s {
  constructor(t2 = "") {
    super(t2), this.name = "UpdateError";
  }
};
var l = class extends Error {
  constructor(t2 = "Field is undeinfed") {
    super(t2), this.name = "UndefinedError";
  }
};
var d = class extends Error {
  constructor(t2 = "") {
    super(t2), this.name = "SetValueError";
  }
};
var h = class extends Error {
  constructor(t2 = "") {
    super(t2), this.name = "InputDataError";
  }
};
var u = class {
  static _define = {};
  static _definedClass = "Model";
  static _option = { strict: true };
  static define(t2 = {}, e2 = {}) {
    if (this._definedClass === this.name) throw new n(`${this} has been defined.`);
    const r2 = Object.getPrototypeOf(this);
    if (this._option = { ...r2._option, ...e2 }, this._define = { ...r2._define }, "" === r2.name) throw new n("Model.define() is prohibited. It must be called from a subclass");
    const i2 = { valid: {}, invalid: {}, error: {} };
    for (let [e3, r3] of Object.entries(t2)) {
      let s2;
      if (r3 instanceof A) {
        if (s2 = r3.field(), void 0 === s2.name && (s2.name = e3), void 0 === s2.option.initial) i2.valid[e3] = r3;
        else if (void 0 !== s2.option.initial) try {
          s2.validate(s2.option.initial), i2.valid[e3] = r3;
        } catch (t3) {
          i2.error[e3] = `Field({initial: ${s2.option.initial}}) conflicts with Field's validation => ${t3}`;
        }
        t2[e3] = s2;
      } else i2.error[e3] = "Assigned value is not an instance of DefineField";
    }
    if (Object.keys(i2.error).length > 0) throw i2.errorMessage = `${this.name}.define() throw errors`, new n(JSON.stringify(i2));
    return this._define = { ...this._define, ...t2 }, this._definedClass = this.name, this;
  }
  static get field() {
    return { ...this._define };
  }
  static _traverse_error_to_string(t2) {
    for (const [e2, r2] of Object.entries(t2)) r2 instanceof Error ? t2[e2] = `${r2.name}: ${r2.message}` : r2 instanceof Object && (t2[e2] = this._traverse_error_to_string(t2[e2]));
    return t2;
  }
  static _check_input_data(t2) {
    if (t2 instanceof Array) throw new h(`new ${this.constructor.name}(data) => data must be an instance of object. Received Array`);
    if (!(t2 instanceof Object)) throw new h(`new ${this.constructor.name}(data) => data must be an instance of object, Received ` + typeof t2);
  }
  static partial(t2, e2 = {}) {
    this._check_input_data(t2), t2 = { ...t2 }, e2 = { ...this._option, ...e2 };
    const r2 = { valid: {}, invalid: {}, error: {} };
    for (const [i2, s2] of Object.entries(t2)) if (i2 in this.field) try {
      r2.valid[i2] = this.field[i2].validate(s2);
    } catch (t3) {
      r2.invalid[i2] = s2, r2.error[i2] = t3;
    }
    else true === e2.strict ? (r2.invalid[i2] = s2, r2.error[i2] = new l("Field is undefined.")) : r2.valid[i2] = s2;
    return Object.keys(r2.error).length > 0 && (r2.errorMessage = "Partial testing contains errors."), r2;
  }
  static test(t2, e2 = {}) {
    this._check_input_data(t2), t2 = { ...t2 }, e2 = { ...this._option, ...e2 };
    const r2 = { valid: {}, invalid: {}, error: {} };
    for (const e3 in this.field) {
      const i2 = t2[e3];
      if (delete t2[e3], void 0 !== i2 || void 0 === this.field[e3].option.initial) try {
        r2.valid[e3] = this.field[e3].validate(i2);
      } catch (t3) {
        r2.invalid[e3] = i2, r2.error[e3] = t3;
      }
      else r2.valid[e3] = this.field[e3].option.initial;
    }
    if (true === e2.strict) for (const e3 of Object.keys(t2)) r2.invalid[e3] = t2[e3], r2.error[e3] = new l("Field is undefined.");
    else Object.assign(r2.valid, t2);
    return Object.keys(r2.error).length > 0 && (r2.errorMessage = "Testing contains errors."), r2;
  }
  static validate(t2, e2 = {}) {
    let r2 = this.test(t2, e2);
    if (r2.error = this._traverse_error_to_string(r2.error), void 0 !== r2.errorMessage) throw r2.errorMessage = `${this}.validate() throws errors.`, new o(JSON.stringify(r2));
    return r2.valid;
  }
  constructor(t2 = {}, e2 = {}) {
    const r2 = this.constructor;
    e2 = { ...r2._option, ...e2 }, this._option = e2;
    try {
      t2 = r2.validate(t2, e2);
    } catch (t3) {
      if ("InputDataError" === t3.name) throw t3;
      const e3 = JSON.parse(t3.message);
      throw e3.errorMessage = `new ${this}() throws errors.`, new a(JSON.stringify(e3));
    }
    Object.assign(this, t2);
    return new Proxy(this, { get: (t3, e3, r3) => Reflect.get(t3, e3, r3), set: (t3, e3, i2) => {
      const s2 = r2.field[e3];
      if (void 0 === s2) {
        if (t3._option.strict) throw new d(`${t3.constructor.name}()["${e3}"] is not defined`);
        return t3[e3] = i2, true;
      }
      return i2 = s2.validate(i2), Reflect.set(t3, e3, i2);
    }, deleteProperty: (t3, e3) => {
      const r3 = t3.constructor.field[e3];
      return r3 && r3.validate(void 0), Reflect.deleteProperty(t3, e3);
    }, ownKeys: (t3) => Object.keys(t3).filter(((t4) => "_option" != t4)) });
  }
  object() {
    return JSON.parse(JSON.stringify(this));
  }
  json() {
    return JSON.stringify(this);
  }
  update(t2) {
    const e2 = this.constructor;
    try {
      new e2({ ...this.object(), ...t2 });
    } catch (t3) {
      const e3 = JSON.parse(t3.message);
      throw e3.errorMessage = `${this.constructor.name}().update(data)
 throw errors`, new c(JSON.stringify(e3));
    }
    for (const e3 in t2) this[e3] = t2[e3];
  }
};
var f = class extends Error {
  constructor(t2 = "") {
    super(t2), this.name = "SetValueError";
  }
};
var v = class extends Error {
  constructor(t2 = "") {
    super(t2), this.name = "PushError";
  }
};
var p = class extends Error {
  constructor(t2 = "") {
    super(t2), this.name = "ValidationError";
  }
};
var _ = class __ extends Array {
  _validators = [];
  constructor(...t2) {
    return super(), this._validators = [...t2], new Proxy(this, { get: (t3, e2, r2) => Reflect.get(t3, e2, r2), set(t3, e2, r2, i2) {
      const s2 = t3._validate_value_with_validators(r2);
      if ("value" in s2) return r2 = s2.value, Reflect.set(t3, e2, r2, i2);
      if ("error" in s2) {
        const t4 = { errorMessage: `${s2.error}`, error: { [e2]: r2 } };
        throw new f(JSON.stringify(t4));
      }
    }, ownKeys: (t3) => Reflect.ownKeys(new Array(...t3)) });
  }
  get validators() {
    return this._validators;
  }
  _validate(r2, s2) {
    if ("string" == typeof s2) return i(typeof r2 === s2, `${r2} => must be instance of ${s2}`), r2;
    if (s2 instanceof Array) {
      i(r2 instanceof Array, "value must be instance of Array");
      const t2 = new __(...s2);
      return t2.push(...r2), t2;
    }
    return t(s2) ? (s2(r2), r2) : e(s2) ? (i(r2 instanceof s2), r2) : void 0;
  }
  _validate_value_with_validators(t2, e2 = this.validators) {
    let r2, i2 = false;
    if (0 === (e2 = [...e2]).length) return { value: r2 };
    for (const s2 of e2) try {
      r2 = this._validate(t2, s2), i2 = true;
      break;
    } catch {
    }
    return i2 ? { value: r2 } : { error: new p(`Expect (${this.validators_to_names(e2)})`) };
  }
  validators_to_names(t2 = this.validators) {
    return (t2 = [...t2]).map(((t3) => this.validator_to_name(t3)));
  }
  validator_to_name(r2) {
    return r2 instanceof Array ? this.validators_to_names(r2) : t(r2) ? `${r2.name}()` : e(r2) ? r2.name : r2;
  }
  _push_skip_proxy(...t2) {
    let e2 = this.length;
    for (const r2 of t2) super[e2] = r2, e2 += 1;
    return e2;
  }
  test(t2, e2 = this.validators) {
    e2 = [...e2], t2 = [...t2];
    const r2 = {}, i2 = {}, s2 = {};
    let n2 = {};
    for (const o2 in t2) n2 = this._validate_value_with_validators(t2[o2], e2), "value" in n2 ? r2[o2] = n2.value : "error" in n2 && (i2[o2] = t2[o2], s2[o2] = n2.error);
    return n2 = { test: `Expect (${this.validators_to_names().toString()})`, valid: r2, invalid: i2, error: s2 }, n2;
  }
  push(...t2) {
    t2 = [...t2];
    const e2 = this.test(t2);
    if (Object.keys(e2.invalid).length > 0) {
      const t3 = { errorMessage: e2.test, valid: e2.valid, invalid: e2.invalid };
      throw new v(JSON.stringify(t3));
    }
    return this._push_skip_proxy(...Object.values(e2.valid));
  }
  object() {
    return JSON.parse(JSON.stringify(this));
  }
  json() {
    return JSON.stringify(this);
  }
};
var w = class extends Error {
  constructor(t2) {
    super(t2), this.name = "ValidationError";
  }
};
var m = class _m extends _ {
  constructor(...t2) {
    super(...t2);
  }
  _validate(t2, e2) {
    if (e2 instanceof A) return (e2 = e2.field()).validate(t2), t2;
    if (e2.prototype instanceof u) return new e2(t2), t2;
    if (e2 instanceof Array) {
      i(t2 instanceof Array, "value must be instance of Array");
      const r2 = new _m(...e2);
      return r2.push(...t2), r2;
    }
    return super._validate(t2, e2);
  }
  validator_to_name(t2) {
    return t2 instanceof A ? `defineField({name: ${t2.field().name}})` : super.validator_to_name(t2);
  }
};
var g = (...t2) => function(r2) {
  ((t3, r3) => {
    let i2 = false;
    for (const s2 of r3) e(s2) && t3 instanceof s2 && (i2 = true), "string" == typeof s2 && typeof t3 === s2 && (i2 = true);
    if (!i2) throw new w(`Expect instance(${r3}) but got ${typeof t3}`);
  })(r2, t2);
};
var y = (t2) => function(e2) {
  ((t3, e3) => {
    if (!e3.test(t3)) throw new w(`"${t3}" doesn't pass Regular Expression => ${e3}`);
  })(e2, t2);
};
var O = (e2, r2 = "") => function(i2) {
  ((e3, r3, i3 = "") => {
    if (!r3(e3)) throw t(i3) && (i3 = i3(r3, e3)), new w(i3);
  })(i2, e2, r2);
};
var b = (t2) => function(e2) {
  return ((t3, e3) => e3(t3))(e2, t2);
};
var E = (...t2) => function(e2 = []) {
  return ((t3, e3) => {
    if (!(t3 instanceof Array)) throw new w(`${t3} is not iterable`);
    const r2 = new m(...e3);
    return r2.push(...t3), r2;
  })(e2, t2);
};
var x = (t2) => (e2) => ((t3, e3) => new e3(t3))(e2, t2);
var $ = class extends Error {
  constructor(t2 = "") {
    super(t2), this.name = "FieldError";
  }
};
var j = class extends Error {
  constructor(t2 = "") {
    super(t2), this.name = "RequiredError";
  }
};
var S = class {
  constructor(t2 = {}) {
    this._setOption(t2);
  }
  get name() {
    return this._option.name;
  }
  set name(t2) {
    this._option.name = t2;
  }
  _validators = [];
  get validators() {
    return this._validators;
  }
  set validators(t2) {
    this._validators = t2;
  }
  _option = A.option;
  _setOption(t2 = {}) {
    void 0 !== (t2 = { ...A.option, ...t2 }).initial && this.validate(t2.initial), void 0 === this.value && (this._value = t2.initial), this._option = t2;
  }
  get option() {
    return this._option;
  }
  set value(t2) {
    this._value = this.validate(t2);
  }
  get value() {
    if (this._option.required && void 0 === this._value) throw new j("Field is required");
    return this._value;
  }
  reset() {
    this._value = this._option.initial;
  }
  validate(t2) {
    const e2 = [];
    if (void 0 === t2) {
      if (this._option.required) throw new j("Field is required");
      return;
    }
    if (this._option.grant.includes(t2)) return t2;
    for (const r3 of this.validators) try {
      const e3 = r3(t2);
      void 0 !== e3 && (t2 = e3);
    } catch (t3) {
      e2.push(t3.message);
    }
    let r2 = `Field({name: "${this.name}"})`;
    for (const t3 of e2) r2 += `
	- ${t3}`;
    if (e2.length > 0) throw new $(r2);
    return t2;
  }
};
var A = class _A {
  static option = { required: false, initial: void 0, grant: [] };
  constructor(t2 = {}, e2 = []) {
    this._setOption(t2), this._validators = [...e2];
  }
  _option = _A.option;
  _setOption(t2) {
    this._option = { ...this._option, ...t2 };
  }
  get option() {
    return this._option;
  }
  get validators() {
    return this._validators;
  }
  instance(...t2) {
    return new _A(this.option, [...this.validators, g(...t2)]);
  }
  regexp(t2) {
    return new _A(this.option, [...this.validators, y(t2)]);
  }
  assert(t2, e2 = "Assertion error") {
    return new _A(this.option, [...this.validators, O(t2, e2)]);
  }
  apply(t2) {
    return new _A(this.option, [...this.validators, b(t2)]);
  }
  arrayOf(...t2) {
    return new _A(this.option, [...this.validators, E(...t2)]);
  }
  model(t2) {
    return new _A(this.option, [...this.validators, x(t2)]);
  }
  field(t2 = {}) {
    t2 = { ...this.option, ...t2 };
    const e2 = new S(t2);
    return e2.validators = [...this.validators], e2;
  }
};
var F = (t2 = {}) => new A(t2);

// src/ui/_lib/edictor.bundle.ts
var moduleRecord = edictor_exports;
var edictor = "defineField" in moduleRecord ? moduleRecord : moduleRecord.default ?? moduleRecord["module.exports"];
var defineField = edictor.defineField;
var Model = edictor.Model;

// src/ui/_components/button.schema.ts
var ButtonDataModel = class extends Model {
};
ButtonDataModel.define({
  label: defineField({ required: true }).instance("string").assert(
    (value) => typeof value === "string" && value.trim().length > 0,
    "Button label is required"
  ),
  tone: defineField({ initial: "primary" }).instance("string").assert(
    (value) => value === "primary" || value === "danger",
    "Unsupported button tone"
  ),
  type: defineField({ initial: "button" }).instance("string").assert(
    (value) => value === "button" || value === "submit",
    "Unsupported button type"
  )
});
function validateButtonData(data) {
  return ButtonDataModel.validate(data ?? {});
}

// src/ui/_tokens/primitives/color.ts
var palette = {
  slate: {
    300: "#cbd5e1",
    950: "#0f172a"
  },
  blue: {
    600: "#2563eb",
    700: "#1d4ed8"
  },
  red: {
    600: "#dc2626"
  },
  white: "#ffffff"
};

// src/ui/_tokens/primitives/radius.ts
var radius = {
  md: "0.75rem"
};

// src/ui/_tokens/primitives/spacing.ts
var spacing = {
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem"
};

// src/ui/_components/button.tokens.ts
var buttonTokens = {
  background: palette.blue[600],
  backgroundHover: palette.blue[700],
  dangerBackground: palette.red[600],
  foreground: palette.white,
  radius: radius.md,
  paddingBlock: spacing.sm,
  paddingInline: spacing.md,
  weight: typography.weightMedium
};

// src/ui/_components/button.ts
var Button = class extends Base {
  #button = null;
  #applyingData = false;
  static get observedAttributes() {
    return ["label", "tone", "type"];
  }
  static {
    this.css = `
      display: inline-block;

      button {
        min-height: 2.5rem;
        border: 0;
        border-radius: ${buttonTokens.radius};
        padding: ${buttonTokens.paddingBlock} ${buttonTokens.paddingInline};
        background: ${buttonTokens.background};
        color: ${buttonTokens.foreground};
        font: inherit;
        font-weight: ${buttonTokens.weight};
        cursor: pointer;
      }

      button:hover {
        background: ${buttonTokens.backgroundHover};
      }
    `;
  }
  static validateData(data) {
    return validateButtonData(data);
  }
  connectedCallback() {
    super.connectedCallback();
    this.applyAttributes();
  }
  attributeChangedCallback(_name, oldValue, newValue) {
    if (oldValue !== newValue && this.isConnected && !this.#applyingData) {
      this.applyAttributes();
    }
  }
  applyData(data) {
    const button = this.ensureButton();
    this.#applyingData = true;
    try {
      this.setAttributeIfChanged("label", data.label);
      this.setAttributeIfChanged("tone", data.tone);
      this.setAttributeIfChanged("type", data.type);
      button.type = data.type;
      button.textContent = data.label;
    } finally {
      this.#applyingData = false;
    }
  }
  applyAttributes() {
    this.applyData(validateButtonData({
      label: this.getAttribute("label") ?? void 0,
      tone: this.getAttribute("tone") ?? void 0,
      type: this.getAttribute("type") ?? void 0
    }));
  }
  setAttributeIfChanged(name, value) {
    if (this.getAttribute(name) !== value) {
      this.setAttribute(name, value);
    }
  }
  ensureButton() {
    if (!this.#button) {
      const existing = this.querySelector(":scope > button");
      this.#button = existing instanceof HTMLButtonElement ? existing : document.createElement("button");
      if (!existing) {
        this.append(this.#button);
      }
    }
    return this.#button;
  }
};
Button.addStyle(`
  &[tone="danger"] button {
    background: ${buttonTokens.dangerBackground};
  }
`);

// src/ui/_components/card.schema.ts
var CardDataModel = class extends Model {
};
CardDataModel.define({
  variant: defineField({ initial: "surface" }).instance("string").assert(
    (value) => value === "surface" || value === "outlined",
    "Unsupported card variant"
  ),
  padding: defineField({ initial: "md" }).instance("string").assert(
    (value) => value === "sm" || value === "md" || value === "lg",
    "Unsupported card padding"
  )
});
function validateCardData(data) {
  return CardDataModel.validate(data ?? {});
}

// src/ui/_components/card.tokens.ts
var cardTokens = {
  background: palette.white,
  foreground: palette.slate[950],
  border: palette.slate[300],
  radius: radius.md,
  gap: spacing.md,
  paddingSm: spacing.sm,
  paddingMd: spacing.md,
  paddingLg: spacing.lg
};

// src/ui/_components/card.ts
var Card = class extends Base {
  static {
    this.css = `
      display: grid;
      gap: ${cardTokens.gap};
      box-sizing: border-box;
      padding: ${cardTokens.paddingMd};
      border: 1px solid ${cardTokens.border};
      border-radius: ${cardTokens.radius};
      background: ${cardTokens.background};
      color: ${cardTokens.foreground};
    `;
  }
  static validateData(data) {
    return validateCardData(data);
  }
  connectedCallback() {
    super.connectedCallback();
    this.applyData(validateCardData({
      variant: this.getAttribute("variant") ?? void 0,
      padding: this.getAttribute("padding") ?? void 0
    }));
  }
  applyData(data) {
    this.setAttribute("variant", data.variant);
    this.setAttribute("padding", data.padding);
  }
};
Card.addStyle(`
  &[variant="outlined"] {
    background: transparent;
  }

  &[padding="sm"] {
    padding: ${cardTokens.paddingSm};
  }

  &[padding="lg"] {
    padding: ${cardTokens.paddingLg};
  }
`);

// src/ui/_components/chat.schema.ts
var ChatDataModel = class extends Model {
};
ChatDataModel.define({
  title: defineField({ initial: "Chat" }).instance("string").assert(
    (value) => typeof value === "string" && value.trim().length > 0,
    "Chat title is required"
  ),
  agentLabel: defineField({ initial: "Agent" }).instance("string").assert(
    (value) => typeof value === "string" && value.trim().length > 0,
    "Chat agent label is required"
  ),
  userLabel: defineField({ initial: "You" }).instance("string").assert(
    (value) => typeof value === "string" && value.trim().length > 0,
    "Chat user label is required"
  ),
  inputLabel: defineField({ initial: "Your message" }).instance("string").assert(
    (value) => typeof value === "string" && value.trim().length > 0,
    "Chat input label is required"
  ),
  sendLabel: defineField({ initial: "Send" }).instance("string").assert(
    (value) => typeof value === "string" && value.trim().length > 0,
    "Chat send label is required"
  ),
  placeholder: defineField({ initial: "Write a message\u2026" }).instance("string").assert(
    (value) => typeof value === "string",
    "Chat placeholder must be text"
  ),
  emptyMessage: defineField({ initial: "Send a message to begin." }).instance("string").assert(
    (value) => typeof value === "string",
    "Chat empty message must be text"
  )
});
function validateChatData(data) {
  return ChatDataModel.validate(data ?? {});
}

// src/ui/_components/chat.ts
var nextChatInputId = 0;
var Chat = class extends Base {
  #mounted = false;
  #bound = false;
  #applyingData = false;
  #connected = false;
  #pending = false;
  #agentBusy = true;
  #outgoing;
  #inputId = `chat-input-${++nextChatInputId}`;
  #data = validateChatData({});
  static get observedAttributes() {
    return [
      "title",
      "agent-label",
      "user-label",
      "input-label",
      "send-label",
      "placeholder",
      "empty-message"
    ];
  }
  static {
    this.css = `
      display: flex;
      flex-direction: column;
      width: min(48rem, 100%);
      height: min(48rem, 90dvh);
      min-height: 30rem;
      box-sizing: border-box;
      overflow: hidden;
      border: 1px solid #dce3eb;
      border-radius: 1.25rem;
      background: #fff;
      box-shadow: 0 18px 65px #14283e12;
      font-size: 1.2rem;

      header {
        padding: 1.4rem 1.6rem;
        border-bottom: 1px solid #e7ecf1;
      }

      h1 {
        margin: 0;
        font-size: 1.65rem;
      }

      .messages {
        display: flex;
        flex: 1;
        flex-direction: column;
        gap: 1rem;
        overflow-y: auto;
        padding: 1.5rem;
      }

      .empty {
        max-width: 28rem;
        margin: auto;
        color: #64748b;
        text-align: center;
      }

      .message {
        max-width: 85%;
        padding: .8rem 1rem;
        border-radius: 1rem;
        background: #f1f5f9;
      }

      .message[data-role="user"] {
        align-self: flex-end;
        background: #e9f0ff;
      }

      .message strong {
        display: block;
        margin-bottom: .3rem;
        color: #475569;
        font-size: .95rem;
      }

      .message p {
        margin: 0;
        white-space: pre-wrap;
        overflow-wrap: anywhere;
      }

      form {
        padding: 1rem 1.5rem 1.4rem;
        border-top: 1px solid #e7ecf1;
      }

      label {
        display: block;
        margin-bottom: .4rem;
        color: #475569;
        font-size: 1rem;
      }

      textarea {
        width: 100%;
        min-height: 5rem;
        box-sizing: border-box;
        resize: vertical;
        padding: .7rem;
        border: 1px solid #cbd5e1;
        border-radius: .65rem;
        font: inherit;
      }

      .footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        margin-top: .6rem;
      }

      .status {
        color: #64748b;
        font-size: 1rem;
      }

      aui-button {
        font-size: inherit;
      }

      button:disabled {
        opacity: .45;
        cursor: not-allowed;
      }
    `;
  }
  static validateData(data) {
    return validateChatData(data);
  }
  connectedCallback() {
    super.connectedCallback();
    if (!this.#mounted) {
      this.#mount();
      this.applyData(this.dataFromAttributes());
    }
  }
  attributeChangedCallback(_name, oldValue, newValue) {
    if (oldValue !== newValue && this.isConnected && this.#mounted && !this.#applyingData) {
      this.applyData(this.dataFromAttributes());
    }
  }
  applyData(data) {
    this.#data = data;
    this.#ensureMarkup();
    this.#applyingAttributes(() => {
      this.setAttributeIfChanged("title", data.title);
      this.setAttributeIfChanged("agent-label", data.agentLabel);
      this.setAttributeIfChanged("user-label", data.userLabel);
      this.setAttributeIfChanged("input-label", data.inputLabel);
      this.setAttributeIfChanged("send-label", data.sendLabel);
      this.setAttributeIfChanged("placeholder", data.placeholder);
      this.setAttributeIfChanged("empty-message", data.emptyMessage);
    });
    const heading = this.querySelector("h1");
    if (heading) heading.textContent = data.title;
    const label = this.querySelector("label");
    if (label) label.textContent = data.inputLabel;
    const textarea = this.querySelector("textarea");
    if (textarea) {
      textarea.placeholder = data.placeholder;
      textarea.maxLength = 6e3;
    }
    const button = this.querySelector("aui-button");
    if (button) {
      button.setAttribute("label", data.sendLabel);
      button.setAttribute("type", "submit");
    }
    const empty = this.querySelector(".empty");
    if (empty) empty.textContent = data.emptyMessage;
    this.#updateButton();
  }
  /**
   * Reflect transport state without sending or retrying. A true pending flag
   * latches the outstanding request; false does not clear it on reconnection.
   * receiveMessage() or reject() clears the component's pending state.
   */
  setConnection(connected, pending = false) {
    this.#connected = connected;
    if (pending) this.#pending = true;
    this.setStatus(
      connected ? this.#pending ? "Waiting for the outstanding reply\u2026" : "Connected \xB7 replies arrive here" : "Disconnected \xB7 no automatic resend"
    );
  }
  /** Disables explicit Send while the existing Pi session is busy. */
  setAgentBusy(busy) {
    this.#agentBusy = busy;
    if (this.#connected) {
      this.setStatus(
        this.#pending ? "Waiting for the outstanding reply\u2026" : busy ? "Agent is busy in the existing session \xB7 Send will enable when ready" : "Connected \xB7 replies arrive here"
      );
    } else {
      this.#updateButton();
    }
  }
  setStatus(text) {
    this.#ensureMarkup();
    const status = this.querySelector(".status");
    if (status) status.textContent = text;
    this.#updateButton();
  }
  /**
   * Add the outgoing text to the local log and clear the composer after dispatch.
   * This is not proof of remote receipt or admission. Call once per dispatch;
   * repeated calls append duplicate log entries.
   */
  markSent() {
    if (this.#outgoing === void 0) return;
    this.addMessage("user", this.#outgoing);
    const textarea = this.querySelector("textarea");
    if (textarea) textarea.value = "";
    this.setStatus("Sent \xB7 awaiting reply\u2026");
  }
  /**
   * Clear pending state and restore outgoing text only if the composer is empty.
   * Existing log entries remain; this neither retracts nor retries a remote send.
   */
  reject(text) {
    this.#pending = false;
    const textarea = this.querySelector("textarea");
    if (textarea && !textarea.value && this.#outgoing !== void 0) {
      textarea.value = this.#outgoing;
    }
    this.setStatus(text);
  }
  /**
   * Accept a component payload, not a bridge envelope. The caller owns routing and
   * correlation. Valid and invalid payloads both end the local pending request;
   * invalid payloads display an error without retrying or adding a message.
   */
  receiveMessage(payload) {
    if (!isChatReplyPayload(payload)) {
      this.#pending = false;
      this.#outgoing = void 0;
      this.setStatus("Reply payload is invalid for Chat \xB7 no automatic resend");
      return;
    }
    this.addMessage("agent", payload.text);
    this.#pending = false;
    this.#outgoing = void 0;
    this.setStatus("Reply received \xB7 ready for your next message");
  }
  /** Adds a literal text message to the conversation log. */
  addMessage(role, text) {
    this.#ensureMarkup();
    const area = this.querySelector(".messages");
    if (!area) return;
    area.querySelector(".empty")?.remove();
    const message = document.createElement("article");
    message.className = "message";
    message.setAttribute("data-role", role);
    const label = document.createElement("strong");
    label.textContent = role === "user" ? this.#data.userLabel : this.#data.agentLabel;
    const content = document.createElement("p");
    content.textContent = text;
    message.append(label, content);
    area.append(message);
    area.scrollTop = area.scrollHeight;
  }
  #mount() {
    this.#mounted = true;
    this.#ensureMarkup();
    if (this.#bound) return;
    this.#bound = true;
    const form = this.querySelector("form");
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      this.#submit();
    });
  }
  #submit() {
    if (!this.#connected || this.#pending || this.#agentBusy) return;
    const textarea = this.querySelector("textarea");
    const text = textarea?.value.trim() ?? "";
    if (!text) return;
    this.#pending = true;
    this.#outgoing = text;
    this.setStatus("Sending\u2026");
    this.dispatchEvent(new CustomEvent("agent-message", {
      bubbles: true,
      composed: true,
      detail: {
        text,
        context: { componentId: this.id || "chat" }
      }
    }));
  }
  #ensureMarkup() {
    if (this.querySelector(".messages") && this.querySelector("form")) return;
    const header = document.createElement("header");
    const heading = document.createElement("h1");
    header.append(heading);
    const area = document.createElement("section");
    area.className = "messages";
    area.setAttribute("role", "log");
    area.setAttribute("aria-label", "Conversation");
    area.setAttribute("aria-live", "polite");
    const empty = document.createElement("p");
    empty.className = "empty";
    area.append(empty);
    const form = document.createElement("form");
    const label = document.createElement("label");
    label.htmlFor = this.#inputId;
    label.setAttribute("for", this.#inputId);
    const textarea = document.createElement("textarea");
    textarea.id = this.#inputId;
    textarea.name = "message";
    textarea.required = true;
    textarea.maxLength = 6e3;
    const footer = document.createElement("div");
    footer.className = "footer";
    const status = document.createElement("span");
    status.className = "status";
    status.setAttribute("role", "status");
    const button = document.createElement("aui-button");
    button.setAttribute("label", this.#data.sendLabel);
    button.setAttribute("type", "submit");
    footer.append(status, button);
    form.append(label, textarea, footer);
    this.append(header, area, form);
  }
  #updateButton() {
    const disabled = !this.#connected || this.#pending || this.#agentBusy;
    const nativeButton = this.querySelector("aui-button button");
    if (nativeButton) nativeButton.disabled = disabled;
    const button = this.querySelector("aui-button");
    if (button) button.setAttribute("aria-disabled", String(disabled));
  }
  #applyingAttributes(callback) {
    this.#applyingData = true;
    try {
      callback();
    } finally {
      this.#applyingData = false;
    }
  }
  dataFromAttributes() {
    return validateChatData({
      title: this.getAttribute("title") ?? void 0,
      agentLabel: this.getAttribute("agent-label") ?? void 0,
      userLabel: this.getAttribute("user-label") ?? void 0,
      inputLabel: this.getAttribute("input-label") ?? void 0,
      sendLabel: this.getAttribute("send-label") ?? void 0,
      placeholder: this.getAttribute("placeholder") ?? void 0,
      emptyMessage: this.getAttribute("empty-message") ?? void 0
    });
  }
  setAttributeIfChanged(name, value) {
    if (this.getAttribute(name) !== value) this.setAttribute(name, value);
  }
};
function isChatReplyPayload(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value) && typeof value.text === "string";
}

// src/ui/_components/form.schema.ts
var FormDataModel = class extends Model {
};
FormDataModel.define({
  title: defineField({ initial: "" }).instance("string").assert((value) => typeof value === "string", "Form title must be text"),
  submitLabel: defineField({ initial: "Submit" }).instance("string").assert(
    (value) => typeof value === "string" && value.trim().length > 0,
    "Form submit label is required"
  ),
  fields: defineField({ required: true }).assert(Array.isArray, "Form fields are required").assert((value) => value.length > 0, "Form needs one field")
});
function validateFormData(data) {
  const base = FormDataModel.validate(data ?? {});
  const fields = base.fields.map(validateField);
  const names = /* @__PURE__ */ new Set();
  for (const field of fields) {
    if (names.has(field.name)) throw new Error(`Duplicate Form field: ${field.name}`);
    names.add(field.name);
  }
  return { title: base.title || void 0, submitLabel: base.submitLabel, fields };
}
function validateField(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Form field must be an object");
  }
  const field = value;
  if (typeof field.name !== "string" || !field.name.trim() || typeof field.label !== "string" || !field.label.trim() || typeof field.required !== "boolean") {
    throw new Error("Form field identity, label, and required flag are required");
  }
  if (field.kind === "choice") {
    if (!Array.isArray(field.choices) || field.choices.length === 0) {
      throw new Error(`Choices are required for ${field.name}`);
    }
    const choices = field.choices.map((choice) => {
      if (!choice || typeof choice !== "object" || Array.isArray(choice)) {
        throw new Error(`Choice is invalid for ${field.name}`);
      }
      const item = choice;
      if (typeof item.value !== "string" || !item.value || typeof item.label !== "string" || !item.label.trim()) {
        throw new Error(`Choice value and label are required for ${field.name}`);
      }
      return { value: item.value, label: item.label };
    });
    return {
      name: field.name,
      kind: "choice",
      label: field.label,
      required: field.required,
      choices
    };
  }
  if (field.kind === "text") {
    const rawMinLength = field.minLength;
    const rawMaxLength = field.maxLength;
    const minLength = rawMinLength === void 0 ? void 0 : typeof rawMinLength === "number" ? rawMinLength : Number.NaN;
    const maxLength = rawMaxLength === void 0 ? void 0 : typeof rawMaxLength === "number" ? rawMaxLength : Number.NaN;
    if (minLength !== void 0 && (!Number.isInteger(minLength) || minLength < 0)) {
      throw new Error(`Minimum text length is invalid for ${field.name}`);
    }
    if (maxLength !== void 0 && (!Number.isInteger(maxLength) || maxLength < 0)) {
      throw new Error(`Maximum text length is invalid for ${field.name}`);
    }
    if (minLength !== void 0 && maxLength !== void 0 && minLength > maxLength) {
      throw new Error(`Text bounds are invalid for ${field.name}`);
    }
    return {
      name: field.name,
      kind: "text",
      label: field.label,
      required: field.required,
      ...minLength === void 0 ? {} : { minLength },
      ...maxLength === void 0 ? {} : { maxLength }
    };
  }
  throw new Error(`Unsupported Form field kind for ${field.name}`);
}

// src/ui/_components/form.ts
var Form = class extends Base {
  #form = null;
  static {
    this.css = `
      display: block;

      form {
        display: grid;
        gap: 1rem;
      }

      fieldset {
        display: grid;
        gap: 0.75rem;
        min-inline-size: 0;
        margin: 0;
        padding: 0;
        border: 0;
      }

      legend {
        margin-block-end: 0.5rem;
        font-weight: 700;
      }

      label {
        display: grid;
        gap: 0.35rem;
      }

      input[type="text"] {
        min-height: 2.25rem;
        box-sizing: border-box;
        padding: 0.4rem 0.55rem;
        border: 1px solid #94a3b8;
        border-radius: 0.35rem;
        color: inherit;
        font: inherit;
      }

      .choice-group {
        display: grid;
        gap: 0.35rem;
      }

      .choice {
        display: flex;
        grid-template-columns: auto 1fr;
        align-items: center;
        gap: 0.45rem;
      }

      button {
        min-height: 2.5rem;
        border: 0;
        border-radius: 0.35rem;
        padding: 0.5rem 0.85rem;
        background: #2563eb;
        color: white;
        font: inherit;
        cursor: pointer;
      }
    `;
  }
  static validateData(data) {
    return validateFormData(data);
  }
  connectedCallback() {
    super.connectedCallback();
    const data = this.dataFromAttributes();
    if (data) this.applyData(data);
  }
  /**
   * Rebuild the form from validated data. Existing input values are discarded;
   * callers needing draft preservation must capture and restore them separately.
   */
  applyData(data) {
    const form = this.ensureForm();
    form.replaceChildren();
    if (data.title) {
      const legend = document.createElement("legend");
      legend.textContent = data.title;
      form.append(legend);
    }
    const fieldset = document.createElement("fieldset");
    for (const field of data.fields) fieldset.append(this.renderField(field));
    form.append(fieldset);
    const submit = document.createElement("button");
    submit.type = "submit";
    submit.textContent = data.submitLabel;
    form.append(submit);
  }
  ensureForm() {
    if (!this.#form) {
      const existing = this.querySelector(":scope > form");
      this.#form = existing instanceof HTMLFormElement ? existing : document.createElement("form");
      if (!existing) this.append(this.#form);
      this.#form.addEventListener("submit", (event) => {
        event.preventDefault();
        const values = {};
        for (const element of this.#form?.elements ?? []) {
          if (!(element instanceof HTMLInputElement) || !element.name) continue;
          if (element.type === "radio" && !element.checked) continue;
          values[element.name] = element.value;
        }
        this.dispatchEvent(new CustomEvent("aui-form-submit", {
          bubbles: true,
          detail: { values }
        }));
      });
    }
    return this.#form;
  }
  renderField(field) {
    if (field.kind === "choice") {
      const group = document.createElement("div");
      group.className = "choice-group";
      const label2 = document.createElement("span");
      label2.textContent = field.label;
      group.append(label2);
      for (const choice of field.choices) {
        const option = document.createElement("label");
        option.className = "choice";
        const input2 = document.createElement("input");
        input2.type = "radio";
        input2.name = field.name;
        input2.value = choice.value;
        input2.required = field.required;
        const text = document.createElement("span");
        text.textContent = choice.label;
        option.append(input2, text);
        group.append(option);
      }
      return group;
    }
    const label = document.createElement("label");
    label.textContent = field.label;
    const input = document.createElement("input");
    input.type = "text";
    input.name = field.name;
    input.required = field.required;
    if (field.minLength !== void 0) input.minLength = field.minLength;
    if (field.maxLength !== void 0) input.maxLength = field.maxLength;
    label.append(input);
    return label;
  }
  dataFromAttributes() {
    const fields = this.getAttribute("fields");
    if (!fields) return void 0;
    return validateFormData({
      title: this.getAttribute("title") ?? void 0,
      submitLabel: this.getAttribute("submit-label") ?? void 0,
      fields: JSON.parse(fields)
    });
  }
};
export {
  Base,
  Button,
  Card,
  Chat,
  Form,
  component,
  html,
  nextTick,
  onCleanup,
  reactive,
  validateChatData
};
