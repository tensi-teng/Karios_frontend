
/**
 * WalrusService handles the uploading and downloading of blobs 
 * to the Walrus decentralized storage network.
 */
export class WalrusService {
  // Official Testnet Aggregator/Publisher URLs
  private static PUBLISHER_URL = 'https://publisher.walrus-testnet.walrus.space';
  private static AGGREGATOR_URL = 'https://aggregator.walrus-testnet.walrus.space';

  /**
   * Uploads an encrypted blob to Walrus.
   * @param data The encrypted string or Buffer to store.
   * @param epochs Number of epochs to store the data (default 1).
   * @returns The blobId (suiRef) of the stored data.
   */
  static async uploadBlob(data: string | Uint8Array, epochs: number = 1): Promise<string> {
    try {
      const response = await fetch(`${this.PUBLISHER_URL}/v1/blobs?epochs=${epochs}`, {
        method: 'PUT',
        body: data,
      });

      if (!response.ok) {
        throw new Error(`Walrus upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Walrus returns blobId in various formats depending on the API version.
      const blobId = result.newlyCreated?.blobObject?.blobId || result.alreadyCertified?.blobId;
      
      if (!blobId) {
        throw new Error("Failed to retrieve blobId from Walrus response");
      }

      return blobId;
    } catch (error) {
      console.error("Walrus Upload Error:", error);
      throw error;
    }
  }

  /**
   * Generates a display URL for a Walrus blob.
   */
  static getBlobUrl(blobId: string): string {
    return `${this.AGGREGATOR_URL}/v1/blobs/${blobId}`;
  }
}
