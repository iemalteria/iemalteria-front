import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-video-dialog',
  standalone: true,
  imports: [],
  templateUrl: './video-dialog.component.html',
  styleUrl: './video-dialog.component.css'
})
export class VideoDialogComponent {
  videoUrl: SafeResourceUrl;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { videoUrl: string },
    private sanitizer: DomSanitizer
  ) {
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${this.getVideoId(data.videoUrl)}`);
  }

  getVideoId(url: string): string {
    const videoId = url.split('v=')[1];
    const ampersandPosition = videoId.indexOf('&');
    return ampersandPosition !== -1 ? videoId.substring(0, ampersandPosition) : videoId;
  }
}
