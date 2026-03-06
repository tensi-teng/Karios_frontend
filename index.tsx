import "./index.css";
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { SuiClientProvider, WalletProvider, createNetworkConfig } from '@mysten/dapp-kit';
import { getJsonRpcFullnodeUrl } from '@mysten/sui/jsonRpc';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import "@mysten/dapp-kit/dist/index.css";

const { networkConfig } = createNetworkConfig({
	devnet: { url: getJsonRpcFullnodeUrl('devnet') },
	testnet: { url: getJsonRpcFullnodeUrl('testnet') },
	mainnet: { url: getJsonRpcFullnodeUrl('mainnet') },
});
const queryClient = new QueryClient();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<SuiClientProvider networks={networkConfig} defaultNetwork="devnet">
				<WalletProvider autoConnect>
					<App />
				</WalletProvider>
			</SuiClientProvider>
		</QueryClientProvider>
  </React.StrictMode>
);
