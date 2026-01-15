import { Prisma } from "generated/prisma/client";

export type ShowtimeWithMovieAndRoom = Prisma.ShowtimeGetPayload<{include: {movie: true, room: true}}>