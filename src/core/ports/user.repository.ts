import { Transaction } from 'knex';
import { User } from '@/core/entities/user';
import { UserSources } from '@/core/enum';

export interface IUserRepository {
  getByUsername(username: string): Promise<User | null>;
  all(): Promise<User[]>;
  getById(id: string): Promise<User | null>;
  transaction: any;
  create(data: Partial<User>, trx?: Transaction): Promise<string>;
  getByEmailsWithSource(
    emails: string[],
    source: UserSources,
    trx?: Transaction
  ): Promise<User[]>;
}
