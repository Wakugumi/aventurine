import { Provider } from "@nestjs/common";
import { STORE_REPOSITORY } from "./constants/store.constants";
import { DataSource } from "typeorm";
import { Store } from "./store.entity";
import { DATA_SOURCE } from "src/database/database.constants";

export const storeProviders: Provider[] = [
  {
    provide: STORE_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Store),
    inject: [DATA_SOURCE]
  }
]
