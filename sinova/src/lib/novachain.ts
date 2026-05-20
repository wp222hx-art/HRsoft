// NovaChain — demo hash anchoring layer.
// In production this would call OpenAttestation / Polygon / Hyperledger Fabric.
// In demo mode we generate stable SHA-256 hashes and synthetic tx IDs.
import { createHash, randomBytes } from 'crypto';

export function hashContent(content: string | Buffer): string {
  const h = createHash('sha256');
  h.update(content);
  return '0x' + h.digest('hex');
}

export function syntheticTxId(): string {
  // Demo Polygon-style tx hash
  return '0x' + randomBytes(32).toString('hex');
}

export function anchor(name: string, payload: string): { hash: string; txId: string; chain: string } {
  const hash = hashContent(`${name}|${payload}|${Date.now()}`);
  return {
    hash,
    txId: syntheticTxId(),
    chain: 'novachain-demo (mock OpenAttestation)',
  };
}
