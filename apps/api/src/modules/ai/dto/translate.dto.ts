import { IsArray, IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class TranslateDto {
  @IsString()
  @MinLength(1)
  inputText: string;

  @IsIn(['en', 'ko', 'ja'])
  inputLang: 'en' | 'ko' | 'ja';

  @IsArray()
  @IsIn(['en', 'ko', 'ja'], { each: true })
  output: ('en' | 'ko' | 'ja')[];

  // Card context — passed from frontend to build rich explanation without external API
  @IsOptional() @IsString() cardKo?: string;
  @IsOptional() @IsString() cardJa?: string;
  @IsOptional() @IsString() cardKoReading?: string;
  @IsOptional() @IsString() cardJaReading?: string;

  // UI locale — explanation is generated in this language
  @IsOptional()
  @IsIn(['en', 'ko', 'ja'])
  locale?: 'en' | 'ko' | 'ja';
}
