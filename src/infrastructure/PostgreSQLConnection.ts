import { Pool, PoolClient } from 'pg';
import { IDatabaseConnection } from './interfaces';

export class PostgreSQLConnection implements IDatabaseConnection {
  private client?: PoolClient;

  constructor(private pool: Pool) {}

  async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    const client = this.client || this.pool;
    const result = await client.query(sql, params);
    return result.rows;
  }

  async queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
    const results = await this.query<T>(sql, params);
    return results.length > 0 ? results[0] : null;
  }

  async connect(): Promise<void> {
    if (!this.client) {
      this.client = await this.pool.connect();
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      this.client.release();
      this.client = undefined;
    }
  }

  async beginTransaction(): Promise<void> {
    await this.connect();
    await this.client!.query('BEGIN');
  }

  async commit(): Promise<void> {
    if (this.client) {
      await this.client.query('COMMIT');
    }
  }

  async rollback(): Promise<void> {
    if (this.client) {
      await this.client.query('ROLLBACK');
    }
  }
}