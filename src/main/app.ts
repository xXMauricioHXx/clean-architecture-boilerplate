import 'reflect-metadata';
import { DependencyContainer } from 'tsyringe';
import { Worker } from './modules/worker/worker';
import container from '@/main/container/app-container';
import { HttpServer } from '@/main/modules/http/http-server';
import { Module } from '@/main/modules/modules';
import { AMQPServer } from './modules/amqp/amqp-server';
import { env } from './env';
import { ValidationError, validateOrReject } from 'class-validator';

export class Application {
  protected httpServer?: HttpServer;

  protected loadModules(container: DependencyContainer): Module[] {
    return [
      new HttpServer(container),
      new Worker(container),
      new AMQPServer(container, {
        protocol: env.rabbitMQProtocol,
        host: env.rabbitMQHost,
        port: env.rabbitMQPort,
        username: env.rabbitMQUsername,
        password: env.rabbitMQPassword,
        vhost: env.rabbitMQVHost,
      }),
    ];
  }

  async start() {
    await validateOrReject(env);

    for (const module of this.loadModules(container)) {
      module.start();
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
