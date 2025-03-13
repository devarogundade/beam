import { scrollSepolia } from "viem/chains";
import { walletConnect } from "@wagmi/connectors";
import { defaultWagmiConfig } from "@web3modal/wagmi";

const metadata = {
  name: "Beam Pay",
  description: "Beam Pay",
  url: "https://beam-pay.netlify.app",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

export const chains = [scrollSepolia];

export const config = defaultWagmiConfig({
  // @ts-ignore
  chains,
  projectId: import.meta.env.VITE_PROJECT_ID,
  metadata,
  connectors: [
    walletConnect({
      projectId: import.meta.env.VITE_PROJECT_ID,
    }),
  ],
});
