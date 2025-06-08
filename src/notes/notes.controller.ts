import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {
    constructor (
        private readonly notesService: NotesService
    ) {}

    @Get()
    async getAll() {
        return this.notesService.getAll();
    }

    @Post()
    async add
    (
        @Body() body: { title: string; text: string }
    ) {
        return this.notesService.add(body.title, body.text);
    }

    @Delete(':id')
    async delete
    (
        @Param('id') id: string
    ) {
        return this.notesService.delete(id);
    }

}