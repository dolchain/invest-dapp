
import crypto from 'crypto'

export const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    'http://localhost:3000/';
  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`;
  // Make sure to including trailing `/`.
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
  return url;
};

export const toDateTime = (secs: number) => {
  var t = new Date('1970-01-01T00:30:00Z'); // Unix epoch start.
  t.setSeconds(secs);
  return t;
};

export const reduceAddress = (str: string): string => {
  return str == null ? "" : str.substring(0, 12).concat("...").concat(str.slice(-6));
}
export const reduceHash = (str: string): string => {
  return str == null ? "" : str.substring(0, 16).concat("...");
}

//Encrypting text
export function encrypt(text: string) {
  let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(process.env.ENCRYPT_KEY!, 'hex'), Buffer.from(process.env.ENCRYPT_IV!, 'hex'));
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString('hex');
}

// Decrypting text
export function decrypt(encryptedData: string) {
  let iv = Buffer.from(process.env.ENCRYPT_IV!, 'hex');
  let encryptedText = Buffer.from(encryptedData, 'hex');
  let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(process.env.ENCRYPT_KEY!, 'hex'), Buffer.from(process.env.ENCRYPT_IV!, 'hex'));
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
