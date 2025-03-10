import prisma from "@db";
import type {Note} from "@prisma/client";
import type {Context} from "../types/context";
import type {JSONSchemaType} from "ajv";

// Define the shape of the note payload.
export interface NotePayload {
    message?: string;
}

// JSON Schema for note payloads.
export const noteSchema: JSONSchemaType<NotePayload> = {
    type: "object",
    optionalProperties: {
        message: {type: "string"},
    },
    required: [],
};

export async function getNotes(ctx: Context): Promise<Response> {
    const {userId, email} = ctx.locals.auth || {};

    const notes: Note[] = await prisma.note.findMany({
        where: {userId: userId},
    });

    return new Response(JSON.stringify(notes), {
        status: 200,
        headers: {"Content-Type": "application/json"},
    });
}

export async function postNote(ctx: Context): Promise<Response> {
    const {userId, email} = ctx.locals.auth || {};

    const payload = ctx.locals.validatedBody as NotePayload;
    const note: Note = await prisma.note.create({
        data: {
            userId: userId,
            message: payload.message || "",
        },
    });

    return new Response(JSON.stringify(note), {
        status: 201,
        headers: {"Content-Type": "application/json"},
    });
}
