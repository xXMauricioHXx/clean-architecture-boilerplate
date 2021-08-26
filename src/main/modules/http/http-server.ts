import helmet from 'helmet';
import bodyParser from 'body-parser';
import compression from 'compression';
import express, { Router } from 'express';
import { logger } from '@/logger';
import i18n from '@/presentation/i18n';
import { Module } from '@/main/modules/modules';
import { env } from '@/main/env';
import {
  ListUsersByIdController,
  ListUsersController,
  LoginByUsernameController,
} from '@/presentation/http/controllers/v1';
import { BaseHttp } from '@/main/modules/http/base-http';
import { AppContainer } from '@/main/container/app-container';
import { NotFoundError } from '@/presentation/http/exceptions';

export class HttpServer extends BaseHttp implements Module {
  protected app: express.Application;

  constructor(protected readonly appContainer: AppContainer) {
    super(appContainer.getContainer());
  }

  protected loadControllers(): Function[] {
    return [
      ListUsersByIdController,
      ListUsersController,
      LoginByUsernameController,
    ];
  }

  start(): void {
    const app = express();
    const router = Router({ mergeParams: true });
    const buildedRoutes = this.buildRoutes(router);

    app.set('trust proxy', true);
    app.use(helmet());
    app.use(i18n.init);
    app.use(compression());
    app.use(
      bodyParser.json({
        limit: env.httpBodyLimit,
      })
    );

    router.get(
      ['/info', '/status'],
      async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        try {
          res.sendStatus(204);
        } catch (err) {
          next(err);
        }
      }
    );

    app.use(buildedRoutes);

    app.use(
      '*',
      (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        next(new NotFoundError('PAGE_NOT_FOUND', 'Page not found.'));
      }
    );
    const errorHandler = this.errorHandler() as any;
    app.use(errorHandler);

    app.listen(env.httpPort, () =>
      logger.info(`Server running on port ${env.httpPort}`)
    );
    this.app = app;
  }
}
