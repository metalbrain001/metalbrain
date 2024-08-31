import crypto from 'crypto';

export function generateHash(str: string): string {
  return crypto.createHash('md5').update(str).digest('hex');
}

export function generateAvatarUrl(firstName: string, lastName: string): string {
  const initials = (firstName + ' ' + lastName)
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .join('');

  const size = 200;
  const bacjgroundColor = 'random';
  const textcolor = 'fff';
  const font = 'arial';
  const baseUrl = `https://ui-avatars.com/api/?name=${initials}&size=${size}&background=${bacjgroundColor}&color=${textcolor}&font-family=${font}`;
  return baseUrl;
}
