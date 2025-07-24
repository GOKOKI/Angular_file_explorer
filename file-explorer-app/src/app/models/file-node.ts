export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  parentId: string | null;
  children?: FileNode[];
  extension?: string;
  size?: number;
  modifiedDate?: Date;
}
