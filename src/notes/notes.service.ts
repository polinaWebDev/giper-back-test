import {Injectable, NotFoundException} from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import { v4 as uuid } from 'uuid';
import {Note} from "./dto/note.dto";

const FILE_PATH = path.join(__dirname, '../../src/data/notes.json');

@Injectable()
export class NotesService {
    private async readFile(): Promise<Note[]> {
        try {
            const data = await fs.readFile(FILE_PATH, 'utf-8');
            return JSON.parse(data);
        } catch {
            return [];
        }
    }

    private async writeFile(notes: Note[]) {
        await fs.writeFile(FILE_PATH, JSON.stringify(notes, null, 2));
    }

    async getAll(): Promise<Note[]> {
        return this.readFile();
    }

    async add(title: string, text: string): Promise<Note> {
        const notes = await this.readFile();
        const newNote: Note = { id: uuid(), title, text, createdAt: new Date().toISOString() };
        notes.push(newNote);
        await this.writeFile(notes);
        return newNote;
    }

    async delete(id: string): Promise<Note> {
        const notes = await this.readFile();
        const noteIndex = notes.findIndex(note => note.id === id);
        if (noteIndex === -1) {
            throw new NotFoundException('Note not found');
        }
        const [deletedNote] = notes.splice(noteIndex, 1);
        await this.writeFile(notes);
        return deletedNote;
    }

    async getStats(): Promise<{ count: number, lastCreatedAt: string | null}> {
        const notes = await this.readFile();
        const count = notes.length;

        if (count === 0) {
            return { count: 0, lastCreatedAt: null };
        }

        const sorted = [...notes].sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime());

        return {
            count,
            lastCreatedAt: sorted[0].id
        }
    }
}