import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FileNode } from '../../models/file-node';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-folder-tree',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ul class="tree-list">
      <li [class.selected]="node.id === selectedId">
        <span (click)="selectFolder(node)" style="cursor:pointer">
          {{ node.name }}
        </span>
        <ul *ngIf="node.children && node.children.length">
          <ng-container *ngFor="let child of node.children">
            <app-folder-tree [node]="child" [selectedId]="selectedId" (folderSelected)="folderSelected.emit($event)"></app-folder-tree>
          </ng-container>
        </ul>
      </li>
    </ul>
  `,
  styleUrls: ['./folder-tree.css']
})
export class FolderTree {
  @Input() node!: FileNode;
  @Input() selectedId!: string;
  @Output() folderSelected = new EventEmitter<FileNode>();

  selectFolder(node: FileNode) {
    this.folderSelected.emit(node);
  }
} 