export class Logger {
  service: string;

  constructor(service: string) {
    this.service = service;
  }

  log(target: string, route: string, time = Date.now()) {
    console.log(`${this.service} - ${target} - ${route} - ${time}`);
  }
}
