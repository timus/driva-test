import { IsString, Matches, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoanIdDTO {
    @IsString()
    @IsNotEmpty()
    @Matches(/^[a-zA-Z0-9_-]+$/, {
        message: 'ID must contain only letters, numbers, underscores, and hyphens',
    })
    id!: string;
}
