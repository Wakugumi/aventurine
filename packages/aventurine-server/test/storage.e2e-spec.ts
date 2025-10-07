import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('StorageController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('upload base64 -> exists -> read -> delete -> not exists', async () => {
    const filename = `test-e2e-${Date.now()}.txt`;
    const folder = 'e2e-tests';
    const content = 'hello e2e';
    const b64 = Buffer.from(content).toString('base64');
    // upload
    const uploadResp = await request(app.getHttpServer())
      .post('/storage/upload/base64')
      .send({ filename, folder, file: b64 })
      .expect(201);

    expect(uploadResp.body).toBeDefined();

    const key = `${folder}/${filename}`;

    // exists
    const existsResp = await request(app.getHttpServer()).get(`/storage/exists/${encodeURIComponent(key)}`).expect(200);
    expect(existsResp.body.exists).toBe(true);

    // read
    const readResp = await request(app.getHttpServer()).get(`/storage/read/${encodeURIComponent(key)}`).expect(200);
    expect(readResp.text).toContain(content);

    // delete
    await request(app.getHttpServer()).delete(`/storage/${encodeURIComponent(key)}`).expect(200);

    // not exists
    const existsAfter = await request(app.getHttpServer()).get(`/storage/exists/${encodeURIComponent(key)}`).expect(200);
    expect(existsAfter.body.exists).toBe(false);
  }, 20000);
});
