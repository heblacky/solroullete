export type SiteConfig = {
  name: string;
  description: string;
  navItems: {
    label: string;
    href: string;
  }[];
  navMenuItems: {
    label: string;
    href: string;
  }[];
  links: {
    github: string;
    twitter: string;
    discord: string;
    telegram: string;
  };
};

export const siteConfig: SiteConfig = {
  name: "SolRoulette",
  description: "A decentralized roulette game on Solana",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Play",
      href: "/solroulette",
    },
    {
      label: "About",
      href: "/about",
    },
  ],
  navMenuItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Play",
      href: "/solroulette",
    },
    {
      label: "About",
      href: "/about",
    },
  ],
  links: {
    github: "https://github.com/heblacky/solroullete",
    twitter: "https://twitter.com",
    discord: "https://discord.com",
    telegram: "https://t.me",
  },
}; 