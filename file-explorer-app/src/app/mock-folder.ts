// src/app/mock-folders.ts

export interface FileNode {
    name: string;
    type: 'folder' | 'file';
    children?: FileNode[];
  }
  
  export const MOCK_FOLDERS: FileNode[] = [
    {
      name: 'Documents',
      type: 'folder',
      children: [
        { name: 'CV.pdf', type: 'file' },
        { name: 'Lettre.docx', type: 'file' },
        {
          name: 'Photos',
          type: 'folder',
          children: [
            { name: 'vacances.jpg', type: 'file' }
          ]
        }
      ]
    },
    {
      name: 'Musique',
      type: 'folder',
      children: [
        { name: 'chanson.mp3', type: 'file' }
      ]
    }
  ];