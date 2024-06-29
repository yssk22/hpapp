export class ErrUPFCAuthentication extends Error {
  constructor() {
    super('failed to authenticate');
  }
}

export class ErrUPFCNoCredential extends Error {
  constructor() {
    super('no credential is set');
  }
}

export class ErrUPFCInvalidStatusCode extends Error {
  constructor() {
    super('up-fc.jp returned non 200 response');
  }
}
