import { useEffect, useState } from 'react'

const useLocalStorage = <ValueType>(key: string, initialValue: ValueType | null = null): [ValueType | null, React.Dispatch<React.SetStateAction<ValueType | null>>] => {
  const [value, setValue] = useState<ValueType | null>(() => {
    if (initialValue !== null) {
      return initialValue
    }

    const currentlyStoredValue = localStorage.getItem(key)
    if (currentlyStoredValue !== null) {
      return JSON.parse(currentlyStoredValue) as ValueType
    }

    return null
  })
  const [cachedStringValue, setCachedStringValue] = useState<string>('')

  useEffect(() => {
    if (value !== null) {
      const stringData = JSON.stringify(value)
      localStorage.setItem(key, stringData)
    }
  }, [value])

  useEffect(() => {
    const currentlyStoredValue = localStorage.getItem(key)
    if (currentlyStoredValue !== null && currentlyStoredValue !== cachedStringValue) {
      const newValue: unknown = JSON.parse(currentlyStoredValue)
      // TODO: Add some validation for the type of the newValue
      setValue(newValue as ValueType)
      setCachedStringValue(currentlyStoredValue)
    }
  })

  return [value, setValue]
}

export default useLocalStorage
