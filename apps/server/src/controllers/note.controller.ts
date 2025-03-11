import prisma from "@db";
import {createFactory} from "hono/factory";
import type {Context} from "hono";
import type {AppEnv} from "../types/hono-env";
import type {Note} from "@prisma/client";
import type {JSONSchemaType} from "ajv";

// The payload type for creating a note.
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

const factory = createFactory<AppEnv>();

export const getNotes = factory.createHandlers(
    async (c: Context<AppEnv>): Promise<Response> => {
        // Retrieve the authenticated user's ID from context.
        const {userId} = c.get("auth") || {};
        if (!userId) {
            return c.json({error: "Unauthorized"}, 401);
        }

        // Retrieve notes for the user.
        const notes: Note[] = await prisma.note.findMany({
            where: {userId},
        });

        return c.json(notes, 200);
    }
);

export const postNote = factory.createHandlers(
    async (c: Context<AppEnv>): Promise<Response> => {
        // Retrieve the authenticated user's ID.
        const {userId} = c.get("auth") || {};
        if (!userId) {
            return c.json({error: "Unauthorized"}, 401);
        }

        // Get the validated payload from the validation middleware.
        const validatedPayload = c.get("validatedBody") as NotePayload;

        // Create a new note.
        const note = await prisma.note.create({
            data: {
                userId,
                message: validatedPayload.message || "",
            },
        });
        
        return c.json(note, 201);
    }
);
