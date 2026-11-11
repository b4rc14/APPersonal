// Punto de entrada del paquete compartido "@appersonal/shared".
// Todo lo que exportes aquí lo pueden importar web y api con:
//   import { ... } from '@appersonal/shared';

// Constante de ejemplo para comprobar que web y api importan bien este paquete.
export const APP_NAME = 'APPersonal';

// Export data types and functions from other files in this package.
export {calculateProgress} from './progress';
export type { Task, Subtask, Project } from './types';



// TODO: validaciones comunes que deban cumplirse igual en el frontend y en la API.
