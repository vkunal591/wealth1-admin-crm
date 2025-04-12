"use client";

import Link from "next/link";
import { tabs } from "@/data/tabs";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { userPermissions } from "@/data/permission";
import { RiArrowDropDownLine } from "react-icons/ri";

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { token } = useAuth();
  const [list, showList] = useState<any>({ tab: "", list: [] });

  if (!token) return null;

  let filteredTabs: any = [];
  if (userPermissions && userPermissions.length > 0) {
    filteredTabs = tabs.filter((tab) =>
      userPermissions.some(
        (permission: any) =>
          permission?.module === tab.permission && permission?.access?.read
      )
    );
  }

  return (
    <div
      className={`fixed w-[17%] text-white bg-primary h-full overflow-y-scroll no-scrollbar`}
    >
      <div className="flex justify-center border-b border-b-secondary bg-primary w-[17%] items-center py-[11px] fixed top-0">
        {/* <Image
          priority
          width={ 50}
          height={50}
          alt="SkyField Logo"
          unoptimized
          src={"/assets/bg/logo.png"}
          className="filter invert"
        /> */}
        <h2 className="text-5xl">Wealth1</h2>
      </div>
      <nav className="flex flex-col gap-2 justify-center items-center mt-[72px] mb-40">
        {filteredTabs.map((tab: any) => {
          const Icon = tab.icon;
          return (
            <React.Fragment key={tab?.id}>
              <Link
                href={tab?.href}
                aria-label={tab?.label}
                onClick={() => {
                  if (list?.list.length > 0 && list?.tab === tab?.permission)
                    return showList({ tab: "", list: [] });
                  if (tab?.tabs && tab?.tabs.length > 0)
                    showList({ tab: tab?.permission, list: tab?.tabs });
                }}
                className={`py-3 pl-5 mr-auto w-[95%] pr-2 text-sm cursor-pointer hover:bg-secondary transition rounded-r-full text-info flex justify-between gap-2 items-center border-primary hover:text-white ${
                  pathname === tab?.href &&
                  "bg-white/20 rounded-r-full text-white font-semibold"
                }`}
              >
                <span className="flex gap-2 items-center">
                  <Icon size={18} /> {tab?.label}
                </span>
                {tab?.tabs && tab?.tabs.length > 0 && (
                  <RiArrowDropDownLine size={23} className="w-fit" />
                )}
              </Link>
              {list?.tab === tab?.permission && (
                <div
                  onMouseEnter={() =>
                    showList({ tab: tab?.permission, list: tab?.tabs })
                  }
                  className="flex flex-col w-full bg-secondary"
                >
                  {list?.list &&
                    list?.list.length > 0 &&
                    list?.list.map((tabChild: any, index: number) => {
                      const Icon = tabChild.icon;
                      return (
                        <Link
                          href={tabChild?.href}
                          key={`index+${index}`}
                          aria-label={tabChild?.label}
                          className="w-full text-xs text-info pl-7 gap-2 py-3 flex items-center hover:bg-white/20 hover:text-white"
                        >
                          <Icon className="text-base" /> {tabChild?.label}
                        </Link>
                      );
                    })}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
