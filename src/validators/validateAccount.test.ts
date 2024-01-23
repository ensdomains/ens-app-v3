import { validateAccount } from './validateAccount';

describe('validateAccount', () => {
  // Twitter tests
  it('should return true for valid twitter username', () => {
    expect(validateAccount({ key: 'com.twitter', value: 'valid_username' })).toBe(true);
  });

  it('should return false for invalid twitter username', () => {
    expect(validateAccount({ key: 'com.twitter', value: 'invalid_username!' })).toBe(false);
  });

  it('returns false for invalid twitter username with spaces', () => {
    expect(validateAccount({ key: 'com.twitter', value: 'bad twitter' })).toBe(false);
  });

  it('returns false for invalid twitter username with special chars', () => {
    expect(validateAccount({ key: 'com.twitter', value: 'bad@twitter' })).toBe(false);
  });

  it('returns true for max length twitter username', () => {
    expect(validateAccount({ key: 'com.twitter', value: 'a'.repeat(15) })).toBe(true);
  });

  it('returns false for too long twitter username', () => {
    expect(validateAccount({ key: 'com.twitter', value: 'a'.repeat(16) })).toBe(false);
  });

  it('returns true for twitter username with 1 character', () => {
    expect(validateAccount({ key: 'com.twitter', value: 'a' })).toBe(true);
  });
  
  it('returns true for twitter username with mixed case', () => {
    expect(validateAccount({ key: 'com.twitter', value: 'Valid_User' })).toBe(true);
  });
  

  // GitHub tests
  it('should return true for valid github username', () => {
    expect(validateAccount({ key: 'com.github', value: 'valid-username' })).toBe(true);
  });

  it('should return false for invalid github username', () => {
    expect(validateAccount({ key: 'com.github', value: 'invalid_username' })).toBe(false);
  });

  it('returns false for invalid github username starting with hyphen', () => {
    expect(validateAccount({ key: 'com.github', value: '-badgithub' })).toBe(false);
  });

  it('returns false for invalid github username with consecutive hyphens', () => {
    expect(validateAccount({ key: 'com.github', value: 'bad--github' })).toBe(false);
  });

  it('returns true for max length github username', () => {
    expect(validateAccount({ key: 'com.github', value: 'a'.repeat(39) })).toBe(true);
  });

  it('returns false for too long github username', () => {
    expect(validateAccount({ key: 'com.github', value: 'a'.repeat(40) })).toBe(false);
  });

  it('returns true for github username ending with hyphen', () => {
    expect(validateAccount({ key: 'com.github', value: 'valid-' })).toBe(true);
  });

  it('returns true for single-character github username', () => {
    expect(validateAccount({ key: 'com.github', value: 'a' })).toBe(true);
  });
  
  it('returns true for github username with mixed case', () => {
    expect(validateAccount({ key: 'com.github', value: 'Valid-Username' })).toBe(true);
  });
  

  // Discord tests
  it('should return true for valid discord username', () => {
    expect(validateAccount({ key: 'com.discord', value: 'valid_username' })).toBe(true);
  });

  it('returns false for discord username shorter than min length', () => {
    expect(validateAccount({ key: 'com.discord', value: 'a' })).toBe(false);
  });

  it('returns false for discord username with consecutive periods', () => {
    expect(validateAccount({ key: 'com.discord', value: 'bad..discord' })).toBe(false);
  });

  it('returns true for max length discord username', () => {
    expect(validateAccount({ key: 'com.discord', value: 'a'.repeat(32) })).toBe(true);
  });

  it('returns false for too long discord username', () => {
    expect(validateAccount({ key: 'com.discord', value: 'a'.repeat(33) })).toBe(false);
  });

  it('returns false for discord username with underscore and dash', () => {
    expect(validateAccount({ key: 'com.discord', value: 'valid_username-123' })).toBe(false);
  });
  
  it('returns false for discord username with mixed case', () => {
    expect(validateAccount({ key: 'com.discord', value: 'Valid_Username' })).toBe(false);
  });  

  // Telegram tests
  it('should return true for valid telegram username', () => {
    expect(validateAccount({ key: 'org.telegram', value: 'valid_username' })).toBe(true);
  });

  it('should return false for invalid telegram username', () => {
    expect(validateAccount({ key: 'org.telegram', value: 'invalid_username!' })).toBe(false);
  });

  it('returns false for telegram username shorter than min length', () => {
    expect(validateAccount({ key: 'org.telegram', value: 'a'.repeat(4) })).toBe(false);
  });

  it('returns true for max length telegram username', () => {
    expect(validateAccount({ key: 'org.telegram', value: 'a'.repeat(32) })).toBe(true);
  });

  it('returns false for too long telegram username', () => {
    expect(validateAccount({ key: 'org.telegram', value: 'a'.repeat(33) })).toBe(false);
  });

  it('returns true for telegram username with mixed case', () => {
    expect(validateAccount({ key: 'org.telegram', value: 'Valid_Username' })).toBe(true);
  });
  
  it('returns true for telegram username with only underscores', () => {
    expect(validateAccount({ key: 'org.telegram', value: '_____' })).toBe(true);
  });
  

  // Email tests
  it('should return true for valid email', () => {
    expect(validateAccount({ key: 'email', value: 'test@example.com' })).toBe(true);
  });

  it('should return false for invalid email', () => {
    expect(validateAccount({ key: 'email', value: 'invalid_email' })).toBe(false);
  });

  it('returns false for email without @', () => {
    expect(validateAccount({ key: 'email', value: 'bademail.com' })).toBe(false);
  });

  it('returns false for email without domain', () => {
    expect(validateAccount({ key: 'email', value: 'bad@email' })).toBe(false);
  });

  // Test for unknown key
  it('should return true for unknown key', () => {
    expect(validateAccount({ key: 'unknown', value: 'value' })).toBe(true);
  });
});
