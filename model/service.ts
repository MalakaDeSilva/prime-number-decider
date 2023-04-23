export type ServiceType = {
  id: string;
  uri: string;
  role: string;
};

export class Service implements ServiceType {
  id: string;
  uri: string;
  role: string;

  constructor(id: string, uri: string, role: string) {
    this.id = id;
    this.uri = uri;
    this.role = role;
  }
}
