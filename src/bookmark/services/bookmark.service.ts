import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBookmarkDto } from '../requests/create-bookmark.dto';
import { EditBookmarkDto } from '../requests/edit-bookmark.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BookmarkService {
  constructor(private _prismaService: PrismaService) {}

  async getBookmarks(userId: number) {
    return this._prismaService.bookmark.findMany({
      where: {
        userId,
      },
    });
  }

  async getBookmarkById(userId: number, bookmarkId: number) {
    return this._prismaService.bookmark.findFirst({
      where: {
        id: bookmarkId,
        userId,
      },
    });
  }

  async createBookmark(userId: number, createBookmarkDto: CreateBookmarkDto) {
    const bookmark = await this._prismaService.bookmark.create({
      data: {
        userId,
        ...createBookmarkDto,
      },
    });

    return bookmark;
  }

  async editBookmarkById(
    userId: number,
    bookmarkId: number,
    editBookmarkDto: EditBookmarkDto,
  ) {
    const bookmark = await this._prismaService.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException('Access to resources denied');
    }

    return this._prismaService.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...editBookmarkDto,
      },
    });
  }

  async deleteBookmarkById(userId: number, bookmarkId: number) {
    const bookmark = await this._prismaService.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException('Access to resources denied');
    }

    return this._prismaService.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
  }
}
