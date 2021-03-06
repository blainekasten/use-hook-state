import { useEffect, useState } from 'react'

type Hook<State> = () => State
type Responders<State> = Array<(newState: State) => void>

type HookState<State> = {
  useState(): State
  Provider: {
    (): null
    setDefaultValue(newDefaultValue: State): void
  }
}

export function createState<State>(
  defaultValue: State,
  useHook: Hook<State>
): HookState<State> {
  let initialValue = defaultValue
  let unmounted = false
  let responders: Responders<State> = []

  function Provider(): null {
    unmounted = false
    let value = useHook()
    initialValue = value

    useEffect(() => {
      return () => {
        unmounted = true
      }
    }, [])

    responders.forEach((r) => r(value))

    return null
  }

  // This is a testing utility. Should probably lock it down to be only in test.
  // @ts-ignore
  Provider.setDefaultValue((newDefaultValue: State): void => {
    initialValue = newDefaultValue
  })

  // Public API
  return {
    // @ts-ignore
    Provider,
    useState(): State {
      if (unmounted) {
        throw new Error('Cannot get state from unmounted Provider')
      }

      const [state, setState] = useState(initialValue)

      useEffect(() => {
        const updator = (newState: State) => {
          setTimeout(() => setState(newState), 1)
        }

        responders.push(updator)

        return () => {
          responders.splice(responders.indexOf(updator), 1)
        }
      }, [])

      return state
    },
  }
}
