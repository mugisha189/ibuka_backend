import { ApiPropertyOptional } from '@nestjs/swagger';

export class BeneficiaryDto {
  @ApiPropertyOptional({ description: 'ID of the member (if beneficiary is a member)' })
  memberId?: string;

  @ApiPropertyOptional({ description: 'Name of the member (if beneficiary is a member)' })
  memberName?: string;

  @ApiPropertyOptional({ description: 'ID of the family (if beneficiary is a family)' })
  familyId?: string;

  @ApiPropertyOptional({ description: 'Name of the family (if beneficiary is a family)' })
  familyName?: string;
}