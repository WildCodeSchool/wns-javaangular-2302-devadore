import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-animated-slide',
  templateUrl: './animated-slide.component.html',
  styleUrls: ['./animated-slide.component.scss'],
})
export class AnimatedSlideComponent {
  @Input() title?: String;
  @Input() position?: String;
  @Input() texte?: String;
  @Input() color?: String;
  @Input() borderMarginTitle?: String;
  @Input() quizs?: String[];
}
