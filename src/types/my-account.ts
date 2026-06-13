import type { CustomField } from "./params";

export interface MyAccountCustomField extends CustomField {
  name: string;
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
