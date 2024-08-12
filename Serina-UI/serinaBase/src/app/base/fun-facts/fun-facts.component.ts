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
  constructor() {
    this.factsList = this.moveRandomElement(this.factsList);
   }

  ngOnChanges(changes:SimpleChanges): void {
    this.timer = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }
  moveRandomElement(arr) {
    // Step 1: Choose a random element
    const randomElementIndex = Math.floor(Math.random() * arr.length);
    const element = arr[randomElementIndex];
  
    // Step 2: Remove the element from its current position
    arr.splice(randomElementIndex, 1);
  
    // Step 3: Choose a new random position
    const newRandomIndex = Math.floor(Math.random() * arr.length);
    arr.splice(newRandomIndex, 0, element);
  
    return arr;
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
