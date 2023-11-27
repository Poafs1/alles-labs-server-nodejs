interface IConstants {
  globalPrefix: string;
  enableCors: boolean;
  swagger: {
    title: string;
    description: string;
    version: string;
    prefix: string;
  };
}

export const CONSTANTS: IConstants = {
  globalPrefix: '/api',
  enableCors: process.env.NODE_ENV === 'production',
  swagger: {
    title: 'Alles Labs Server NodeJS',
    description: '',
    version: '1.0',
    prefix: '/api/spec',
  },
};
