/*
  Warnings:

  - You are about to drop the column `price` on the `TransactionDetail` table. All the data in the column will be lost.
  - Added the required column `total` to the `TransactionDetail` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TransactionDetail" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "transaction_header_pk" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "total" REAL NOT NULL,
    CONSTRAINT "TransactionDetail_transaction_header_pk_fkey" FOREIGN KEY ("transaction_header_pk") REFERENCES "TransactionHeader" ("pk") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TransactionDetail_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TransactionDetail" ("id", "product_id", "quantity", "transaction_header_pk") SELECT "id", "product_id", "quantity", "transaction_header_pk" FROM "TransactionDetail";
DROP TABLE "TransactionDetail";
ALTER TABLE "new_TransactionDetail" RENAME TO "TransactionDetail";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
