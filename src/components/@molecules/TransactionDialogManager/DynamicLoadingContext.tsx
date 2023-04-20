import { Dispatch, SetStateAction, createContext } from 'react'

const DynamicLoadingContext = createContext<Dispatch<SetStateAction<boolean>>>(() => {})

export default DynamicLoadingContext
