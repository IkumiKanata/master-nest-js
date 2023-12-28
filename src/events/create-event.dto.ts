import { IsString, Length } from 'class-validator';

export class CreateEventDto {
  @IsString({ message: 'イベント名は文字列で入力してください' })
  @Length(5, 255, {
    message: 'イベント名は5文字以上255文字以下で入力してください。',
  })
  name: string;
  description: string;
  when: string;
  address: string;
}
