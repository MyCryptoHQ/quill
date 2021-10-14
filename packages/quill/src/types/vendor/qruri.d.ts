declare module 'qruri' {
  export default function (
    text: string,
    options: {
      ecclevel: 'M';
      margin: number;
    }
  ): string;
}
