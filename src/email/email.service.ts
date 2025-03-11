import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Transporter, createTransport } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { getBaseConfig } from '@/common';

@Injectable()
export class EmailService {
  transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    const {
      nodeMailer: { host, port, secure, authUser, authPass },
    } = getBaseConfig(this.configService);
    this.transporter = createTransport({
      host,
      port,
      secure,
      auth: {
        user: authUser,
        pass: authPass,
      },
    });
  }

  /**
   * 发送邮件
   *
   * @param email 收件人邮箱
   * @param subject 邮件主题
   * @param html 邮件正文，可选
   * @returns 返回一个 Promise 对象，解析后得到一个包含验证码和邮件信封信息的对象
   * @throws HttpException 当邮件发送失败时，会抛出一个 HttpException 异常
   */
  async sendMail({
    email,
    subject,
    html,
  }: {
    email: string;
    subject: string;
    html?: string;
  }): Promise<Record<string, string>> {
    const code = Math.random().toString().slice(-4);
    const {
      nodeMailer: { authUser },
    } = getBaseConfig(this.configService);
    const options = {
      from: {
        name: '会议室预定系统',
        address: authUser,
      },
      to: email,
      subject,
      html: html ?? `用户验证码为：${code}，有效期为5分钟，请及时使用!`,
    };
    return new Promise((resolve, reject) => {
      this.transporter.sendMail(
        options,
        (
          error: Error,
          info: {
            envelope: Record<string, string[]>;
          },
        ) => {
          if (error) {
            reject(
              new HttpException(
                `发送邮件失败:${error}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
              ),
            );
          } else {
            resolve({
              code,
              ...info.envelope,
            });
          }
        },
      );
    });
  }
}
