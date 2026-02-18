import { useRef, useCallback } from "react";
import Editor from "@monaco-editor/react";
import type { OnMount, BeforeMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import styles from "./CodeEditor.module.css";

interface CodeEditorProps {
  value: string;
  language: string;
  onChange: (value: string) => void;
  onErrorsChange: (hasErrors: boolean) => void;
}

const BLUEPRINT_THEME: editor.IStandaloneThemeData = {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "", foreground: "e9f0ff", background: "121a31" },
    { token: "comment", foreground: "7f95ba", fontStyle: "italic" },
    { token: "keyword", foreground: "c792ea" },
    { token: "string", foreground: "c3e88d" },
    { token: "number", foreground: "f78c6c" },
    { token: "type", foreground: "22d3ee" },
    { token: "type.identifier", foreground: "22d3ee" },
    { token: "identifier", foreground: "e9f0ff" },
    { token: "function", foreground: "82aaff" },
    { token: "operator", foreground: "89ddff" },
    { token: "delimiter", foreground: "89ddff" },
    { token: "delimiter.bracket", foreground: "9fb3dd" },
    { token: "variable", foreground: "e9f0ff" },
    { token: "constant", foreground: "f78c6c" },
  ],
  colors: {
    "editor.background": "#121a31",
    "editor.foreground": "#e9f0ff",
    "editor.lineHighlightBackground": "#1a264440",
    "editor.selectionBackground": "#22335d80",
    "editor.inactiveSelectionBackground": "#22335d40",
    "editorCursor.foreground": "#22d3ee",
    "editorLineNumber.foreground": "#7f95ba50",
    "editorLineNumber.activeForeground": "#9fb3dd",
    "editorIndentGuide.background": "#1a264440",
    "editorIndentGuide.activeBackground": "#22335d60",
    "editorWidget.background": "#0b1020",
    "editorWidget.border": "#1a2644",
    "editorSuggestWidget.background": "#0b1020",
    "editorSuggestWidget.border": "#1a2644",
    "editorSuggestWidget.selectedBackground": "#22335d",
    "editorSuggestWidget.highlightForeground": "#22d3ee",
    "editorHoverWidget.background": "#0b1020",
    "editorHoverWidget.border": "#1a2644",
    "editorGutter.background": "#121a31",
    "scrollbar.shadow": "#00000000",
    "scrollbarSlider.background": "#9fb3dd28",
    "scrollbarSlider.hoverBackground": "#9fb3dd40",
    "scrollbarSlider.activeBackground": "#9fb3dd50",
  },
};

export function CodeEditor({
  value,
  language,
  onChange,
  onErrorsChange,
}: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleBeforeMount: BeforeMount = useCallback((monaco) => {
    monaco.editor.defineTheme("blueprint-lab", BLUEPRINT_THEME);

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      moduleResolution:
        monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      jsx: monaco.languages.typescript.JsxEmit.ReactJSX,
      strict: true,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
      forceConsistentCasingInFileNames: true,
      isolatedModules: true,
      noEmit: true,
      lib: ["esnext", "dom", "dom.iterable"],
    });

    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });

    // Add React type stubs so useState/useEffect etc. resolve
    const reactTypes = `
      declare module "react" {
        export function useState<T>(initialState: T | (() => T)): [T, (value: T | ((prev: T) => T)) => void];
        export function useEffect(effect: () => void | (() => void), deps?: readonly unknown[]): void;
        export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: readonly unknown[]): T;
        export function useMemo<T>(factory: () => T, deps: readonly unknown[]): T;
        export function useRef<T>(initialValue: T): { current: T };
        export function useReducer<S, A>(reducer: (state: S, action: A) => S, initialState: S): [S, (action: A) => void];
        export function useContext<T>(context: React.Context<T>): T;
        export type FC<P = {}> = (props: P) => JSX.Element | null;
        export type ReactNode = string | number | boolean | null | undefined | JSX.Element;
        export interface Context<T> { Provider: FC<{ value: T; children?: ReactNode }>; }
        export function createContext<T>(defaultValue: T): Context<T>;
      }
    `;
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      reactTypes,
      "file:///node_modules/@types/react/index.d.ts"
    );
  }, []);

  const handleMount: OnMount = useCallback(
    (editor, monaco) => {
      editorRef.current = editor;

      // Track diagnostics to enable/disable Run button
      const model = editor.getModel();
      if (model) {
        monaco.editor.onDidChangeMarkers(([resource]) => {
          if (resource.toString() === model.uri.toString()) {
            const markers = monaco.editor.getModelMarkers({ resource });
            const hasBlockingErrors = markers.some(
              (m) => m.severity === monaco.MarkerSeverity.Error
            );
            onErrorsChange(hasBlockingErrors);
          }
        });
      }

      editor.focus();
    },
    [onErrorsChange]
  );

  const handleChange = useCallback(
    (val: string | undefined) => {
      if (val !== undefined) {
        onChange(val);
      }
    },
    [onChange]
  );

  return (
    <div className={styles.wrapper}>
      <Editor
        height="100%"
        language={language}
        value={value}
        theme="blueprint-lab"
        beforeMount={handleBeforeMount}
        onMount={handleMount}
        onChange={handleChange}
        options={{
          fontSize: 13,
          fontFamily: "'IBM Plex Mono', monospace",
          fontLigatures: false,
          lineHeight: 22,
          padding: { top: 12, bottom: 12 },
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          renderLineHighlight: "line",
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          smoothScrolling: true,
          tabSize: 2,
          wordWrap: "on",
          automaticLayout: true,
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
          bracketPairColorization: { enabled: true },
          guides: { indentation: true, bracketPairs: true },
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          overviewRulerBorder: false,
          scrollbar: {
            verticalScrollbarSize: 6,
            horizontalScrollbarSize: 6,
          },
        }}
      />
    </div>
  );
}
