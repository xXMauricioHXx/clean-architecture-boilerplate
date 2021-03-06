import knex, { QueryBuilder, Transaction } from 'knex';

export abstract class Repository<T> {
  protected abstract properties: string[];

  protected abstract database: knex;

  tableName: string;

  protected transactionable(trx?: Transaction): QueryBuilder {
    if (trx) {
      return this.table.transacting(trx);
    }
    return this.table;
  }

  protected get table(): QueryBuilder {
    return this.database(this.tableName).columns(this.properties);
  }

  get transaction() {
    return this.database.transaction.bind(this.database);
  }

  async create(data: Record<string, any>, trx?: Transaction): Promise<string> {
    const [createdId] = await this.transactionable(trx).insert(data);
    return createdId.toString();
  }

  async all(trx?: Transaction): Promise<T[]> {
    return this.transactionable(trx);
  }

  async getById(id: string, trx?: Transaction): Promise<T | null> {
    return this.transactionable(trx)
      .where('id', id)
      .first();
  }

  async deleteById(id: string, trx?: Transaction): Promise<boolean> {
    const result = await this.transactionable(trx)
      .where('id', id)
      .delete();
    return result > 0;
  }

  async updateById(
    id: string,
    data: Record<string, any>,
    trx?: Transaction
  ): Promise<boolean> {
    const result = await this.transactionable(trx)
      .where('id', id)
      .update(data);
    return result > 0;
  }
}
