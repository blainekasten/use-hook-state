# `use-hook-state`

Use React hooks as an encapsulation for "global" application state.

Here is a basic example of creating an incrementor that allows other components to increment it's values up to 100 and then it will maintain it's own state to reset to 0. The `Provider` should be installed at the root of the app, and the `usePercentCounter` can be used in _any_ other component, _regardless_ of depth, or relation to the `Provider`.

```jsx
// src/state/percent-counter.js
import { createState } from 'use-hook-state'

const DEFAULT_VALUES = {
  value: 0,
  incrementor: () => {},
}

const store = createState(DEFAULT_VALUES, () => {
  const [value, setValue] = useState(0)

  // cap incrementor at 100 and start over.
  useEffect(() => {
    if (value >= 100) {
      setValue(0)
    }
  }, [value])

  return {
    value,
    increment: () => setValue((n) => n + 1),
  }
})

export const usePercentCounter = store.useState
export const PercentCounterProvider = store.Provider
```

## License

[MIT](LICENSE.md)
