import * as dotenv from 'dotenv';
import { EnvValidator } from './validator';

dotenv.config();

const props = {
  httpPort: parseInt(process.env.HTTP_PORT || '3000', 10),
  httpBodyLimit: process.env.HTTP_BODY_LIMIT || '10kb',
  jsonPlaceholderUrl:
    process.env.JSON_PLACEHOLDER_URL || 'https://jsonplaceholder.typicode.com',
  rabbitMQEnabled: process.env.RABBITMQ_ENABLED || 'false',
  rabbitMQProtocol: process.env.RABBITMQ_PROTOCOL || 'amqp',
  rabbitMQHost: process.env.RABBITMQ_HOST || 'localhost',
  rabbitMQPort: parseInt(process.env.RABBITMQ_PORT || '5672', 10),
  rabbitMQUsername: process.env.RABBITMQ_USERNAME || 'admin',
  rabbitMQPassword: process.env.RABBITMQ_PASSWORD || 'admin',
  rabbitMQVHost: process.env.RABBITMQ_VHOST || '/',
  redisPort: parseInt(process.env.REDIS_PORT || '6379', 10),
  redisHost: process.env.REDIS_HOST || '',
  jwtSecret: process.env.JWT_SECRET || '',
};

export const env = new EnvValidator(props);
