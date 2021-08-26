import { RouteConfig } from '@/presentation/http/controllers/controller.config';
import { HttpRequest, HttpResponse } from '@/presentation/http/ports/http';

export abstract class Controller {
  abstract handle(req: HttpRequest): Promise<HttpResponse | void>;

  abstract exception(error: unknown): Error;

  path?: string;

  routeConfigs?: RouteConfig[];
}
