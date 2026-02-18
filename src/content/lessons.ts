import type { Lesson } from "../types/lesson-schema";
import type { LessonManifest } from "./lesson-manifest";

const manifestModules = import.meta.glob("./lessons/*/lesson.ts", {
  eager: true,
  import: "default",
}) as Record<string, LessonManifest>;

const starterFileModules = import.meta.glob("./lessons/*/files/*.{ts,tsx}", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

function resolveStarterCode(manifestPath: string, starterFile: string): string {
  const manifestDir = manifestPath.slice(0, manifestPath.lastIndexOf("/"));
  const candidatePath = `${manifestDir}/files/${starterFile}`;
  const source = starterFileModules[candidatePath];
  if (!source) {
    throw new Error(`Missing starter file '${starterFile}' for lesson manifest '${manifestPath}'.`);
  }
  return source;
}

function materializeLesson(manifestPath: string, manifest: LessonManifest): Lesson {
  return {
    ...manifest,
    files: manifest.files.map((file) => ({
      fileName: file.fileName,
      language: file.language,
      editable: file.editable,
      hidden: file.hidden,
      category: file.category,
      starterCode: resolveStarterCode(manifestPath, file.starterFile),
    })),
  };
}

export const lessons: Lesson[] = Object.entries(manifestModules)
  .map(([path, manifest]) => materializeLesson(path, manifest))
  .sort((a, b) => a.module.order - b.module.order);

export function getLessonByIndex(index: number): Lesson {
  if (!Number.isFinite(index) || index < 0 || index >= lessons.length) {
    return lessons[0];
  }
  return lessons[index];
}
