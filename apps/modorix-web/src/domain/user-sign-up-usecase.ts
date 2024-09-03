const atLeastOneUppercase = '(?=.*[A-Z])';
const atLeastOneLowercase = '(?=.*[a-z\u00C0-\u024F\u1E00-\u1EFF])';
const atLeastOneDigit = '(?=.*\\d)';
const atLeastOneOfEachWithOptionalSpecialCharacter = '[A-Za-z\u00C0-\u024F\u1E00-\u1EFF\\d\\W]+';
export const passwordCharactersRegexp = new RegExp(
  `^${atLeastOneUppercase}${atLeastOneLowercase}${atLeastOneDigit}${atLeastOneOfEachWithOptionalSpecialCharacter}$`,
);
