import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackService } from './feedback.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { HttpException } from '@nestjs/common';
// import { AppMessage } from '@/app/utils/messages.enum';
// import { HttpStatusCode } from 'axios';

describe('FeedbackService', () => {
  let feedbackService: FeedbackService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedbackService,
        {
          provide: PrismaService,
          useValue: {
            feedback: {
              create: jest.fn(),
              findMany: jest.fn(),
              findFirst: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            chat: {
              deleteMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    feedbackService = module.get<FeedbackService>(FeedbackService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should create feedback', async () => {
      const createFeedbackDto: CreateFeedbackDto = {
        uid: '01861270125',
        name: 'ours',
        title: 'Help',
        description: 'description',
        rating: 5,
      };
      const expectedResult = {
        id: '651533fafac1cb952fe5a47c',
        uid: '01861270125',
        name: 'ours',
        title: 'Help',
        description: 'description',
        isDelete: false,
        feedbackClosed: false,
        createdAt: '2023-09-28T08:06:18.973Z',
        updatedAt: '2023-09-28T08:06:18.973Z',
      };

      // Mock the PrismaService method
      (prismaService.feedback.create as jest.Mock).mockResolvedValue(
        expectedResult,
      );

      const result = await feedbackService.create(createFeedbackDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should find all feedback', async () => {
      const filterQuery = {
        page: 1,
        limit: 10,
        sortBy: 'name',
        sortOrder: 'desc',
      };
      const expectedResult = {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNextPage: false,
        allData: [
          {
            id: '64d260f77d12f6f2243113ab',
            uid: '8801861270125',
            name: 'Jahedul Hoque',
            title: 'Received',
            description: '',
            rating: 0,
            isDelete: false,
            feedbackClosed: false,
            createdAt: new Date('2023-08-08T15:36:23.478Z'),
            updatedAt: new Date('2023-08-08T15:36:23.478Z'),
          },
        ],
      };

      // Mock the PrismaService method
      jest
        .spyOn(prismaService.feedback, 'findMany')
        .mockResolvedValue([expectedResult.allData[0]]); // Simulate Prisma data

      const result = await feedbackService.findAll(filterQuery);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should find one feedback', async () => {
      const feedbackId = '64d260f77d12f6f2243113ab';
      const expectedResult = {
        message: 'Feedback Get Successfully!',
        statusCode: 200,
        data: {
          id: '64d260f77d12f6f2243113ab',
          uid: '8801861270125',
          name: 'Jahedul Hoque',
          title: 'Received',
          description: '',
          rating: 0,
          isDelete: false,
          feedbackClosed: false,
          createdAt: '2023-08-08T15:36:23.478Z',
          updatedAt: '2023-08-08T15:36:23.478Z',
          chat: [
            {
              id: '64d260f87d12f6f2243113ac',
              feedback_id: '64d260f77d12f6f2243113ab',
              message: 'Received',
              sender: '8801861270125',
              sender_name: 'Jahedul Hoque',
              createdAt: '2023-08-08T15:36:24.202Z',
              updatedAt: '2023-08-08T15:36:24.202Z',
            },
          ],
        },
      };

      // Mock the PrismaService method
      (prismaService.feedback.findFirst as jest.Mock).mockResolvedValue(
        expectedResult,
      );

      const result = await feedbackService.findOne(feedbackId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should update feedback', async () => {
      const feedbackId = '64d260f77d12f6f2243113ab';
      const updateFeedbackDto: UpdateFeedbackDto = {
        name: 'test',
      };
      const expectedResult = {
        message: 'Feedback Update Successfully!',
        statusCode: 200,
        data: {
          id: '64d260f77d12f6f2243113ab',
          uid: '8801861270125',
          name: 'test',
          title: 'Received',
          description: '',
          rating: 0,
          isDelete: false,
          feedbackClosed: false,
          createdAt: '2023-08-08T15:36:23.478Z',
          updatedAt: '2023-08-08T15:36:23.478Z',
        },
      };

      // Mock the PrismaService methods
      (prismaService.feedback.findFirst as jest.Mock).mockResolvedValue({
        id: feedbackId,
      }); // Mock for the existence check
      (prismaService.feedback.update as jest.Mock).mockResolvedValue(
        expectedResult,
      );

      const result = await feedbackService.update(
        feedbackId,
        updateFeedbackDto,
      );
      expect(result).toEqual(expectedResult);
    });

    it('should throw HttpException when feedback is not found', async () => {
      const feedbackId = 'nonExistentId';
      const updateFeedbackDto: UpdateFeedbackDto = {
        /* Provide valid data here */
      };

      // Mock the PrismaService method to return null (simulating not found)
      (prismaService.feedback.findFirst as jest.Mock).mockResolvedValue(null);

      // Expect an exception to be thrown
      await expect(
        feedbackService.update(feedbackId, updateFeedbackDto),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('remove', () => {
    it('should remove feedback', async () => {
      const feedbackId = 'sampleId';

      // Mock the PrismaService methods
      (prismaService.feedback.findFirst as jest.Mock).mockResolvedValue({}); // Mock for the existence check
      (prismaService.chat.deleteMany as jest.Mock).mockResolvedValue({}); // Mock for chat deletion
      (prismaService.feedback.delete as jest.Mock).mockResolvedValue({}); // Mock for feedback deletion

      const result = await feedbackService.remove(feedbackId);

      // You can add additional assertions here if needed
      expect(result).toBeDefined();
    });

    it('should throw HttpException when feedback is not found', async () => {
      const feedbackId = 'nonExistentId';

      // Mock the PrismaService method to return null (simulating not found)
      (prismaService.feedback.findFirst as jest.Mock).mockResolvedValue(null);

      // Expect an exception to be thrown
      await expect(feedbackService.remove(feedbackId)).rejects.toThrow(
        HttpException,
      );
    });
  });
});
