import { useLocalStorage } from '@app/hooks/useLocalStorage'
import { UserConfig, UserCurrency, UserFiat, UserTheme } from '@app/types'

const useUserConfig = () => {
  const [userConfig, setUserConfig] = useLocalStorage<UserConfig>('userConfig', {
    theme: 'light',
    fiat: 'usd',
    currency: 'eth',
  })

  const setTheme = (theme: UserTheme) => setUserConfig((prev) => ({ ...prev, theme }))
  const setFiat = (fiat: UserFiat) => setUserConfig((prev) => ({ ...prev, fiat }))
  const setCurrency = (currency: UserCurrency) => setUserConfig((prev) => ({ ...prev, currency }))

  return { userConfig, setTheme, setFiat, setCurrency }
}

export default useUserConfig
