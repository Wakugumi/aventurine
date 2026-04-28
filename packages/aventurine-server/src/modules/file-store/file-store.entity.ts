import { ContentType, FileStoreStatus } from "@aventurine/shared";
import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { FileContext } from "./enums/file-context.enum";

@Entity('file_store')
@Index("IDX_FILE_STORE_REFID", ['referenceId'], { unique: false })
@Index("IDX_FILE_STORE_REF_CONTEXT", ['referenceId', 'context'], { unique: false })
@Index("IDX_FILE_STORE_CREATED_AT", ['createdAt'], { unique: false })

@Index("IDX_FILE_STORE_PRODUCT", ['referenceId'], {
  where: `"context" = 'product' AND "status" = 'active'`
})
export class FileStore {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  key: string;

  @Column({ type: 'enum', enum: FileStoreStatus, default: FileStoreStatus.PENDING })
  status: FileStoreStatus;


  url?: string;


  @Column({ type: 'enum', enum: ContentType })
  contentType: ContentType;

  @Column({ type: 'uuid' })
  referenceId: string;

  @Column({ type: 'enum', enum: FileContext })
  context: FileContext;


  @CreateDateColumn()
  createdAt: Date;

}


export type FileRecord = Pick<FileStore, "id" | "key" | "url">
