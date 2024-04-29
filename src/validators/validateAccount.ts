/*  twitter:
 *  - 1-15 chars
 *    - technically 4-15 for new users but existing usernames can be shorter
 *  - case sensitive alphanumeric + underscore
 */
const twitterRegex = /^[A-Za-z0-9_]{1,15}$/

/*  github:
 *  - 1-39 chars
 *  - case insensitive alphanumeric + hyphen
 *  - cannot start with hyphen
 *  - cannot have consecutive hyphens
 *  - cannot end with hyphen for new users, but existing usernames can
 */
const githubRegex = /^[a-z\d](?:[a-z\d]-?){0,38}$/i

/*  discord:
 *  - 2-32 chars
 *  - case insensitive alphanumeric + underscore + dash
 *  - cannot use consecutive periods
 */
const discordRegex = /^(?!.*\.\.)[a-z0-9_.]{2,32}$/

/*  telegram:
 *  - 5-32 chars
 *  - case sensitive alphanumeric + underscore
 */
const telegramRegex = /^[A-Za-z0-9_]{5,32}$/

/*  email:
 *  - basic non-greedy regex
 */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/*  farcaster:
 *  - 1-16 chars
 *  - case insensitive alphanumeric + hyphen
 *    - insensitive but we don't have a way to normalise case in the profile editor so we enforce lowercase
 *  - cannot start with hyphen
 */
const farcasterRegex = /^[a-z0-9][a-z0-9-]{0,15}$/

const validateFarcaster = (value: string): boolean => {
  // farcaster only supports 2LD .eth currently!
  if (value.endsWith('.eth')) {
    const label = value.slice(0, -4)
    // 2LD .eth only can only currently be registered with 3+ chars
    if (label.length < 3) return false
    // label doesn't need to be normalised or anything
    // because the farcaster regex fits into ens name normalisation
    // the regex also ensures that subdomains aren't being used
    return farcasterRegex.test(label)
  }
  return farcasterRegex.test(value)
}

export const validateAccount = ({ key, value }: { key: string; value: string }): boolean => {
  switch (key) {
    case 'email':
      return emailRegex.test(value)
    case 'com.discord':
      return discordRegex.test(value)
    case 'com.github':
      return githubRegex.test(value)
    case 'com.twitter':
      return twitterRegex.test(value)
    case 'eth.farcaster':
      return validateFarcaster(value)
    case 'org.telegram':
      return telegramRegex.test(value)
    default:
      return true
  }
}
