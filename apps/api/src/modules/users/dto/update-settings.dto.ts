import { IsBoolean, IsIn, IsOptional } from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional()
  @IsIn(['KR', 'JP', 'BOTH'])
  learningMode?: 'KR' | 'JP' | 'BOTH';

  @IsOptional()
  @IsBoolean()
  notifications?: boolean;
}
