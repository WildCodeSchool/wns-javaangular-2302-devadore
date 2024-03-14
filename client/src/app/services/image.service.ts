import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  imageChange: Subject<File> = new Subject<File>();
  previewUrlChange: Subject<string | ArrayBuffer | null> = new Subject<string | ArrayBuffer | null>();

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const filenameDisplay = document.getElementById('selectedFilename');

    if (filenameDisplay) {
      const filename = this.extractFilename(input);
      filenameDisplay.textContent = filename ?? 'Aucun fichier sélectionné';
    }

    const file = input.files && input.files.length ? input.files[0] : null;
    if (file) {
      this.imageChange.next(file);
      this.previewImage(file);
    }
  }

  private extractFilename(input: HTMLInputElement): string | null {
    return input.files && input.files[0] ? input.files[0].name : null;
  }

  previewImage(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrlChange.next(reader.result);
    };
    reader.readAsDataURL(file);
  }
}

