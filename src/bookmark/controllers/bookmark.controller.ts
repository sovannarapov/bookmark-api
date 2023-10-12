import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BookmarkService } from '../services/bookmark.service';
import { JwtGuard } from '../../auth/guard';
import { CreateBookmarkDto } from '../requests/create-bookmark.dto';
import { EditBookmarkDto } from '../requests/edit-bookmark.dto';
import { GetUser } from '../../auth/decorator';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(private _bookmarkService: BookmarkService) {}

  @Get()
  async getBookmarks(@GetUser('id') userId: number) {
    return this._bookmarkService.getBookmarks(userId);
  }

  @Get(':id')
  async getBookmarkById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this._bookmarkService.getBookmarkById(userId, bookmarkId);
  }

  @Post()
  async createBookmark(
    @GetUser('id') userId: number,
    @Body() createBookmarkDto: CreateBookmarkDto,
  ) {
    return this._bookmarkService.createBookmark(userId, createBookmarkDto);
  }

  @Patch(':id')
  async editBookmarkById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
    @Body() editBookmarkDto: EditBookmarkDto,
  ) {
    return this._bookmarkService.editBookmarkById(
      userId,
      bookmarkId,
      editBookmarkDto,
    );
  }

  @Delete(':id')
  async deleteBookmarkById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this._bookmarkService.deleteBookmarkById(userId, bookmarkId);
  }
}
