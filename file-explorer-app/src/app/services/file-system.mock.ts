import { Injectable } from '@angular/core';
import { FileNode } from '../models/file-node';

@Injectable({
  providedIn: 'root'
})
export class FileSystemMockService {
  private mockTree: FileNode = {
    id: 'root',
    name: 'Ce PC',
    type: 'folder',
    parentId: null,
    children: [
      {
        id: 'desktop',
        name: 'Bureau',
        type: 'folder',
        parentId: 'root',
        children: []
      },
      {
        id: 'documents',
        name: 'Documents',
        type: 'folder',
        parentId: 'root',
        children: [
          {
            id: 'doc1',
            name: 'Rapport',
            type: 'file',
            parentId: 'documents',
            extension: 'pdf',
            size: 245000,
            modifiedDate: new Date('2025-07-20')
          },
          {
            id: 'doc2',
            name: 'Notes',
            type: 'file',
            parentId: 'documents',
            extension: 'txt',
            size: 1024,
            modifiedDate: new Date('2025-07-22')
          }
        ]
      },
      {
        id: 'images',
        name: 'Images',
        type: 'folder',
        parentId: 'root',
        children: [
          {
            id: 'img1',
            name: 'Vacances',
            type: 'file',
            parentId: 'images',
            extension: 'jpg',
            size: 3456789,
            modifiedDate: new Date('2025-06-15')
          }
        ]
      },
      {
        id: 'music',
        name: 'Musique',
        type: 'folder',
        parentId: 'root',
        children: []
      },
      {
        id: 'videos',
        name: 'Vidéos',
        type: 'folder',
        parentId: 'root',
        children: []
      }
    ]
  };

  addNode(parentId: string, name: string, type: 'file' | 'folder') {
    console.log(`[Mock] Ajout de ${name} (${type}) au parent ${parentId}`);
    // Simulation : ajoute au dossier racine pour tester
    if (parentId === 'root') {
      this.mockTree.children?.push({
        id: Math.random().toString(36).substring(2),
        name,
        type,
        parentId, // Ajouté pour respecter FileNode
        children: type === 'folder' ? [] : undefined
      });
    }
    return this.mockTree;
  }

  getTree() {
    return this.mockTree;
  }

  deleteNode(id: string) {
    const removeNode = (nodes: FileNode[] | undefined, nodeId: string): boolean => {
      if (!nodes) return false;
      const index = nodes.findIndex(n => n.id === nodeId);
      if (index !== -1) {
        nodes.splice(index, 1);
        return true;
      }
      for (const node of nodes) {
        if (node.children && removeNode(node.children, nodeId)) {
          return true;
        }
      }
      return false;
    };
    removeNode(this.mockTree.children, id);
  }

  renameNode(id: string, newName: string) {
    const findAndRename = (nodes: FileNode[] | undefined, nodeId: string): boolean => {
      if (!nodes) return false;
      for (const node of nodes) {
        if (node.id === nodeId) {
          node.name = newName;
          return true;
        }
        if (node.children && findAndRename(node.children, nodeId)) {
          return true;
        }
      }
      return false;
    };
    findAndRename(this.mockTree.children, id);
  }
}