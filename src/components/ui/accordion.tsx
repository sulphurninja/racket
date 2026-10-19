"use client";

import { Plus } from "lucide-react";
import { Accordion as A } from "radix-ui";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Accordion({
  items,
  defaultValue,
  className,
}: {
  items: { value: string; title: ReactNode; content: ReactNode }[];
  defaultValue?: string[];
  className?: string;
}) {
  return (
    <A.Root type="multiple" defaultValue={defaultValue} className={cn("border-t border-line", className)}>
      {items.map((item) => (
        <A.Item key={item.value} value={item.value} className="border-b border-line">
          <A.Header>
            <A.Trigger className="group flex w-full items-center justify-between gap-6 py-5 text-left text-[15px] font-medium tracking-[-0.01em]">
              {item.title}
              <Plus
                className="h-4 w-4 shrink-0 transition-transform duration-500 ease-[var(--ease-out-expo)] group-data-[state=open]:rotate-45"
                strokeWidth={1.6}
              />
            </A.Trigger>
          </A.Header>
          <A.Content className="overflow-hidden data-[state=closed]:animate-[rk-acc-up_300ms_var(--ease-out-quart)] data-[state=open]:animate-[rk-acc-down_400ms_var(--ease-out-expo)]">
            <div className="pb-6 text-[15px] leading-relaxed text-ink/70">{item.content}</div>
          </A.Content>
        </A.Item>
      ))}
    </A.Root>
  );
}
