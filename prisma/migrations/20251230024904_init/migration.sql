BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Movie] (
    [id] INT NOT NULL IDENTITY(1,1),
    [title] NVARCHAR(1000) NOT NULL,
    [slug] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000) NOT NULL,
    [durationMinutes] INT NOT NULL,
    [releaseDate] DATETIME2 NOT NULL,
    [endDate] DATETIME2,
    [rating] FLOAT(53),
    [language] NVARCHAR(1000) NOT NULL,
    [posterUrl] NVARCHAR(1000) NOT NULL,
    [trailerUrl] NVARCHAR(1000),
    [status] VARCHAR(50) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Movie_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Movie_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Movie_slug_key] UNIQUE NONCLUSTERED ([slug])
);

-- CreateTable
CREATE TABLE [dbo].[Cinema] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [address] NVARCHAR(1000) NOT NULL,
    [city] NVARCHAR(1000) NOT NULL,
    [latitude] FLOAT(53),
    [longitude] FLOAT(53),
    [status] BIT NOT NULL CONSTRAINT [Cinema_status_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Cinema_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Cinema_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Room] (
    [id] INT NOT NULL IDENTITY(1,1),
    [cinemaId] INT NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [roomType] VARCHAR(20) NOT NULL,
    [totalSeats] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Room_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Room_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Seat] (
    [id] INT NOT NULL IDENTITY(1,1),
    [roomId] INT NOT NULL,
    [rowLabel] VARCHAR(5) NOT NULL,
    [seatNumber] INT NOT NULL,
    [seatType] VARCHAR(20) NOT NULL,
    [isActive] BIT NOT NULL CONSTRAINT [Seat_isActive_df] DEFAULT 1,
    CONSTRAINT [Seat_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Seat_roomId_rowLabel_seatNumber_key] UNIQUE NONCLUSTERED ([roomId],[rowLabel],[seatNumber])
);

-- CreateTable
CREATE TABLE [dbo].[Showtime] (
    [id] INT NOT NULL IDENTITY(1,1),
    [movieId] INT NOT NULL,
    [roomId] INT NOT NULL,
    [startTime] DATETIME2 NOT NULL,
    [endTime] DATETIME2 NOT NULL,
    [basePrice] DECIMAL(10,2) NOT NULL,
    [status] VARCHAR(20) NOT NULL,
    CONSTRAINT [Showtime_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] INT NOT NULL IDENTITY(1,1),
    [email] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [fullName] NVARCHAR(1000) NOT NULL,
    [phone] NVARCHAR(1000),
    [role] VARCHAR(20) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [User_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[Booking] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT,
    [showtimeId] INT NOT NULL,
    [bookingCode] NVARCHAR(1000) NOT NULL,
    [totalAmount] DECIMAL(10,2) NOT NULL,
    [status] VARCHAR(20) NOT NULL,
    [expiresAt] DATETIME2,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Booking_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Booking_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Booking_bookingCode_key] UNIQUE NONCLUSTERED ([bookingCode])
);

-- CreateTable
CREATE TABLE [dbo].[BookingSeat] (
    [id] INT NOT NULL IDENTITY(1,1),
    [bookingId] INT NOT NULL,
    [seatId] INT NOT NULL,
    [seatPrice] DECIMAL(10,2) NOT NULL,
    CONSTRAINT [BookingSeat_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [BookingSeat_bookingId_seatId_key] UNIQUE NONCLUSTERED ([bookingId],[seatId])
);

-- CreateTable
CREATE TABLE [dbo].[Ticket] (
    [id] INT NOT NULL IDENTITY(1,1),
    [bookingId] INT NOT NULL,
    [seatId] INT NOT NULL,
    [qrCode] NVARCHAR(1000) NOT NULL,
    [issuedAt] DATETIME2 NOT NULL CONSTRAINT [Ticket_issuedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [checkedInAt] DATETIME2,
    CONSTRAINT [Ticket_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Ticket_qrCode_key] UNIQUE NONCLUSTERED ([qrCode])
);

-- CreateTable
CREATE TABLE [dbo].[Payment] (
    [id] INT NOT NULL IDENTITY(1,1),
    [bookingId] INT NOT NULL,
    [paymentMethod] VARCHAR(20) NOT NULL,
    [amount] DECIMAL(10,2) NOT NULL,
    [transactionCode] NVARCHAR(1000),
    [status] VARCHAR(20) NOT NULL,
    [paidAt] DATETIME2,
    CONSTRAINT [Payment_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Payment_bookingId_key] UNIQUE NONCLUSTERED ([bookingId])
);

-- AddForeignKey
ALTER TABLE [dbo].[Room] ADD CONSTRAINT [Room_cinemaId_fkey] FOREIGN KEY ([cinemaId]) REFERENCES [dbo].[Cinema]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Seat] ADD CONSTRAINT [Seat_roomId_fkey] FOREIGN KEY ([roomId]) REFERENCES [dbo].[Room]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Showtime] ADD CONSTRAINT [Showtime_movieId_fkey] FOREIGN KEY ([movieId]) REFERENCES [dbo].[Movie]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Showtime] ADD CONSTRAINT [Showtime_roomId_fkey] FOREIGN KEY ([roomId]) REFERENCES [dbo].[Room]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Booking] ADD CONSTRAINT [Booking_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Booking] ADD CONSTRAINT [Booking_showtimeId_fkey] FOREIGN KEY ([showtimeId]) REFERENCES [dbo].[Showtime]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[BookingSeat] ADD CONSTRAINT [BookingSeat_bookingId_fkey] FOREIGN KEY ([bookingId]) REFERENCES [dbo].[Booking]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[BookingSeat] ADD CONSTRAINT [BookingSeat_seatId_fkey] FOREIGN KEY ([seatId]) REFERENCES [dbo].[Seat]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Ticket] ADD CONSTRAINT [Ticket_bookingId_fkey] FOREIGN KEY ([bookingId]) REFERENCES [dbo].[Booking]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Ticket] ADD CONSTRAINT [Ticket_seatId_fkey] FOREIGN KEY ([seatId]) REFERENCES [dbo].[Seat]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Payment] ADD CONSTRAINT [Payment_bookingId_fkey] FOREIGN KEY ([bookingId]) REFERENCES [dbo].[Booking]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
