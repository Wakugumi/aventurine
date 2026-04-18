import { Test } from '@nestjs/testing'
import { FileStoreService } from '../services/file-store.service'
import { FileKeyService } from '../services/file-key.service'
import { StorageService } from 'src/engine/storage/services/storage.service'
import { Repository, UpdateResult } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import { FileStore } from '../file-store.entity'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { FileStoreStatus } from '@aventurine/shared'
import { FileContext } from '../enums/file-context.enum'
import { FileStoreException, FileStoreExceptionCode } from '../file-store.exception'

describe('FileStoreService', () => {
  let service: FileStoreService
  let keyService: jest.Mocked<FileKeyService>
  let storage: jest.Mocked<StorageService>
  let repo: jest.Mocked<Repository<FileStore>>
  let emitter: jest.Mocked<EventEmitter2>

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FileStoreService,
        { provide: FileKeyService, useValue: { generateFileKey: jest.fn(), getFileExtension: jest.fn() } },
        { provide: StorageService, useValue: { getSignedUrl: jest.fn(), checkFileExists: jest.fn(), getUrl: jest.fn(), delete: jest.fn() } },
        { provide: getRepositoryToken(FileStore), useValue: { save: jest.fn(), findOneByOrFail: jest.fn(), update: jest.fn(), findOneBy: jest.fn(), delete: jest.fn(), existsBy: jest.fn() } },
        { provide: EventEmitter2, useValue: { emit: jest.fn() } }
      ]
    }).compile()

    service = module.get(FileStoreService)
    keyService = module.get(FileKeyService)
    storage = module.get(StorageService)
    repo = module.get(getRepositoryToken(FileStore))
    emitter = module.get(EventEmitter2);

    jest.clearAllMocks();

  })

  // ========== createUpload ==========
  it('createUpload ok', async () => {
    keyService.generateFileKey.mockReturnValue('file/key')
    keyService.getFileExtension.mockReturnValue('png')
    storage.getSignedUrl.mockReturnValue({ url: 'signed-url', key: 'file/key' })
    repo.save.mockResolvedValue({ id: '1' } as any)

    const res = await service.createUpload('ref1', {
      fileName: 'a.png',
      context: FileContext.PRODUCT
    })

    expect(res.fileId).toBe('1')
    expect(res.fileKey).toBe('file/key')
    expect(storage.getSignedUrl).toHaveBeenCalled()
    expect(repo.save).toHaveBeenCalled()
  })

  // ========== confirmUpload ==========
  it('confirmUpload ok', async () => {
    storage.checkFileExists.mockResolvedValue(true)
    repo.findOneByOrFail.mockResolvedValue({
      id: '1',
      key: 'file/key',
      context: FileContext.PRODUCT,
      status: FileStoreStatus.PENDING
    } as any)

    const res = await service.confirmUpload({ fileId: '1', fileKey: 'file/key' })

    expect(repo.update).toHaveBeenCalledWith({ id: '1' }, { status: FileStoreStatus.ACTIVE })
    expect(emitter.emit).toHaveBeenCalled()
    expect(res.fileId).toBe('1')
  })

  it('confirmUpload throws when blob missing', async () => {
    storage.checkFileExists.mockResolvedValue(false)

    await expect(
      service.confirmUpload({ fileId: 'x', fileKey: 'missing' })
    ).rejects.toThrowError(FileStoreException)

    try {
      await service.confirmUpload({ fileId: 'x', fileKey: 'missing' })
    } catch (e) {
      expect(e.code).toBe(FileStoreExceptionCode.FILE_BLOB_NOT_FOUND)
    }
  })

  // ========== marDeleteFile ==========
  it('markDeleteFile ok', async () => {
    repo.findOneBy.mockResolvedValue({
      id: '1',
      referenceId: 'ref1',
      key: 'file/key'
    } as any)

    repo.existsBy.mockResolvedValueOnce(true);

    repo.update.mockResolvedValueOnce({} as UpdateResult)

    await service.markDeleteFile({ referenceId: 'ref1', fileId: '1' })
  })

  it('markDeleteFile throws when record missing', async () => {
    repo.existsBy.mockResolvedValueOnce(false)

    await expect(
      service.markDeleteFile({ referenceId: 'ref1', fileId: '9' })
    ).rejects.toThrowError(FileStoreException)

    try {
      await service.markDeleteFile({ referenceId: 'ref1', fileId: '9' })
    } catch (e) {
      expect(e.code).toBe(FileStoreExceptionCode.FILE_RECORD_NOT_FOUND)
    }
  });

  // ======= Handle delete file ================
  it('handleDeleteFile ok', async () => {
    let mockData = {
      id: '1',
      referenceId: 'ref1',
      key: "key1"
    } as any
    repo.findOneBy.mockResolvedValue(mockData)

    storage.delete.mockResolvedValueOnce({} as any);

    repo.delete.mockResolvedValueOnce({} as any);

    const returned = await service.handleDeleteFile({ referenceId: 'ref1', fileId: '1' })


    expect(storage.delete).toHaveBeenCalledWith({ key: mockData.key })
    expect(repo.delete).toHaveBeenCalledWith({ id: mockData.id });
    expect(returned).toEqual(mockData)
  });

  it('handleDeleteFile error when no record match', async () => {
    repo.findOneBy.mockResolvedValueOnce(null);

    expect.assertions(2);

    try {
      await service.handleDeleteFile({ referenceId: "1", fileId: "1" })
    } catch (error) {
      expect(error).toBeInstanceOf(FileStoreException);
      expect((error as FileStoreException).code).toEqual(FileStoreExceptionCode.FILE_RECORD_NOT_FOUND)
    }
  })

  // ========== getFile ==========
  it('getFile ok', async () => {
    repo.findOneBy.mockResolvedValue({
      id: '1',
      referenceId: 'ref1'
    } as any)

    const res = await service.getFile({ referenceId: 'ref1', fileId: '1' })
    expect(res.id).toBe('1')
  })

  it('getFile throws when missing', async () => {
    repo.findOneBy.mockResolvedValue(null)

    await expect(
      service.getFile({ referenceId: 'ref1', fileId: '10' })
    ).rejects.toThrow(FileStoreException)

    try {
      await service.getFile({ referenceId: 'ref1', fileId: '10' })
    } catch (e) {
      expect(e.code).toBe(FileStoreExceptionCode.FILE_RECORD_NOT_FOUND)
    }
  })
})
