import { useEffect } from "react";

/** Keeps the document title in sync with the active route. */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
