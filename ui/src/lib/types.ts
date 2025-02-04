export interface TableData {
  id: number;
  name: string;
  email: string;
}

export type Token = {
  address: string;
  name: string;
  symbol: string;
  token_type: string;
  is_registered: boolean;
};
