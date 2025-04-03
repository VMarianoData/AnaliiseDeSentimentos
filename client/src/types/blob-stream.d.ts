declare module 'blob-stream' {
  type BlobStream = {
    on(event: 'finish' | 'error', callback: (err?: any) => void): void;
    pipe<T>(destination: T): T;
    toBlobURL(contentType: string): string;
  }
  
  function blobStream(): BlobStream;
  export default blobStream;
}