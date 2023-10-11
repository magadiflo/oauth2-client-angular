export interface Token {
  access_token:  string;
  refresh_token: string;
  scope:         string;
  id_token:      string;
  token_type:    string;
  expires_in:    number;
}

export const ACCESS_TOKEN: string = 'access_token';
export const REFRESH_TOKEN: string = 'refresh_token';
export const CODE_VERIFIER: string = 'code_verifier';
