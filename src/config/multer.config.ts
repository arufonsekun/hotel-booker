import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';

export const uploadPaymentProofMulterOptions: MulterOptions = {
  storage: diskStorage({
    destination: './payments',
    filename: (req, file, cb) => {
      const fileRandomUUID = randomUUID();
      const separatorBetweenUUIDAndFileName = '@';
      const fileOriginalName = file.originalname;
      cb(
        null,
        `${fileRandomUUID}${separatorBetweenUUIDAndFileName}${fileOriginalName}`,
      );
    },
  }),
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|pdf)$/)) {
      return cb(
        new Error('Apenas imagens ou arquivos PDFs são permitidos!'),
        false,
      );
    }
    cb(null, true);
  },
};
