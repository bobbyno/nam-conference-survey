import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSurveyResponseDto } from './dto/create-survey-response.dto';
import { SurveyResponseDto } from './dto/survey-response.dto';
import { ResponseDetailDto, QuestionDetailDto } from './dto/response-detail.dto';
import { Role, Status } from '@prisma/client';

@Injectable()
export class SurveyService {
  private readonly logger = new Logger(SurveyService.name);
  private readonly ANONYMOUS_EMAIL = 'anonymous@survey.local';

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get or create the anonymous user for survey submissions
   */
  private async getOrCreateAnonymousUser() {
    let user = await this.prisma.user.findUnique({
      where: { email: this.ANONYMOUS_EMAIL },
    });

    if (!user) {
      this.logger.log('Creating anonymous user');
      user = await this.prisma.user.create({
        data: {
          email: this.ANONYMOUS_EMAIL,
          name: 'Anonymous Survey User',
          role: Role.PARTICIPANT,
        },
      });
    }

    return user;
  }

  /**
   * Check if the submission has at least one field filled
   */
  private hasAnyFieldFilled(dto: CreateSurveyResponseDto): boolean {
    const values = Object.values(dto);
    return values.some((value) => {
      if (value === null || value === undefined) return false;
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'object') return Object.keys(value).length > 0;
      return true;
    });
  }

  /**
   * Submit anonymous survey response
   */
  async submitSurvey(dto: CreateSurveyResponseDto): Promise<SurveyResponseDto> {
    // Validate that at least one field is filled
    if (!this.hasAnyFieldFilled(dto)) {
      throw new BadRequestException(
        'Cannot submit empty survey. Please answer at least one question.',
      );
    }

    // Get or create anonymous user and create response in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Get or create anonymous user
      let user = await tx.user.findUnique({
        where: { email: this.ANONYMOUS_EMAIL },
      });

      if (!user) {
        this.logger.log('Creating anonymous user in transaction');
        user = await tx.user.create({
          data: {
            email: this.ANONYMOUS_EMAIL,
            name: 'Anonymous Survey User',
            role: Role.PARTICIPANT,
          },
        });
      }

      // Create survey response with default empty arrays for multi-select fields
      const response = await tx.surveyResponse.create({
        data: {
          userId: user.id,
          status: Status.SUBMITTED,

          // Likert scale questions
          q1OverallRating: dto.q1OverallRating ?? null,
          q1Comment: dto.q1Comment ?? null,
          q2ReturnIntent: dto.q2ReturnIntent ?? null,
          q2Comment: dto.q2Comment ?? null,
          q3CoworkingEffectiveness: dto.q3CoworkingEffectiveness ?? null,
          q3Comment: dto.q3Comment ?? null,
          q5ConnectionDepth: dto.q5ConnectionDepth ?? null,
          q5Comment: dto.q5Comment ?? null,
          q6LearningValue: dto.q6LearningValue ?? null,
          q6Comment: dto.q6Comment ?? null,
          q8SaturdayWorth: dto.q8SaturdayWorth ?? null,
          q8Comment: dto.q8Comment ?? null,
          q9PreConferenceCommunication:
            dto.q9PreConferenceCommunication ?? null,
          q10AccommodationsVenue: dto.q10AccommodationsVenue ?? null,
          q13ComparisonToPD: dto.q13ComparisonToPD ?? null,

          // Multiple select questions (default to empty arrays)
          q4ConnectionTypes: dto.q4ConnectionTypes ?? [],
          q4ConnectionOther: dto.q4ConnectionOther ?? null,
          q17FeedbackConfidence: dto.q17FeedbackConfidence ?? [],

          // Ranking question
          q11SessionRankings: dto.q11SessionRankings || undefined,

          // Single choice questions
          q12ConferenceLength: dto.q12ConferenceLength ?? null,
          q16Improvements: dto.q16Improvements ?? null,
          q16Comment: dto.q16Comment ?? null,

          // Open-ended questions
          q7FutureTopics: dto.q7FutureTopics ?? null,
          q14LikedMost: dto.q14LikedMost ?? null,
          q15AdditionalFeedback: dto.q15AdditionalFeedback ?? null,

          // Demographics
          q18EmploymentStatus: dto.q18EmploymentStatus ?? null,
          q19Name: dto.q19Name ?? null,
          q19Location: dto.q19Location ?? null,
        },
      });

      return response;
    });

    // Log submission (without PII)
    this.logger.log(`Survey submitted: ${result.id}`);

    // Return response DTO
    return new SurveyResponseDto(
      result.id,
      result.userId,
      result.status,
      result.createdAt,
    );
  }

  /**
   * Get complete response details by ID
   */
  async getResponseDetails(id: string): Promise<ResponseDetailDto> {
    const response = await this.prisma.surveyResponse.findUnique({
      where: { id },
    });

    if (!response) {
      throw new NotFoundException(`Response with ID ${id} not found`);
    }

    // Map all 19 questions to structured format
    const questions: QuestionDetailDto[] = [
      {
        questionNumber: 1,
        questionText: 'How would you rate your overall NAM Conference experience?',
        questionType: 'likert',
        answer: response.q1OverallRating,
      },
      {
        questionNumber: 2,
        questionText: 'Would you want to attend NAM Conference again next year?',
        questionType: 'likert',
        answer: response.q2ReturnIntent,
      },
      {
        questionNumber: 3,
        questionText: 'How valuable was the coworking day for networking and collaboration?',
        questionType: 'likert-with-na',
        answer: response.q3CoworkingEffectiveness,
      },
      {
        questionNumber: 4,
        questionText: 'Who did you most value connecting with at this conference?',
        questionType: 'multiselect',
        answer: response.q4ConnectionTypes,
      },
      {
        questionNumber: 5,
        questionText: 'How would you describe the quality of connections you made at this conference?',
        questionType: 'likert',
        answer: response.q5ConnectionDepth,
      },
      {
        questionNumber: 6,
        questionText: 'How would you rate the educational/learning value of the conference content?',
        questionType: 'likert',
        answer: response.q6LearningValue,
      },
      {
        questionNumber: 7,
        questionText: 'What topics would you like to see at future conferences?',
        questionType: 'openended',
        answer: response.q7FutureTopics,
      },
      {
        questionNumber: 8,
        questionText: 'The conference asks you to use personal time on a Saturday. Was this time commitment worth it for you?',
        questionType: 'likert-with-na',
        answer: response.q8SaturdayWorth,
      },
      {
        questionNumber: 9,
        questionText: 'How clear were your expectations before arriving at the conference?',
        questionType: 'likert',
        answer: response.q9PreConferenceCommunication,
      },
      {
        questionNumber: 10,
        questionText: 'How would you rate the hotel accommodations, conference venue, and catered meals and snacks?',
        questionType: 'likert-with-na',
        answer: response.q10AccommodationsVenue,
      },
      {
        questionNumber: 11,
        questionText: 'Rank the following session types in order of value to you',
        questionType: 'ranking',
        answer: response.q11SessionRankings,
      },
      {
        questionNumber: 12,
        questionText: 'Was the overall conference length appropriate?',
        questionType: 'single-choice',
        answer: response.q12ConferenceLength,
      },
      {
        questionNumber: 13,
        questionText: 'How does NAM Conference compare to other professional development opportunities you\'ve experienced?',
        questionType: 'likert-with-na',
        answer: response.q13ComparisonToPD,
      },
      {
        questionNumber: 14,
        questionText: 'What did you like most about the conference?',
        questionType: 'openended',
        answer: response.q14LikedMost,
      },
      {
        questionNumber: 15,
        questionText: 'Is there anything else you\'d like us to know about your conference experience?',
        questionType: 'openended',
        answer: response.q15AdditionalFeedback,
      },
      {
        questionNumber: 16,
        questionText: 'If you attended the last NAM Conference, did you notice improvements based on previous feedback?',
        questionType: 'single-choice',
        answer: response.q16Improvements,
      },
      {
        questionNumber: 17,
        questionText: 'What would make you most confident that your feedback will be acted upon?',
        questionType: 'multiselect',
        answer: response.q17FeedbackConfidence,
      },
      {
        questionNumber: 18,
        questionText: 'What is your current status with Equal Experts?',
        questionType: 'single-choice',
        answer: response.q18EmploymentStatus,
      },
      {
        questionNumber: 19,
        questionText: 'If comfortable please provide your name and home city and state.',
        questionType: 'text-field',
        answer: {
          name: response.q19Name,
          location: response.q19Location,
        },
      },
    ];

    return new ResponseDetailDto(response.id, response.createdAt, questions);
  }
}
