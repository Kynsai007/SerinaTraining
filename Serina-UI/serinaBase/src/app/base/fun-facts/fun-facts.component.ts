import { Component, OnInit, Input, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'fun-facts',
  templateUrl: './fun-facts.component.html',
  styleUrls: ['./fun-facts.component.scss']
})
export class FunFactsComponent implements OnChanges, OnDestroy {
  @Input() factsList:[] = [];
  timer:any;
  currentSlide = 0;
  constructor() { }

  ngOnChanges(changes:SimpleChanges): void {
    this.timer = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }
  nextSlide() {
    this.currentSlide++;
    if (this.currentSlide === this.factsList.length) {
      this.currentSlide = 0;
    }
  }
  selectSlide(index: number) {
    this.currentSlide = index;
  }
  isCurrentSlide(index: number) {
    return this.currentSlide === index;
  }
  ngOnDestroy() {
    clearInterval(this.timer);
    setTimeout(() => {
    }, 2000);
  }
}
