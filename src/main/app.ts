import 'reflect-metadata';
import { ValidationError, validateOrReject } from 'class-validator';
import { container } from 'tsyringe';
import { AppContainer } from '@/main/container/app-container';
import { HttpServer } from '@/main/modules/http/http-server';
import { Module } from '@/main/modules/modules';
import { AMQPServer } from '@/main/modules/amqp/amqp-server';
import { env } from '@/main/env';
import { CacheClient } from './modules/cache/cache-client';

export class Application {
  protected httpServer?: HttpServer;

  protected loadModules(container: AppContainer): Module[] {
    return [new CacheClient(container), new HttpServer(container)];
  }

  async start() {
    await validateOrReject(env);
    const appContainer = new AppContainer(container);
    for (const module of this.loadModules(appContainer)) {
      if (!appContainer.isLoaded) appContainer.loadContainer();
      await module.start();
    }
  }

  throwEnvValidatorErrors(err: ValidationError[]) {
    err.forEach((item: ValidationError) => {
      for (const key in item.constraints) {
        if (key) {
          const message = item.constraints[key];
          throw new Error(message);
        }
      }
    });
  }
}
