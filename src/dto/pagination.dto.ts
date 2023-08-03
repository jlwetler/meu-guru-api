import { IsNumberString, IsOptional } from 'class-validator';

export class PaginationDTO {
  @IsNumberString()
  @IsOptional()
  page: string;

  @IsNumberString()
  @IsOptional()
  pageSize: string;
}
