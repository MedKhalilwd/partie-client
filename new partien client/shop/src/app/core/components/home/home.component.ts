import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/modules/product/model';
import { ProductService } from 'src/app/modules/product/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [
  ]
})
export class HomeComponent implements OnInit, OnDestroy{
  products: any[] = [];

  images: string[] = [
    'assets/images/image.png',
    'assets/images/bb.png',
    'assets/images/logo.png',
  ];
  currentIndex = 0;
  userPoints:any
  currentImageIndex = 0; 
  interval: any;
  items: any[] = [];

  constructor(
    private _productService:ProductService,
    private router: Router
  ){
  }
  ngOnInit(): void {
    this.getItems();

    this.startAutoSlide();

    const user = JSON.parse(localStorage.getItem('userconnect')!);
    if (user) {
      this.userPoints = user.points || 0;
      console.log("this point user", this.userPoints);
    }
    this.loadProducts();
  }
  getItems(): void {
    this._productService.getItems().subscribe(
      (res: any[]) => {
        this.items = res;
        this.images = this.items.map(item => item.image); // Assuming each item has an 'image' property
        console.log("Fetched items:", this.items);
      },
      err => {
        console.error("Error fetching items:", err);
      }
    );
  }
  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  startAutoSlide(): void {
    this.interval = setInterval(() => {
      this.nextSlide();
    }, 2000);
  }
  loadProducts(): void {

    this._productService.getAllProduct().subscribe({
        next: (data) => {
            this.products = data;
            console.log('Products loaded:', this.products);

        },
        error: (error) => {
            console.error('There was an error loading the products!', error);
        }
    });
}


  prevSlide() {
    this.currentIndex = (this.currentIndex > 0) ? this.currentIndex - 1 : this.images.length - 1;
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex < this.images.length - 1) ? this.currentIndex + 1 : 0;
  }


  goToProductDetails(product: any) {
    this.router.navigate(['/product', { product: JSON.stringify(product) }]);
    console.log("product",product);
    
  }

}
