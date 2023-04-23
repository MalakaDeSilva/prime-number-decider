export function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function extractUri(host: string, port: number) {
  let _host = host == "::" ? "127.0.0.1" : host;

  return `http://${_host}:${port}`;
}
