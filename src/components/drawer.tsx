import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Menu } from "lucide-react";

import { useRecoilValue, useRecoilValueLoadable } from "recoil";
// import { profileSelector } from "@/state/profileAtom";
// import { userAtom } from "@/state/userAtom";
// import { Player } from "@/types/session";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { navItems } from "@/lib/navItems";

const nav_items = navItems;

const DrawerBTN: React.FC = () => {
  return (
    <Drawer direction="right">
      <DrawerTrigger>
        <Menu className="text-primary font-bold cursor-pointer" />
      </DrawerTrigger>
      <DrawerContent className="w-[100px]">
        <DrawerHeader>
          <DrawerTitle>Hi, There!</DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>
        <div></div>
        <div
          className="flex flex-col items-center gap-3 text-primary
    font-bold [&>a]:cursor-pointer [&>a]:transition-colors [&>a]:duration-200
    [&>a:hover]:text-primary/50 divide-y divide-gray-300"
        >
          <div className="flex gap-4 items-center"></div>

          {/* Profile (also closes drawer) */}
          {/* {user ? (
            <DrawerClose asChild>
              <Link to="/profile" className="py-2 w-full flex items-center justify-center">
                <Avatar>
                  <AvatarImage src={user.profilePic as string}/>
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Link>
            </DrawerClose>
          ) : null} */}

          {/* Home */}

          {nav_items.map((item) => (
            <DrawerClose asChild key={item.href}>
              <Link to={item.href} className="py-2 w-full text-center">
                {item.name}
              </Link>
            </DrawerClose>
          ))}
        </div>
        <DrawerFooter>
          <DrawerClose></DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default DrawerBTN;
