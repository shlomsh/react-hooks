import { useCallback, useReducer } from "react";

export interface EditorFile {
  filename: string;
  language: string;
  content: string;
}

interface EditorState {
  files: EditorFile[];
  activeIndex: number;
  hasErrors: boolean;
}

type EditorAction =
  | { type: "SET_ACTIVE"; index: number }
  | { type: "UPDATE_CONTENT"; index: number; content: string }
  | { type: "SET_HAS_ERRORS"; hasErrors: boolean }
  | { type: "RESET_FILES"; files: EditorFile[] };

const STARTER_FILES: EditorFile[] = [
  {
    filename: "usePaginatedQuery.ts",
    language: "typescript",
    content: `import { useState, useEffect, useCallback } from "react";

interface PaginatedResult<T> {
  data: T[];
  page: number;
  totalPages: number;
  isLoading: boolean;
  error: Error | null;
  nextPage: () => void;
  prevPage: () => void;
}

export function usePaginatedQuery<T>(
  query: string,
  pageSize: number = 10
): PaginatedResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);

    fetch(\`/api/search?q=\${query}&page=\${page}&size=\${pageSize}\`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result.items);
        setTotalPages(result.totalPages);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err);
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [query, page, pageSize]);

  const nextPage = useCallback(() => {
    setPage((p) => Math.min(p + 1, totalPages));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setPage((p) => Math.max(p - 1, 1));
  }, []);

  return { data, page, totalPages, isLoading, error, nextPage, prevPage };
}
`,
  },
  {
    filename: "App.tsx",
    language: "typescript",
    content: `import { useState } from "react";
import { usePaginatedQuery } from "./usePaginatedQuery";

interface SearchResult {
  id: string;
  title: string;
  score: number;
}

export default function App() {
  const [query, setQuery] = useState("react hooks");
  const { data, page, totalPages, isLoading, nextPage, prevPage } =
    usePaginatedQuery<SearchResult>(query);

  return (
    <div style={{ padding: "1rem" }}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {data.map((item) => (
            <li key={item.id}>
              {item.title} (score: {item.score})
            </li>
          ))}
        </ul>
      )}

      <div>
        <button onClick={prevPage} disabled={page <= 1}>
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button onClick={nextPage} disabled={page >= totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}
`,
  },
];

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case "SET_ACTIVE":
      return { ...state, activeIndex: action.index };
    case "UPDATE_CONTENT":
      return {
        ...state,
        files: state.files.map((f, i) =>
          i === action.index ? { ...f, content: action.content } : f
        ),
      };
    case "SET_HAS_ERRORS":
      return { ...state, hasErrors: action.hasErrors };
    case "RESET_FILES":
      return {
        files: action.files,
        activeIndex: 0,
        hasErrors: false,
      };
    default:
      return state;
  }
}

export function useEditorState(initialFiles?: EditorFile[]) {
  const starterFiles = initialFiles && initialFiles.length > 0 ? initialFiles : STARTER_FILES;
  const [state, dispatch] = useReducer(editorReducer, {
    files: starterFiles,
    activeIndex: 0,
    hasErrors: false,
  });

  const setActiveFile = useCallback((index: number) => {
    dispatch({ type: "SET_ACTIVE", index });
  }, []);

  const updateContent = useCallback((index: number, content: string) => {
    dispatch({ type: "UPDATE_CONTENT", index, content });
  }, []);

  const setHasErrors = useCallback((hasErrors: boolean) => {
    dispatch({ type: "SET_HAS_ERRORS", hasErrors });
  }, []);

  const resetFiles = useCallback(
    (files?: EditorFile[]) => {
      dispatch({ type: "RESET_FILES", files: files ?? starterFiles });
    },
    [starterFiles]
  );

  return {
    files: state.files,
    activeIndex: state.activeIndex,
    activeFile: state.files[state.activeIndex],
    hasErrors: state.hasErrors,
    setActiveFile,
    updateContent,
    setHasErrors,
    resetFiles,
  };
}
