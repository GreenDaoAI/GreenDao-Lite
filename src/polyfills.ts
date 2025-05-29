
import { Buffer } from 'buffer';

// Make Buffer available globally for Solana packages
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
  (globalThis as any).Buffer = Buffer;
}
