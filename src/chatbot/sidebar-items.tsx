"use client";

import { AnimatePresence, motion } from "framer-motion";
import { SidebarActions } from "./sidebar-actions";
import { SidebarItem } from "./sidebar-item";

interface SidebarItemsProps {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	chats?: any[];
}

export function SidebarItems({ chats }: SidebarItemsProps) {
	if (!chats?.length) return null;

	return (
		<AnimatePresence>
			{chats.map(
				(chat, index) =>
					chat && (
						<motion.div
							key={chat?.id}
							exit={{
								opacity: 0,
								height: 0,
							}}
						>
							{/* @ts-ignore */}
							<SidebarItem index={index} item={chat}>
								<SidebarActions
									//@ts-ignore
									chat={chat}
									// removeChat={removeChat}
									// shareChat={shareChat}
								/>
							</SidebarItem>
						</motion.div>
					),
			)}
		</AnimatePresence>
	);
}
