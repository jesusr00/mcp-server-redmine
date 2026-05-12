export interface MyAccountCustomField {
  id: number;
  name: string;
  value: string;
}

export interface MyAccount {
  id: number;
  login: string;
  admin: boolean;
  firstname: string;
  lastname: string;
  mail: string;
  created_on: string;
  last_login_on?: string;
  custom_fields?: MyAccountCustomField[];
}
