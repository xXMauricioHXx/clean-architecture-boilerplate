import { Channel, Options } from 'amqplib';
import { converter } from '@/shared/helper';

export abstract class Producer {
  protected abstract channel: Channel;

  publish(
    exchange: string,
    routingKey: string,
    message: object,
    additionalParams?: Options.Publish
  ): void {
    try {
      this.channel.publish(
        exchange || '',
        routingKey,
        converter(message),
        additionalParams
      );
    } catch (err) {
      throw Error(
        `Error Posting Message to RabbitMQ Server - cause ${err.message}`
      );
    }
  }
}
