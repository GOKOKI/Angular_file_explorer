import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileNode } from '../../models/file-node';

@Component({
  selector: 'app-file-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './file-form.html',
  styleUrls: ['./file-form.css']
})
export class FileForm {
  @Input() isEditMode: boolean = false;
  @Input() currentNode: FileNode | null = null;
  @Input() itemType: 'file' | 'folder' = 'file';
  @Output() formSubmitted = new EventEmitter<{ name: string, type: 'file' | 'folder' }>();
  @Output() cancel = new EventEmitter<void>();

  itemName: string = '';

  onSubmit() {
    if (this.itemName.trim()) {
      this.formSubmitted.emit({
        name: this.itemName,
        type: this.itemType
      });
      this.itemName = '';
    }
  }
  onCancel() {
    this.cancel.emit();
  }
}