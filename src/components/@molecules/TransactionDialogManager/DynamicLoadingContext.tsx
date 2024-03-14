import { createContext, Dispatch, SetStateAction } from 'react'

const DynamicLoadingContext = createContext<Dispatch<SetStateAction<boolean>>>(() => {})

export default DynamicLoadingContext
