export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[]; // Uniquement pour les dossiers
  parentId?: string; // Optionnel pour la hiérarchie
}