// components/custom-breadcrumb.tsx
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

interface BreadcrumbProps {
  items: {
    label: string;
    href?: string;
  }[];
  variant?: "top" | "back";
}

export function CustomBreadcrumb({ items, variant = "top" }: BreadcrumbProps) {
  if (variant === "top") {
    return (
      <div className="mb-4">
        <Breadcrumb>
          <BreadcrumbList>
            {items.map((item, index) => (
              <BreadcrumbItem key={index}>
                {item.href ? (
                  <BreadcrumbLink href={item.href} className="text-[#FF4647]">
                    {item.label}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                )}
                {index < items.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-[#FF4647]" />
                )}
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <ChevronLeft className="h-4 w-4 text-gray-500" />
            <BreadcrumbLink href={items[0].href!} className="text-[#FF4647]">
              {items[0].label}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
