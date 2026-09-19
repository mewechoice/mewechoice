export interface LastKnownGoodStore<T> {
  read(): Promise<T | null>;
  replaceIfValid(candidate: T): Promise<void>;
}

export class MemoryLastKnownGoodStore<T> implements LastKnownGoodStore<T> {
  private value: T | null = null;

  async read(): Promise<T | null> {
    return this.value;
  }

  async replaceIfValid(candidate: T): Promise<void> {
    this.value = candidate;
  }
}
