"use client";

export const UserInputMessage = (props: {
	content: string;
	variant?: "sidebar" | "mainscreen";
}) => {
	const { variant = "sidebar" } = props;
	return (
		<div>
			{variant === "sidebar" && (
				<div className="w-full justify-end flex my-1">
					<div className="rounded-lg p-2 max-w-[80%] bg-gray-100 text-gray-800">
						{props.content}
					</div>
				</div>
			)}
			{variant === "mainscreen" && (
				// 这个样式 chatgpt
				<div className="text-base py-[18px] px-3 md:px-4 m-auto w-full lg:px-1 xl:px-5">
					<div className="mx-auto flex flex-1 gap-4 text-base md:gap-5 lg:gap-6 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem]">
						<div className="group/conversation-turn relative flex w-full min-w-0 flex-col">
							<div className="flex-col gap-1 md:gap-3">
								<div className="flex max-w-full flex-col flex-grow">
									<div
										data-message-author-role="user"
										data-message-id="aaa2f469-0960-4bb1-b95c-2148f9861a48"
										dir="auto"
										className="min-h-[20px] text-message flex w-full flex-col items-end gap-2 break-words [.text-message+&amp;]:mt-5 overflow-x-auto whitespace-normal"
									>
										<div className="flex w-full flex-col gap-1 empty:hidden items-end rtl:items-start">
											<div className="relative max-w-[70%] rounded-3xl bg-[#f4f4f4] px-5 py-2.5 dark:bg-token-main-surface-secondary">
												<div className="whitespace-pre-wrap">
													{props.content}
												</div>
												<div className="absolute bottom-0 right-full top-0 -mr-3.5 hidden pr-5 pt-1 [.group\/conversation-turn:hover_&amp;]:block">
													<span className="" data-state="closed">
														{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
														<button
															aria-label="Edit message"
															className="flex h-9 w-9 items-center justify-center rounded-full text-token-text-secondary transition hover:bg-token-main-surface-tertiary"
														>
															{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
															<svg
																width="24"
																height="24"
																viewBox="0 0 24 24"
																fill="none"
																xmlns="http://www.w3.org/2000/svg"
																className="icon-md"
															>
																<path
																	fill-rule="evenodd"
																	clip-rule="evenodd"
																	d="M13.2929 4.29291C15.0641 2.52167 17.9359 2.52167 19.7071 4.2929C21.4784 6.06414 21.4784 8.93588 19.7071 10.7071L18.7073 11.7069L11.6135 18.8007C10.8766 19.5376 9.92793 20.0258 8.89999 20.1971L4.16441 20.9864C3.84585 21.0395 3.52127 20.9355 3.29291 20.7071C3.06454 20.4788 2.96053 20.1542 3.01362 19.8356L3.80288 15.1C3.9742 14.0721 4.46243 13.1234 5.19932 12.3865L13.2929 4.29291ZM13 7.41422L6.61353 13.8007C6.1714 14.2428 5.87846 14.8121 5.77567 15.4288L5.21656 18.7835L8.57119 18.2244C9.18795 18.1216 9.75719 17.8286 10.1993 17.3865L16.5858 11L13 7.41422ZM18 9.5858L14.4142 6.00001L14.7071 5.70712C15.6973 4.71693 17.3027 4.71693 18.2929 5.70712C19.2831 6.69731 19.2831 8.30272 18.2929 9.29291L18 9.5858Z"
																	fill="currentColor"
																/>
															</svg>
														</button>
													</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
