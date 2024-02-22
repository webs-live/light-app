export interface IPublicParams {
  userId: string;
  token: string;
  appId: string;
  deviceId: string;
  roles: string | string[];
}

export interface IPubliceEnv {
  dev_url: string;
  pro_url: string;
  test_url?: string;
}
