export interface UpstoxConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  accessToken?: string;
}

export class UpstoxService {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private accessToken?: string;

  constructor(config: UpstoxConfig) {
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.redirectUri = config.redirectUri;
    this.accessToken = config.accessToken;
  }

  public getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
    });
    return `https://api.upstox.com/v2/login/authorization/dialog?${params.toString()}`;
  }

  public async getMarketQuote(instrumentKeys: string[]) {
    // Upstox API V3 Market Quote endpoint wrapper
    if (!this.accessToken) {
      throw new Error('Upstox Access Token is missing.');
    }
    try {
      const response = await fetch(`https://api.upstox.com/v2/market-quote/quotes?instrument_key=${instrumentKeys.join(',')}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept': 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching Upstox market quote:', error);
      throw error;
    }
  }

  public async getOptionChain(instrumentKey: string, expiryDate: string) {
    if (!this.accessToken) {
      throw new Error('Upstox Access Token is missing.');
    }
    try {
      const response = await fetch(`https://api.upstox.com/v2/option/chain?instrument_key=${instrumentKey}&expiry_date=${expiryDate}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept': 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching Upstox option chain:', error);
      throw error;
    }
  }

  // Mandatory Safety Boundary: Order execution is strictly blocked unless TRADING_ENABLED=true
  public async placeOrder(orderPayload: any) {
    if (process.env.TRADING_ENABLED !== 'true') {
      throw new Error('Trading functionality is currently disabled on CapitalSphere per safety policy (TRADING_ENABLED=false).');
    }
    // Execution pathway dormant
    throw new Error('Trading service isolated.');
  }
}
