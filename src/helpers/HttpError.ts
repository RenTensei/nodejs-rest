export interface IHttpError {
  status: number;
  message: string;
  details: any;
}

export default class HttpError implements IHttpError {
  status: number;
  message: string;
  details: any;

  constructor(status: number, message: string, details: any = {}) {
    this.message = message;
    this.status = status;
    this.details = details;
  }
}
