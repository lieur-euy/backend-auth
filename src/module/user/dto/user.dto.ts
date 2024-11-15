export class UserSaveInput {
    id?: number;
    email: string;
    password: string;
    refresh_token?: string;
    last_refresh_time?: Date;
    role_id?: number;
  }
  