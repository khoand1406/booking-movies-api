/*
  Warnings:

  - A unique constraint covering the columns `[cinemaId,code]` on the table `Room` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Room] ADD [code] NVARCHAR(1000) NOT NULL;

-- CreateIndex
ALTER TABLE [dbo].[Room] ADD CONSTRAINT [Room_cinemaId_code_key] UNIQUE NONCLUSTERED ([cinemaId], [code]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
