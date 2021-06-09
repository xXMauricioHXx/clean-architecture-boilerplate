import { inject, injectable } from 'tsyringe';
import { Channel, ConsumeMessage } from 'amqplib';
import { Consumer } from '@/presentation/amqp/consumers/consumer';
import { IListUsersByIdUseCase } from '@/core/useCases/listUsersById/list-users-by-id.interface';
import { FindUserMessage } from '@/presentation/amqp/consumers/findUserById/find-user-by-id.dto';
import { findUserSchema } from '@/presentation/amqp/consumers/findUserById/find-user-by-id.schema';
import { User } from '@/core/entities/user';
import { logger } from '@/logger';
import { queue, validationSchema } from '../consume.config';

@injectable()
@queue('user.find')
export class FindUserByIdConsumer extends Consumer {
  constructor(
    @inject('ListUsersByIdUseCase')
    private listUsersByIdUseCase: IListUsersByIdUseCase
  ) {
    super();
  }

  @validationSchema(findUserSchema)
  async messageHandler(message: FindUserMessage): Promise<void> {
    const user: User = await this.listUsersByIdUseCase.listById(message.id);
    
    logger.info(JSON.stringify(user));
  }

  onConsumeError(
    err: Error,
    channel: Channel,
    message: ConsumeMessage | null
  ): void {
    logger.error(err);
  }
}
