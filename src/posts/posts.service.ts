import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import CreatePostDto from './dto/createPost.dto';
import Post from './post.interface';
import UpdatePostDto from './dto/updatePost.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export default class PostsService {
  private lastPostId = 0;
  private posts: Post[] = [];

  constructor(private readonly prismaService: PrismaService) {}

  async getAllPosts() {
    return this.prismaService.post.findMany();
  }

  async getPostById(id: number) {
    const post = await this.prismaService.post.findUnique({
      where: {
        id,
      },
    });
    if (!post) {
      // throw new PostNotFoundException(id);
    }
    return post;
  }

  replacePost(id: number, post: UpdatePostDto) {
    const postIndex = this.posts.findIndex((post) => post.id === id);
    if (postIndex > -1) {
      this.posts[postIndex] = post;
      return post;
    }
    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  createPost(post: CreatePostDto) {
    const newPost = {
      id: ++this.lastPostId,
      ...post,
    };
    this.posts.push(newPost);
    return newPost;
  }

  deletePost(id: number) {
    const postIndex = this.posts.findIndex((post) => post.id === id);
    if (postIndex > -1) {
      this.posts.splice(postIndex, 1);
    } else {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
  }
}
