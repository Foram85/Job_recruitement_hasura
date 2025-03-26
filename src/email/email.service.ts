import { Injectable } from '@nestjs/common';
import * as postmark from 'postmark';

@Injectable()
export class EmailService {
  private client: postmark.ServerClient;

  constructor() {
    this.client = new postmark.ServerClient(process.env.POSTMARK_TOKEN);
    console.log('Postmark token:', process.env.POSTMARK_TOKEN);
  }

  async sendNewApplicationNotification(
    hiringManagerEmail: string,
    candidateName: string,
    applicationId: string,
  ): Promise<void> {
    try {
      await this.client.sendEmailWithTemplate({
        From: process.env.EMAIL_FROM,
        To: hiringManagerEmail,
        TemplateId: 39236877,
        TemplateModel: {
          candidateName,
          applicationLink: `${applicationId}`,
        },
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  async sendInterviewDetailsToCandidate(
    CandidateEmail: string,
    candidateName: string,
    interviewDetails: {
      schedule_start_date: string;
      schedule_end_date: string;
      meeting_link: string;
      round: number;
      type: string;
    },
  ): Promise<void> {
    await this.client.sendEmailWithTemplate({
      From: process.env.EMAIL_FROM,
      To: CandidateEmail,
      TemplateId: 39236997,
      TemplateModel: {
        candidateName,
        ...interviewDetails,
      },
    });
  }

  async sendInterviewDetailsToInterviewer(
    InterviewerEmail: string,
    InterviewerName: string,
    CandidateName: string,
    resumeLink: string,
    interviewDetails: {
      schedule_start_date: string;
      schedule_end_date: string;
      meeting_link: string;
    },
  ): Promise<void> {
    await this.client.sendEmailWithTemplate({
      From: process.env.EMAIL_FROM,
      To: InterviewerEmail,
      TemplateId: 39237023,
      TemplateModel: {
        InterviewerName,
        CandidateName,
        resumeLink,
        ...interviewDetails,
      },
    });
  }

  async sendOfferToCandidate(
    CandidateEmail: string,
    candidateName: string,
    offerDetails: {
      offerLetterLink: string;
      joiningDate: string;
      positionName: string;
    },
  ): Promise<void> {
    await this.client.sendEmailWithTemplate({
      From: process.env.EMAIL_FROM,
      To: CandidateEmail,
      TemplateId: 39237055,
      TemplateModel: {
        candidateName,
        ...offerDetails,
      },
    });
  }

  async sendResetPasswordEmail(
    email: string,
    name: string,
    token: string,
  ): Promise<void> {
    const resetLink = `${token}`;

    await this.client.sendEmailWithTemplate({
      From: process.env.EMAIL_FROM,
      To: email,
      TemplateId: 39079303,
      TemplateModel: {
        name: name,
        link: resetLink,
      },
    });
  }

  async sendInvitation(
    email: string,
    name: string,
    token: string,
  ): Promise<void> {
    const invitationLink = `${token}`;

    await this.client.sendEmailWithTemplate({
      From: process.env.EMAIL_FROM,
      To: email,
      TemplateId: 39112655,
      TemplateModel: {
        name,
        link: invitationLink,
      },
    });
  }
}
