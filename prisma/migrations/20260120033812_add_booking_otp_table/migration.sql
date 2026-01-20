BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[BookingOtp] (
    [id] INT NOT NULL IDENTITY(1,1),
    [bookingId] INT NOT NULL,
    [otpHash] NVARCHAR(1000) NOT NULL,
    [expiresAt] DATETIME2 NOT NULL,
    [verifiedAt] DATETIME2,
    CONSTRAINT [BookingOtp_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [BookingOtp_bookingId_idx] ON [dbo].[BookingOtp]([bookingId]);

-- AddForeignKey
ALTER TABLE [dbo].[BookingOtp] ADD CONSTRAINT [BookingOtp_bookingId_fkey] FOREIGN KEY ([bookingId]) REFERENCES [dbo].[Booking]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
