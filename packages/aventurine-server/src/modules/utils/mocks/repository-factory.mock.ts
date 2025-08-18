import { Repository } from 'typeorm';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{} | null | undefined>;
};

export const repositoryFactoryMock: () => MockType<Repository<any>> = jest.fn(
  () => ({
    find: jest.fn((entity) => entity),
    create: jest.fn((entity) => entity),
    findOne: jest.fn((entity) => entity),
    save: jest.fn((entity) => entity),
    delete: jest.fn((entity) => entity),

    clear: jest.fn((entity) => entity),
  }),
);
