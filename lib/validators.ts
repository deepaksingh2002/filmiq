const IMDB_ID_REGEX = /^tt\d{7,8}$/;

export function isValidImdbId(value: string): boolean {
  return IMDB_ID_REGEX.test(value.trim());
}
