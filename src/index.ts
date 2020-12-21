import { useEffect, useState } from 'react'

type Hook<State> = () => State
type Responders<State> = Array<(newState: State) => void>

export function createState<State>(initialValue: State, useHook: Hook<State>) {
  let unmounted = false
  let responders: Responders<State> = []

  return {
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
    Provider(): null {
      unmounted = false

      useEffect(() => {
        return () => {
          unmounted = true
        }
      }, [])

      let value = useHook()
      responders.forEach((r) => r(value))

      return null
    },
  }
}
