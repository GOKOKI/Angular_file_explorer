export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
<<<<<<< HEAD
  parentId: string | null;
  children?: FileNode[];
  extension?: string;
  size?: number;
  modifiedDate?: Date;
}
=======
  children?: FileNode[]; // Uniquement pour les dossiers
  parentId?: string; // Optionnel pour la hiérarchie
}
>>>>>>> 3040cf26558776bd4861c58872ac4dbc754774e9
