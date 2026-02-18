import type { ExerciseFile, Lesson } from "../types/lesson-schema";

export interface LessonManifestFile extends Omit<ExerciseFile, "starterCode"> {
  starterFile: string;
}

export interface LessonManifest extends Omit<Lesson, "files"> {
  files: LessonManifestFile[];
}
