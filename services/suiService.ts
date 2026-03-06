import { Transaction } from '@mysten/sui/transactions';
import { SuiJsonRpcClient, getJsonRpcFullnodeUrl } from '@mysten/sui/jsonRpc';
import { Capsule, Beneficiary, UnlockRuleType } from '../types.ts';

// --- Constants ---
const PACKAGE_ID = '0x8ef483e991274ae8702a598c213c429acb175f5efa26b9ed52ba86c1e67b6d63'; // Deployed Package ID
const MODULE_NAME = 'capsule_engine';
const CLOCK_OBJECT_ID = '0x6';

// --- Sui Client Setup ---
const suiClient = new SuiJsonRpcClient({ url: getJsonRpcFullnodeUrl('devnet') });

export class SuiService {
  /**
   * Calls 'create_capsule' entry function.
   */
  static async createCapsule(
    tx: Transaction,
    title: string,
    description: string,
    category: number,
    blobId: string,
    sealRootHash: number[]
  ) {
    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::create_capsule`,
      arguments: [
        tx.pure.string(title),
        tx.pure.string(description),
        tx.pure.u8(category),
        tx.pure.string(blobId),
        tx.pure.vector('u8', sealRootHash),
        tx.object(CLOCK_OBJECT_ID),
      ],
    });
    return tx;
  }

  /**
   * Calls 'seal_capsule' entry function.
   */
  static async sealCapsule(tx: Transaction, capsuleObjectId: string) {
    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::seal_capsule`,
      arguments: [tx.object(capsuleObjectId)],
    });
    return tx;
  }

  /**
   * Calls 'ping' entry function.
   */
  static async ping(tx: Transaction, capsuleObjectId: string) {
    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::ping`,
      arguments: [tx.object(capsuleObjectId), tx.object(CLOCK_OBJECT_ID)],
    });
    return tx;
  }

  /**
   * Maps category string to Move constant.
   */
  static getCategoryNumber(category: string): number {
    switch (category) {
      case 'PERSONAL': return 0;
      case 'CRYPTO': return 1;
      case 'LEGAL': return 2;
      case 'BUSINESS': return 3;
      default: return 0;
    }
  }

  /**
   * Maps role string to Move constant.
   */
  static getRoleNumber(role: string): number {
    switch (role) {
      case 'HEIR': return 0;
      case 'PROXY_GUARDIAN': return 1;
      default: return 0;
    }
  }
}
