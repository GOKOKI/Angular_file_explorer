import { Injectable } from '@angular/core';
import { FileNode } from '../models/file-node';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class FileSystem {
  private data: FileNode[] = [
    {
      id: '1',
      name: 'Documents',
      type: 'folder',
      parentId: null,
      children: [
        {
          id: '2',
          name: 'Travail',
          type: 'folder',
          parentId: '1',
          children: [
            {
              id: '3',
              name: 'rapport',
              type: 'file',
              parentId: '2',
              extension: 'pdf',
              size: 245000,
              modifiedDate: new Date('2025-07-20')
            }
          ]
        },
        {
          id: '4',
          name: 'notes',
          type: 'file',
          parentId: '1',
          extension: 'txt',
          size: 1024,
          modifiedDate: new Date('2025-07-22')
        }
      ]
    },
    {
      id: '5',
      name: 'Images',
      type: 'folder',
      parentId: null,
      children: [
        {
          id: '6',
          name: 'vacances',
          type: 'file',
          parentId: '5',
          extension: 'jpg',
          size: 3456789,
          modifiedDate: new Date('2025-06-15')
        }
      ]
    }
  ];

  constructor() {}

  // Récupérer l'arborescence complète
  getTree(): FileNode[] {
    return JSON.parse(JSON.stringify(this.data));
  }

  // Trouver un nœud par son ID
  private findNodeById(nodes: FileNode[], id: string): FileNode | null {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = this.findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  }

  // Ajouter un nouveau nœud
  addNode(parentId: string | null, name: string, type: 'file' | 'folder'): boolean {
    const newNode: FileNode = {
      id: uuidv4(),
      name,
      type,
      parentId,
      modifiedDate: new Date()
    };

    if (type === 'file') {
      const parts = name.split('.');
      if (parts.length > 1) {
        newNode.extension = parts.pop() || '';
        newNode.name = parts.join('.');
      }
      newNode.size = Math.floor(Math.random() * 1000000);
    } else {
      newNode.children = [];
    }

    if (parentId === null) {
      this.data.push(newNode);
      return true;
    }

    const parent = this.findNodeById(this.data, parentId);
    if (parent && parent.type === 'folder') {
      if (!parent.children) parent.children = [];
      parent.children.push(newNode);
      return true;
    }

    return false;
  }

  // Supprimer un nœud
  deleteNode(id: string): boolean {
    const removeNode = (nodes: FileNode[], nodeId: string): boolean => {
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

    return removeNode(this.data, id);
  }

  // Renommer un nœud
  renameNode(id: string, newName: string): boolean {
    const node = this.findNodeById(this.data, id);
    if (node) {
      node.name = newName;
      node.modifiedDate = new Date();
      return true;
    }
    return false;
  }

  // Trouver le parent d'un nœud
  findParent(id: string): FileNode | null {
    const findParentRecursive = (nodes: FileNode[], childId: string): FileNode | null => {
      for (const node of nodes) {
        if (node.children) {
          if (node.children.some(child => child.id === childId)) {
            return node;
          }
          const found = findParentRecursive(node.children, childId);
          if (found) return found;
        }
      }
      return null;
    };

    return findParentRecursive(this.data, id);
  }
}
