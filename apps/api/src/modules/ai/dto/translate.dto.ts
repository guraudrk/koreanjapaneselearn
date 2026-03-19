import { IsArray, IsIn, IsString, MinLength } from 'class-validator';

export class TranslateDto {
  @IsString()
  @MinLength(1)
  inputText: string;

  @IsIn(['en', 'ko', 'ja'])
  inputLang: 'en' | 'ko' | 'ja';

  @IsArray()
  @IsIn(['en', 'ko', 'ja'], { each: true })
  output: ('en' | 'ko' | 'ja')[];
}
