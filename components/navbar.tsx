import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import {
  TwitterIcon,
  GithubIcon,
  DiscordIcon,
  TelegramIcon,
  Logo,
} from "@/components/icons";

export const Navbar = () => {
  return (
    <div className="w-full bg-[#0A0A0A]/70 backdrop-blur-sm border-b border-[#1A1A1A]">
      <HeroUINavbar 
        maxWidth="xl" 
        position="sticky"
        classNames={{
          wrapper: "bg-transparent",
          base: "h-16",
        }}
      >
        <NavbarContent className="flex-1" justify="start">
          <NavbarBrand className="gap-3 max-w-fit">
            <NextLink className="flex justify-start items-center gap-1" href="/">
              <Logo />
              <p className="font-bold text-white">PayDexBro</p>
            </NextLink>
          </NavbarBrand>
          <div className="hidden lg:flex gap-4 justify-start ml-2">
            {siteConfig.navItems.map((item) => (
              <NavbarItem key={item.href}>
                <NextLink
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    "data-[active=true]:text-[#8B5CF6] data-[active=true]:font-medium text-sm text-[#A1A1AA] hover:text-white transition-colors"
                  )}
                  color="foreground"
                  href={item.href}
                >
                  {item.label}
                </NextLink>
              </NavbarItem>
            ))}
          </div>
        </NavbarContent>

        <NavbarContent
          className="hidden sm:flex flex-1"
          justify="end"
        >
          <NavbarItem className="hidden sm:flex gap-2">
            <Link isExternal href={siteConfig.links.twitter} title="Twitter">
              <TwitterIcon className="text-[#71717A] hover:text-white transition-colors" />
            </Link>
            <Link isExternal href={siteConfig.links.discord} title="Discord">
              <DiscordIcon className="text-[#71717A] hover:text-white transition-colors" />
            </Link>
            <Link isExternal href={siteConfig.links.telegram} title="Telegram">
              <TelegramIcon className="text-[#71717A] hover:text-white transition-colors" />
            </Link>
            <Link isExternal href={siteConfig.links.github} title="GitHub">
              <GithubIcon className="text-[#71717A] hover:text-white transition-colors" />
            </Link>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
          <NavbarMenuToggle />
        </NavbarContent>

        <NavbarMenu className="bg-[#0A0A0A] border-t border-[#1A1A1A]">
          <div className="mx-4 mt-2 flex flex-col gap-2">
            {siteConfig.navMenuItems.map((item, index) => (
              <NavbarMenuItem key={`${item}-${index}`}>
                <Link
                  color="foreground"
                  href={item.href}
                  size="lg"
                  className="text-sm text-[#A1A1AA] hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              </NavbarMenuItem>
            ))}
          </div>
        </NavbarMenu>
      </HeroUINavbar>
    </div>
  );
};
