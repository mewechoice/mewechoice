export interface LastKnownGoodStore<T> {
  read(): Promise<T | null>;
  replace(candidate: T): Promise<void>;
}

export class MemoryLastKnownGoodStore<T> implements LastKnownGoodStore<T> {
  private value: T | null = null;

  async read(): Promise<T | null> {
    return this.value;
  }

  async replace(candidate: T): Promise<void> {
    this.value = candidate;
  }
}
