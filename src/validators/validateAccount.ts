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
const githubRegex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}(-?)?$/i

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

export const validateAccount = ({ key, value }: { key: string; value: string }): boolean => {
  switch (key) {
    case 'com.twitter':
      return twitterRegex.test(value)
    case 'com.github':
      return githubRegex.test(value)
    case 'com.discord':
      return discordRegex.test(value)
    case 'org.telegram':
      return telegramRegex.test(value)
    case 'email':
      return emailRegex.test(value)
    default:
      return true
  }
}
