import React, { useState } from "react";
import NextLink from "next/link";
import { siteConfig } from "@/config/site";
import {
  TwitterIcon,
  GithubIcon,
  DiscordIcon,
  TelegramIcon,
  Logo,
} from "@/components/icons";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="w-full bg-[#0A0A0A]/70 backdrop-blur-sm border-b border-[#1A1A1A]">
      <nav className="flex items-center justify-between px-4 py-3 max-w-screen-xl mx-auto h-16">
        <div className="flex items-center">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo />
            <p className="font-bold text-white">SolRoulette</p>
          </NextLink>
          
          <div className="hidden lg:flex gap-4 justify-start ml-6">
            {siteConfig.navItems.map((item) => (
              <div key={item.href}>
                <NextLink
                  className="text-sm text-[#A1A1AA] hover:text-white transition-colors"
                  href={item.href}
                >
                  {item.label}
                </NextLink>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <a href={siteConfig.links.twitter} title="Twitter" target="_blank" rel="noopener noreferrer">
            <TwitterIcon className="text-[#71717A] hover:text-white transition-colors" />
          </a>
          <a href={siteConfig.links.discord} title="Discord" target="_blank" rel="noopener noreferrer">
            <DiscordIcon className="text-[#71717A] hover:text-white transition-colors" />
          </a>
          <a href={siteConfig.links.telegram} title="Telegram" target="_blank" rel="noopener noreferrer">
            <TelegramIcon className="text-[#71717A] hover:text-white transition-colors" />
          </a>
          <a href={siteConfig.links.github} title="GitHub" target="_blank" rel="noopener noreferrer">
            <GithubIcon className="text-[#71717A] hover:text-white transition-colors" />
          </a>
        </div>

        <button 
          className="sm:hidden" 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6H21M3 12H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <div className="sm:hidden bg-[#0A0A0A] border-t border-[#1A1A1A] px-4 py-2">
          <div className="flex flex-col gap-2">
            {siteConfig.navMenuItems.map((item, index) => (
              <div key={`${item.label}-${index}`}>
                <NextLink
                  href={item.href}
                  className="text-sm text-[#A1A1AA] hover:text-white transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </NextLink>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
