import { ChatService } from './chat.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ChatFilter } from '../chat/dto/chat.filter';

describe('ChatService', () => {
  let chatService: ChatService;
  let prismaService: PrismaService;

  beforeEach(() => {
    prismaService = new PrismaService(); // Create a new instance of PrismaService
    chatService = new ChatService(prismaService); // Inject the PrismaService into ChatService
  });

  describe('findAll', () => {
    it('should find all chat messages', async () => {
      // Arrange
      const filterQuery: ChatFilter = {
        page: 1,
        limit: 10,
        sortBy: 'name',
        sortOrder: 'desc',
      };

      const chatMessages = [
        {
          id: '1',
          feedback_id: '123',
          message: 'Hello',
          sender: 'user1',
          sender_name: 'User 1',
          createdAt: new Date('2023-08-08T15:36:23.478Z'),
          updatedAt: new Date('2023-08-08T15:36:23.478Z'),
        },
      ];

      const expectedResult = {
        page: 1,
        limit: 10,
        total: chatMessages.length,
        totalPages: 1,
        hasNextPage: false,
        allData: chatMessages,
      };

      // Mock the PrismaService method
      jest
        .spyOn(prismaService.chat, 'findMany')
        .mockResolvedValue(chatMessages);

      // Act
      const result = await chatService.findAll(filterQuery);

      // Assert
      expect(result).toEqual(expectedResult);
    });
  });

  describe('create', () => {
    it('should create a new chat message', async () => {
      // Arrange
      const createChatDto = {
        feedback_id: '64d260f87d12f6f2243113ac',
        message: 'New message',
        sender: 'user1',
        sender_name: 'User 1',
        createdAt: new Date(), // Mock createdAt
        updatedAt: new Date(),
      };

      // Mock the PrismaService methods for create
      prismaService.chat.create = jest.fn().mockResolvedValue({
        ...createChatDto,
      });

      // Act
      const result = await chatService.create(createChatDto);

      // Omit the id field from the expected result
      const expected = { ...createChatDto };

      // Assert
      expect(result).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should find a chat message by ID', async () => {
      // Arrange
      const chatId = '1';
      const chatMessage = {
        id: chatId,
        feedback_id: '123',
        message: 'Hello',
        sender: 'user1',
        sender_name: 'User 1',
        createdAt: new Date('2023-08-08T15:36:23.478Z'),
        updatedAt: new Date('2023-08-08T15:36:23.478Z'),
      };

      // Mock the PrismaService method
      jest
        .spyOn(prismaService.chat, 'findFirst')
        .mockResolvedValue(chatMessage);

      // Act
      const result = await chatService.findOne(chatId);

      // Assert
      expect(result).toEqual(chatMessage);
    });
  });

  describe('update', () => {
    it('should update a chat message by ID', async () => {
      // Arrange
      const chatId = '1';
      const updateChatDto = {
        message: 'Updated message',
      };

      // Mock the PrismaService methods for findFirst and update
      prismaService.chat.findFirst = jest
        .fn()
        .mockResolvedValue({ id: chatId });
      prismaService.chat.update = jest.fn().mockResolvedValue({
        ...updateChatDto,
        id: chatId,
      });

      // Act
      const result = await chatService.update(chatId, updateChatDto);

      // Assert
      expect(result).toEqual({ ...updateChatDto, id: chatId });
    });
  });

  describe('remove', () => {
    it('should remove a chat message by ID', async () => {
      // Arrange
      const chatId = '1';

      // Mock the PrismaService methods for findFirst and delete
      prismaService.chat.findFirst = jest
        .fn()
        .mockResolvedValue({ id: chatId });
      prismaService.chat.delete = jest.fn().mockResolvedValue({ id: chatId });

      // Act
      const result = await chatService.remove(chatId);

      // Assert
      expect(result).toEqual({ id: chatId });
    });
  });

  // Add more describe blocks for other methods (findOne, update, remove) as needed
});
