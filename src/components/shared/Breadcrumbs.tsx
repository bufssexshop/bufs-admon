import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";

export function Breadcrumbs() {
  const breadcrumbs = useBreadcrumbs();

  return (
    <nav className="flex items-center gap-2 text-sm">
      {breadcrumbs.map((crumb, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-slate-400" />
          )}
          {crumb.href ? (
            <Link
              to={crumb.href}
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              {crumb.label}
            </Link>
          ) : (
            <span className="font-medium text-slate-900">{crumb.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}