# useEffect & React Lifecycle Reference

A quick-reference guide for understanding `useEffect` and how it maps to the React component lifecycle — tailored to your Task-Manager project.

---

## The Mental Model: Render → Commit → Effects

React's work happens in **three phases**:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. RENDER PHASE (pure, no side effects)                     │
│    • Your component function runs                           │
│    • JSX is created (virtual DOM)                           │
│    • React diffs against previous render                    │
│    • NO side effects allowed here                           │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. COMMIT PHASE (DOM mutations)                             │
│    • React applies changes to the real DOM                  │
│    • Runs synchronously, all at once                        │
│    • Layout effects fire HERE (useLayoutEffect)             │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. EFFECT PHASE (after paint, async)                        │
│    • Browser has painted the screen                         │
│    • useEffect callbacks run                                │
│    • Safe for: fetch, subscriptions, timers, DOM measurements│
└─────────────────────────────────────────────────────────────┘
```

---

## useEffect Syntax

```jsx
useEffect(effectFunction, dependencyArray)
```

| Dependency Array | When Effect Runs |
|------------------|------------------|
| `[]` | Once after **initial render** (mount) |
| `[a, b]` | After initial render + **when a or b changes** |
| Omitted | After **every single render** |
| `return () => {}` | Cleanup: before unmount OR before re-running effect |

---

## Your App.jsx — Explained

```jsx
// App.jsx lines 11-16
useEffect(() => {
  fetch('http://localhost:3000/api/tasks')
    .then(res => res.json())
    .then(data => setTasks(data))
    .catch(err => console.error(err))
}, [])  // ← Empty array = run once on mount
```

**What happens:**
1. Component renders with `tasks = []`
2. `useEffect` queues the fetch
3. Browser paints empty list
4. Effect runs → fetch completes → `setTasks(data)` triggers re-render
4. Component re-renders with actual tasks

**Why `[]` not omitted?** Without it, fetch would run after **every render** (infinite loop: fetch → setTasks → render → fetch...).

---

## Dependency Array Deep Dive

```jsx
const [count, setCount] = useState(0);
const [name, setName] = useState('Osceola');

useEffect(() => {
  console.log('Effect ran');
  document.title = `Count: ${count}, Name: ${name}`;
}, [count, name]);  // Runs when count OR name changes
```

**Rules:**
- Include **all values** used inside the effect that come from props/state/context
- React uses `Object.is` comparison (reference equality for objects/arrays)
- **Stale closure problem**: If you omit a dependency, the effect "sees" old values

```jsx
// ❌ BUG: count is stale inside effect
useEffect(() => {
  const id = setInterval(() => {
    console.log(count);  // Always logs initial value!
  }, 1000);
  return () => clearInterval(id);
}, []);  // Missing count!

// ✅ FIX: include count, or use functional update
useEffect(() => {
  const id = setInterval(() => {
    setCount(c => c + 1);  // Functional form doesn't need count in deps
  }, 1000);
  return () => clearInterval(id);
}, []);
```

---

## Cleanup Function

```jsx
useEffect(() => {
  const subscription = someAPI.subscribe(id, handleChange);
  
  return () => {
    subscription.unsubscribe();  // Runs before:
  };                              // 1. Component unmounts
};                                 // 2. Effect re-runs (deps changed)
```

**In your project:** If you added WebSocket subscriptions or event listeners, you'd clean them up here.

---

## useEffect vs useLayoutEffect

| | `useEffect` | `useLayoutEffect` |
|---|-------------|-------------------|
| **Timing** | After paint (async) | After DOM mutations, before paint (sync) |
| **Use for** | Fetch, subscriptions, analytics | DOM measurements, focus management, preventing visual flicker |
| **Blocking?** | No | Yes — delays paint |

```jsx
// useLayoutEffect: measure DOM before user sees it
useLayoutEffect(() => {
  const height = ref.current.getBoundingClientRect().height;
  setHeight(height);
}, []);
```

---

## Common Patterns in Your Project

### 1. Data Fetching (App.jsx)
```jsx
useEffect(() => {
  let cancelled = false;
  fetch('/api/tasks')
    .then(r => r.json())
    .then(data => { if (!cancelled) setTasks(data); });
  return () => { cancelled = true; };  // Prevent state update on unmount
}, []);
```

### 2. Syncing with LocalStorage
```jsx
useEffect(() => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}, [tasks]);  // Runs whenever tasks changes
```

### 3. Event Listeners
```jsx
useEffect(() => {
  function handleResize() { setWidth(window.innerWidth); }
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

---

## Lifecycle Mapping (Class → Hooks)

| Class Lifecycle | Hook Equivalent |
|-----------------|-----------------|
| `constructor` | `useState` initializers |
| `componentDidMount` | `useEffect(() => {...}, [])` |
| `componentDidUpdate` | `useEffect(() => {...}, [deps])` |
| `componentWillUnmount` | `useEffect(() => { return () => {...} }, [])` |
| `shouldComponentUpdate` | `React.memo` / `useMemo` / `useCallback` |
| `getSnapshotBeforeUpdate` | `useLayoutEffect` (rarely needed) |

---

## Quick Debugging Checklist

- [ ] **Infinite loop?** Missing dependency or creating new object/array in deps
- [ ] **Stale data?** Missing dependency in array
- [ ] **Memory leak?** Missing cleanup for subscriptions/timers
- [ ] **Double fetch in dev?** React 18 StrictMode mounts → unmounts → mounts (intentional; cleanup handles it)
- [ ] **Effect not running?** Dependency array has wrong reference (new object each render)

---

## For Your Task-Manager

Current `useEffect` usage in `App.jsx`:
- **Line 11-16**: Fetch tasks on mount ✓ (correct `[]` deps)
- **No other effects yet** — as you add features (auto-save, WebSocket, timers), this reference will help

---

## Further Reading

- [React Docs: useEffect](https://react.dev/learn/synchronizing-with-effects)
- [useEffect Complete Guide](https://overreacted.io/a-complete-guide-to-useeffect/) — Dan Abramov's deep dive
- [Rules of Hooks](https://react.dev/rules-of-hooks)